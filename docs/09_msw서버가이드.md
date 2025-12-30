# MSW (Mock Service Worker) 서버 구현 가이드

## 1. 개요

### 1.1 MSW란?

MSW(Mock Service Worker)는 Service Worker API를 활용하여 네트워크 레벨에서 API 요청을 가로채고 모킹하는 라이브러리입니다. 실제 API 서버 없이도 프론트엔드 개발과 테스트를 진행할 수 있게 해줍니다.

### 1.2 MSW 선택 이유

| 항목 | 설명 |
|:---|:---|
| 네트워크 레벨 모킹 | 브라우저 DevTools에서 실제 네트워크 요청처럼 확인 가능 |
| 코드 재사용 | 개발/테스트 환경에서 동일한 핸들러 사용 |
| 전환 용이성 | 실제 API 전환 시 코드 변경 최소화 |
| 요청/응답 흐름 | 실제 API와 동일한 요청/응답 흐름 유지 |

### 1.3 명세 요구사항

> "MSW / 함수 레벨 모킹 / Mock 서버 / 별도 서버 구축 중 1가지 이상 선택"
> "명세에 정의된 전체 API 스펙 구현 필수"
> "Mocking 구성 및 관련 코드 제출 필수"

### 1.4 📌 페이지네이션 규격 (임의 정의)

> ⚠️ **원본 명세에 페이지당 아이템 수가 정의되어 있지 않습니다.**
> 아래 값은 임의로 정의한 것입니다.

| 항목 | 값 | 비고 |
|:---|:---|:---|
| `PAGE_SIZE` | **20** | 한 페이지당 아이템 수 |
| `TOTAL_ITEMS` | **47** | Mock 데이터 총 개수 (3페이지 분량: 20+20+7) |
| 마지막 페이지 판단 | `lastPage.length < PAGE_SIZE` | 응답 배열 길이가 20 미만이면 마지막 페이지 |

### 1.5 📌 id 필드 추가 (원본 명세 해석)

> 원본 명세의 할 일 목록 API 응답에는 `{ title, memo, status }`만 정의되어 있습니다.
> 그러나 "할 일 클릭 시 상세 페이지로 이동" 요구사항과 `GET /api/task/:id` API의 존재를 고려할 때,
> 목록 API 응답에 `id` 필드가 반드시 포함되어야 합니다.
> **이는 원본 명세의 암묵적 요구사항을 명시적으로 해석한 것입니다.**

---

## 2. 프로젝트 구조

```
src/
└── mocks/
    ├── handlers/
    │   ├── index.ts          # 핸들러 통합 export
    │   ├── auth.ts           # 인증 관련 (sign-in, refresh)
    │   ├── dashboard.ts      # 대시보드 API
    │   ├── task.ts           # 할 일 목록/상세/삭제 API
    │   └── user.ts           # 회원정보 API
    ├── data/
    │   ├── tasks.ts          # Mock 할 일 데이터
    │   └── users.ts          # Mock 사용자 데이터
    ├── utils/
    │   └── auth.ts           # 인증 유틸리티 (토큰 검증 등)
    ├── browser.ts            # 브라우저 환경 설정
    └── server.ts             # 테스트 환경 설정 (Node.js)
```

---

## 3. 설치 및 초기 설정

### 3.1 패키지 설치

```bash
npm install msw --save-dev
# 또는
yarn add msw --dev
```

### 3.2 Service Worker 초기화

```bash
npx msw init public/ --save
```

이 명령은 `public/mockServiceWorker.js` 파일을 생성합니다.

### 3.3 브라우저 환경 설정

```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

### 3.4 애플리케이션 진입점 설정

```typescript
// src/main.tsx
async function enableMocking() {
    if (import.meta.env.DEV) {
        const { worker } = await import('./mocks/browser');
        return worker.start({
            onUnhandledRequest: 'bypass', // 처리되지 않은 요청은 그대로 통과
        });
    }
}

enableMocking().then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
});
```

---

## 4. API 핸들러 구현

### 4.1 핸들러 통합

```typescript
// src/mocks/handlers/index.ts
import { authHandlers } from './auth';
import { dashboardHandlers } from './dashboard';
import { taskHandlers } from './task';
import { userHandlers } from './user';

export const handlers = [
    ...authHandlers,
    ...dashboardHandlers,
    ...taskHandlers,
    ...userHandlers,
];
```

### 4.2 인증 핸들러 (auth.ts)

```typescript
// src/mocks/handlers/auth.ts
import { http, HttpResponse, delay } from 'msw';

// 테스트 계정
const TEST_USER = {
    email: 'test@example.com',
    password: 'password123',
};

// 간단한 JWT 생성 (실제로는 더 복잡한 로직 필요)
const generateToken = (userId: string, expiresIn: number) => {
    const payload = {
        id: userId,
        exp: Math.floor(Date.now() / 1000) + expiresIn,
    };
    return btoa(JSON.stringify(payload));
};

export const authHandlers = [
    // 로그인
    http.post('/api/sign-in', async ({ request }) => {
        await delay(500); // 네트워크 지연 시뮬레이션

        const body = (await request.json()) as { email: string; password: string };

        // 유효성 검증
        if (body.email === TEST_USER.email && body.password === TEST_USER.password) {
            return HttpResponse.json({
                accessToken: generateToken('user-001', 3600),      // 1시간
                refreshToken: generateToken('user-001', 604800),   // 7일
            });
        }

        return HttpResponse.json(
            { errorMessage: '이메일 또는 비밀번호가 올바르지 않습니다.' },
            { status: 400 }
        );
    }),

    // 토큰 갱신
    http.post('/api/refresh', async ({ request }) => {
        await delay(200);

        const authHeader = request.headers.get('Authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            return HttpResponse.json(
                { errorMessage: '유효하지 않은 토큰입니다.' },
                { status: 400 }
            );
        }

        // 새 토큰 발급
        return HttpResponse.json({
            accessToken: generateToken('user-001', 3600),
            refreshToken: generateToken('user-001', 604800),
        });
    }),
];
```

### 4.3 대시보드 핸들러 (dashboard.ts)

```typescript
// src/mocks/handlers/dashboard.ts
import { http, HttpResponse, delay } from 'msw';
import { checkAuth } from '../utils/auth';

export const dashboardHandlers = [
    /**
     * 대시보드 조회
     *
     * 💡 설계 결정 (프론트엔드 401 처리):
     * - 대시보드는 비로그인 사용자도 접근 가능한 랜딩 페이지로 활용
     * - 401 응답 시 리다이렉트 없이 로그인 유도 UI 표시
     * - 보호된 페이지(/task, /task/:id, /user)와 달리 즉시 리다이렉트 하지 않음
     */
    http.get('/api/dashboard', async ({ request }) => {
        await delay(300);

        // 인증 체크
        const authError = checkAuth(request);
        if (authError) return authError;

        return HttpResponse.json({
            numOfTask: 47,
            numOfRestTask: 32,
            numOfDoneTask: 15,
        });
    }),
];
```

### 4.4 할 일 핸들러 (task.ts) - ⚠️ 명세 준수

```typescript
// src/mocks/handlers/task.ts
import { http, HttpResponse, delay } from 'msw';
import { checkAuth } from '../utils/auth';
import { mockTasks } from '../data/tasks';

// 페이지 크기 상수
const PAGE_SIZE = 20;

export const taskHandlers = [
    /**
     * 할 일 목록 조회
     *
     * ⚠️ 명세 준수 사항:
     * - 응답은 배열 단독 반환 (meta 객체 없음)
     * - 무한 스크롤 종료 판단: 응답 배열 길이 < PAGE_SIZE
     *
     * 📌 id 필드 추가 (명세 확장):
     * - 원본 명세: { title, memo, status }
     * - 실제 구현: { id, title, memo, status }
     * - 이유: 명세에서 "할 일을 클릭 시 각 상세페이지로 이동"을 요구하므로
     *         상세 페이지 라우팅(/task/:id)을 위해 id 필드가 필수적으로 필요
     * - 이는 명세에 명시되지 않았으나 기능 구현상 필수적인 확장
     */
    http.get('/api/task', async ({ request }) => {
        await delay(300);

        // 인증 체크
        const authError = checkAuth(request);
        if (authError) return authError;

        // 페이지네이션 파라미터 추출
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page')) || 1;

        // 페이지네이션 계산
        const startIndex = (page - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;

        // 현재 페이지 데이터 추출
        const data = mockTasks.slice(startIndex, endIndex).map((task) => ({
            id: task.id,           // 상세 페이지 이동을 위해 필수 추가
            title: task.title,
            memo: task.memo,
            status: task.status,
        }));

        // 📌 명세: 배열 단독 반환 (meta 없음)
        return HttpResponse.json(data);
    }),

    /**
     * 할 일 상세 조회
     *
     * ⚠️ 명세 준수 사항:
     * - 응답: { title, memo, registerDatetime }
     * - id, status 필드는 명세에 없음
     */
    http.get('/api/task/:id', async ({ request, params }) => {
        await delay(200);

        // 인증 체크
        const authError = checkAuth(request);
        if (authError) return authError;

        const { id } = params;
        const task = mockTasks.find((t) => t.id === id);

        if (!task) {
            return HttpResponse.json(
                { errorMessage: '할 일을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 📌 명세: { title, memo, registerDatetime } 만 반환
        return HttpResponse.json({
            title: task.title,
            memo: task.memo,
            registerDatetime: task.registerDatetime,
        });
    }),

    /**
     * 할 일 삭제
     *
     * 📌 원본 명세 상황:
     * - 원본 명세에는 DELETE API endpoint 정의가 없음
     * - 명세에는 "삭제 확인 모달에서 id 입력 후 제출 시 목록으로 redirect"만 명시
     *
     * 📌 구현 선택지:
     * 1. DELETE API 구현 → 실제 API 전환 대비, 더 현실적인 흐름
     * 2. API 호출 없이 redirect만 처리 → 명세 최소 충족
     *
     * 아래는 실제 API 전환을 대비하여 DELETE API를 구현한 예시입니다.
     * API 호출 없이 redirect만 해도 명세 요구사항은 충족합니다.
     */
    http.delete('/api/task/:id', async ({ request, params }) => {
        await delay(300);

        // 인증 체크
        const authError = checkAuth(request);
        if (authError) return authError;

        const { id } = params;
        const taskIndex = mockTasks.findIndex((t) => t.id === id);

        if (taskIndex === -1) {
            return HttpResponse.json(
                { errorMessage: '할 일을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        return HttpResponse.json({
            message: '할 일이 삭제되었습니다.',
        });
    }),
];
```

### 4.5 회원정보 핸들러 (user.ts)

```typescript
// src/mocks/handlers/user.ts
import { http, HttpResponse, delay } from 'msw';
import { checkAuth } from '../utils/auth';

export const userHandlers = [
  http.get('/api/user', async ({ request }) => {
    await delay(200);

    // 인증 체크
    const authError = checkAuth(request);
    if (authError) return authError;

    return HttpResponse.json({
      name: '홍길동',
      memo: '프론트엔드 개발자',
    });
  }),
];
```

---

## 5. 유틸리티 및 Mock 데이터

### 5.1 인증 유틸리티 (utils/auth.ts)

```typescript
// src/mocks/utils/auth.ts
import { HttpResponse } from 'msw';

/**
 * 요청의 인증 상태를 확인합니다.
 * 인증 실패 시 401 응답을 반환하고, 성공 시 null을 반환합니다.
 */
export const checkAuth = (request: Request) => {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return HttpResponse.json(
      { errorMessage: '인증이 필요합니다.' },
      { status: 401 }
    );
  }

  // 토큰 만료 체크 (선택적)
  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token));
    
    if (payload.exp < Date.now() / 1000) {
      return HttpResponse.json(
        { errorMessage: '토큰이 만료되었습니다.' },
        { status: 401 }
      );
    }
  } catch {
    return HttpResponse.json(
      { errorMessage: '유효하지 않은 토큰입니다.' },
      { status: 401 }
    );
  }

  return null; // 인증 성공
};
```

### 5.2 Mock 할 일 데이터 (data/tasks.ts)

```typescript
// src/mocks/data/tasks.ts
export type TaskStatus = 'TODO' | 'DONE';

export interface MockTask {
  id: string;              // 상세 페이지 이동용 (명세 확장)
  title: string;
  memo: string;
  status: TaskStatus;
  registerDatetime: string;
}

// 47개의 Mock 데이터 생성 (무한 스크롤 테스트용)
export const mockTasks: MockTask[] = Array.from({ length: 47 }, (_, index) => {
  const id = `task-${String(index + 1).padStart(3, '0')}`;
  const status: TaskStatus = Math.random() > 0.3 ? 'TODO' : 'DONE';
  
  // 등록 일시: 최근 30일 내 랜덤
  const daysAgo = Math.floor(Math.random() * 30);
  const registerDate = new Date();
  registerDate.setDate(registerDate.getDate() - daysAgo);
  
  return {
    id,
    title: `할 일 ${index + 1}`,
    memo: `할 일 ${index + 1}에 대한 메모입니다.\n세부 내용이 여기에 들어갑니다.`,
    status,
    registerDatetime: registerDate.toISOString(),
  };
});

// 데이터 정렬 (최신순)
mockTasks.sort((a, b) => 
  new Date(b.registerDatetime).getTime() - new Date(a.registerDatetime).getTime()
);
```

---

## 6. TypeScript 타입 정의 (명세 기준)

```typescript
// src/types/api.ts

// ============================================
// 공통 타입
// ============================================

/** API 에러 응답 */
interface ApiErrorResponse {
  errorMessage: string;
}

// ============================================
// 인증 (Authentication)
// ============================================

/** 로그인 요청 */
interface SignInRequest {
  email: string;
  password: string;
}

/** 토큰 응답 (로그인, 토큰갱신 공통) */
interface TokenResponse {
  accessToken: string;   // jwt, decoded -> { id: string, exp: timestamp }
  refreshToken: string;  // jwt, decoded -> { id: string, exp: timestamp }
}

/** JWT Payload (decoded) */
interface JwtPayload {
  id: string;
  exp: number;  // timestamp
}

// ============================================
// 사용자 (User)
// ============================================

/** 회원정보 응답 - 명세 기준 */
interface UserResponse {
  name: string;
  memo: string;
}

// ============================================
// 대시보드 (Dashboard)
// ============================================

/** 대시보드 응답 - 명세 기준 */
interface DashboardResponse {
  numOfTask: number;
  numOfRestTask: number;
  numOfDoneTask: number;
}

// ============================================
// 할 일 (Task)
// ============================================

/** 할 일 상태 */
type TaskStatus = 'TODO' | 'DONE';

/**
 * 할 일 목록 아이템 - 명세 + 확장
 * 
 * 원본 명세: { title, memo, status }
 * 📌 필수 확장: id (상세 페이지 라우팅에 필요)
 */
interface TaskListItem {
  id: string;        // 상세 페이지 이동을 위해 필수 추가
  title: string;
  memo: string;
  status: TaskStatus;
}

/**
 * 할 일 목록 응답 - 명세 기준
 * 
 * ⚠️ 배열 단독 반환 (meta 객체 없음)
 */
type TaskListResponse = TaskListItem[];

/**
 * 할 일 상세 응답 - 명세 기준
 * 
 * ⚠️ 원본 명세: { title, memo, registerDatetime }
 * (id, status 필드 없음)
 */
interface TaskDetailResponse {
  title: string;
  memo: string;
  registerDatetime: string;  // ISO 8601
}
```

---

## 7. API 엔드포인트 요약 (명세 기준)

> 💡 **설계 결정**: 대시보드(`/`)는 401 시 로그인 페이지로 리다이렉트하지 않고, 페이지 레벨에서 로그인 유도 UI를 표시한다.

| Method | Endpoint | 인증 | 성공 | 에러 | 응답 형태 | 401 FE 처리 |
|:---|:---|:---:|:---:|:---|:---|:---|
| POST | `/api/sign-in` | ❌ | 200 | 400 | `{ accessToken, refreshToken }` | - |
| POST | `/api/refresh` | ✅ | 200 | 400 | `{ accessToken, refreshToken }` | - |
| GET | `/api/user` | ✅ | 200 | 401 | `{ name, memo }` | 즉시 리다이렉트 |
| GET | `/api/dashboard` | ✅ | 200 | 401 | `{ numOfTask, numOfRestTask, numOfDoneTask }` | 💡 로그인 유도 UI |
| GET | `/api/task` | ✅ | 200 | 400, 401 | **배열** `[{ title, memo, status }]` | 즉시 리다이렉트 |
| GET | `/api/task/:id` | ✅ | 200 | 401, 404 | `{ title, memo, registerDatetime }` | 즉시 리다이렉트 |
| DELETE | `/api/task/:id` | ✅ | 200 | 401, 404 | (명세에 endpoint 정의 없음) | 즉시 리다이렉트 |

---

## 8. 테스트 계정

| 항목 | 값 |
|:---|:---|
| 이메일 | `test@example.com` |
| 비밀번호 | `password123` |

---

## 9. 명세와 Mock 구현의 차이점 (의사결정 사항)

### 9.1 `/api/task` 목록 응답

| 항목 | 원본 명세 | Mock 구현 | 이유 |
|:---|:---|:---|:---|
| 응답 형태 | 배열 단독 | 배열 단독 ✅ | 명세 준수 |
| id 필드 | ❌ 없음 | ✅ 추가 | 명세에서 "할 일 클릭 시 상세 페이지 이동" 요구 → 라우팅에 id 필수 |
| meta 객체 | ❌ 없음 | ❌ 없음 ✅ | 명세 준수 |

> 📌 **id 필드 추가 근거**: 원본 명세에서 "할 일을 클릭 시 각 상세페이지로 이동해주세요"라고 요구하고 있으며, 상세 페이지 라우트가 `/task/:id`이므로 id 값이 반드시 필요합니다. 이는 명세에 명시되지 않았으나 기능 구현상 필수적인 확장입니다.

### 9.2 `/api/task/:id` 상세 응답

| 항목 | 원본 명세 | Mock 구현 | 이유 |
|:---|:---|:---|:---|
| id 필드 | ❌ 없음 | ❌ 없음 ✅ | 명세 준수 |
| status 필드 | ❌ 없음 | ❌ 없음 ✅ | 명세 준수 |
| title, memo, registerDatetime | ✅ 있음 | ✅ 있음 | 명세 준수 |

### 9.3 무한 스크롤 종료 판단

```typescript
// 명세에 meta.hasNextPage가 없으므로 배열 길이로 판단
const PAGE_SIZE = 20;

const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['tasks'],
  queryFn: ({ pageParam = 1 }) => fetchTasks(pageParam),
  getNextPageParam: (lastPage, allPages) => {
    // 배열 길이가 PAGE_SIZE 미만이면 마지막 페이지
    if (lastPage.length < PAGE_SIZE) {
      return undefined;  // 더 이상 페이지 없음
    }
    return allPages.length + 1;  // 다음 페이지 번호
  },
});
```

### 9.4 DELETE API

| 항목 | 원본 명세 | 설명 |
|:---|:---|:---|
| DELETE /api/task/:id | endpoint 정의 없음 | 명세에는 "삭제 확인 모달에서 id 입력 후 제출 시 목록으로 redirect"만 명시 |

> 📌 **구현 선택지**:
> 1. **DELETE API 구현** → 실제 API 전환을 대비하여 더 현실적인 흐름 구현
> 2. **API 호출 없이 redirect만 처리** → 명세 최소 요구사항 충족
>
> 어느 방식이든 명세 요구사항은 충족합니다. 본 문서에서는 실제 API 전환을 대비하여 DELETE API를 구현했습니다.

---

## 10. 프론트엔드 연동 가이드

### 10.1 할 일 목록 무한 스크롤

```typescript
// src/features/task/hooks/useTasks.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { taskApi } from '../api/taskApi';

const PAGE_SIZE = 20;

export const useTasks = () => {
  return useInfiniteQuery({
    queryKey: ['tasks'],
    queryFn: ({ pageParam = 1 }) => taskApi.getTasks(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // 📌 배열 길이로 다음 페이지 존재 여부 판단
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });
};
```

### 10.2 할 일 상세 조회 (id는 URL에서 획득)

```typescript
// src/pages/TaskDetailPage.tsx
import { useParams } from 'react-router-dom';
import { useTask } from '@/features/task/hooks/useTask';

export const TaskDetailPage = () => {
  // URL에서 id 획득
  const { id } = useParams<{ id: string }>();
  
  // API 응답: { title, memo, registerDatetime }
  const { data: task, isLoading, error } = useTask(id!);

  // 삭제 확인 모달에서 id 검증 시 URL의 id 사용
  const handleDeleteConfirm = (inputValue: string) => {
    if (inputValue === id) {
      // 삭제 처리 후 목록으로 이동
      navigate('/task');
    }
  };

  // ...
};
```

---

## 11. 에러 처리 시나리오

### 11.1 400 Bad Request

- 로그인 실패 (잘못된 이메일/비밀번호)
- 토큰 갱신 실패

```typescript
return HttpResponse.json(
  { errorMessage: '이메일 또는 비밀번호가 올바르지 않습니다.' },
  { status: 400 }
);
```

### 11.2 401 Unauthorized

- 토큰 누락
- 토큰 만료
- 유효하지 않은 토큰

```typescript
return HttpResponse.json(
  { errorMessage: '인증이 필요합니다.' },
  { status: 401 }
);
```

**프론트엔드 처리**:

| 페이지 유형 | 401 처리 |
|:---|:---|
| 대시보드 (`/`) | 💡 로그인 유도 UI 표시 (리다이렉트 없음) |
| 보호된 페이지 (`/task`, `/task/:id`, `/user`) | 즉시 `/sign-in` 리다이렉트 |

### 11.3 404 Not Found

- 존재하지 않는 할 일 조회

```typescript
return HttpResponse.json(
  { errorMessage: '할 일을 찾을 수 없습니다.' },
  { status: 404 }
);
```

---

## 12. 테스트 환경 설정 (선택)

### 12.1 Node.js 환경 (Jest/Vitest)

```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### 12.2 테스트 설정

```typescript
// src/test/setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 13. 구현 체크리스트

### 13.1 필수 구현

- [ ] MSW 설치 및 Service Worker 초기화
- [ ] 브라우저 환경 설정 (`browser.ts`)
- [ ] 애플리케이션 진입점에서 MSW 활성화
- [ ] 로그인 API 핸들러 (`POST /api/sign-in`)
- [ ] 토큰 갱신 API 핸들러 (`POST /api/refresh`)
- [ ] 대시보드 API 핸들러 (`GET /api/dashboard`)
- [ ] 할 일 목록 API 핸들러 (`GET /api/task`) - **배열 반환, id 포함**
- [ ] 할 일 상세 API 핸들러 (`GET /api/task/:id`) - **title, memo, registerDatetime만**
- [ ] 회원정보 API 핸들러 (`GET /api/user`)
- [ ] 인증 검증 유틸리티
- [ ] Mock 데이터 생성 (47개 이상, 무한 스크롤 테스트용)

### 13.2 명세 준수 체크

- [ ] `/api/task` 응답이 배열 단독인가?
- [ ] `/api/task` 응답에 meta 객체가 없는가?
- [ ] `/api/task` 응답에 id 필드가 포함되어 있는가? (상세 페이지 이동용)
- [ ] `/api/task/:id` 응답에 id, status가 없는가?
- [ ] 무한 스크롤 종료 판단을 배열 길이로 하는가?

### 13.3 선택 구현

- [ ] 테스트 환경 설정 (`server.ts`)
- [ ] 토큰 만료 체크 로직
- [ ] 네트워크 지연 시뮬레이션
- [ ] DELETE API 핸들러 (명세에 endpoint 정의 없음, 선택적)

---

## 14. 참고 자료

- [MSW 공식 문서](https://mswjs.io/)
- [MSW v2 마이그레이션 가이드](https://mswjs.io/docs/migrations/1.x-to-2.x)
- [MSW + Vite 설정](https://mswjs.io/docs/integrations/browser)
