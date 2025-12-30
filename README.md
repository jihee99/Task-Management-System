# 할 일 관리 시스템 (Task Management System)

> 원본 명세와 의사결정 문서를 반영한 프로젝트 요약 문서

---

## 1. 프로젝트 개요

- **목적**: 인증 기반의 할 일 관리 시스템 구축
- **필수 기술**: React 18/19 + TypeScript
- **핵심 구현 범위**: 로그인, 대시보드, 할 일 목록/상세, 회원정보
- **성능 요구**: 가상 스크롤링 + 무한 스크롤
- **디자인 요구**: Pretendard 폰트, 컬러 토큰(primary=blue, disabled=gray)

---

## 2. 명세 요약

### 페이지/라우팅
- `/` 대시보드: numOfTask, numOfRestTask, numOfDoneTask 표시
- `/sign-in` 로그인: 유효성 검증, 400 에러 모달
- `/task` 목록: 카드 목록, 가상 스크롤, 무한 스크롤
- `/task/:id` 상세: 상세 정보, 삭제 모달
- `/user` 회원정보: 사용자 정보 표시

### 에러 처리
- 400: 에러 모달 (errorMessage 표시)
- 401: 보호된 페이지 즉시 로그인 리다이렉트
- 404: Not Found 렌더링 (할 일 상세)

### 모달
- 에러 모달: errorMessage 표시
- 삭제 확인 모달: ID 입력 일치 시에만 제출 활성화

---

## 3. 주요 의사결정 (명세 외 결정)

- **대시보드 401 처리**: 비로그인 사용자도 `/` 접근 가능. 401 응답 시 리다이렉트 없이 로그인 유도 UI 표시
- **GNB/LNB 통합**: 명세의 GNB/LNB를 단일 전역 네비게이션으로 구성
- **회원정보 라우트**: `/user`로 정의
- **목록 API 응답**: 원본 명세에 없는 `id` 필드를 목록 응답에 추가(상세 이동 요구사항 충족 목적)
- **페이지네이션 규격**: `PAGE_SIZE=20`, `TOTAL_ITEMS=47` (예시 화면 참고로 임의 정의)
- **토큰 저장 전략**: access/refresh token은 zustand persist로 localStorage에 저장, redirectAfterLoginPath는 sessionStorage에 저장

---

## 4. 사용자 흐름 요약

- **로그인**: 유효성 통과 시 제출 활성화 → 성공 시 대시보드 이동, 실패(400) 시 에러 모달
- **보호된 페이지** (`/task`, `/task/:id`, `/user`): 401 시 즉시 로그인 페이지로 이동 + 원래 경로 저장
- **대시보드**: 401 시 로그인 유도 UI 표시 (리다이렉트 없음)
- **할 일 상세 삭제**: 삭제 모달에서 ID 일치 입력 시만 제출 활성화 → 목록으로 이동

---

## 5. 기술 스택

- **프레임워크/언어**: React 18, TypeScript 5
- **빌드**: Vite 5
- **라우팅**: React Router v6
- **서버 상태**: TanStack Query v5
- **전역 상태**: Zustand
- **폼/검증**: React Hook Form + Zod
- **가상 스크롤링**: @tanstack/react-virtual
- **HTTP**: Axios
- **Mocking**: MSW v2
- **스타일**: Tailwind CSS
- **정적 분석**: ESLint 8 + Prettier 3, TS strict

---

## 6. 아키텍처 요약

### 설계 원칙
- 관심사 분리 (UI/비즈니스/데이터 레이어)
- 단방향 의존성 (pages → features → components)
- 코로케이션 및 모듈 Public API 명시

### 폴더 구조 (현재 구현 기준)
```
src/
├── app/                  # 앱 진입점, 라우터, providers
│   └── providers/         # AuthProvider, QueryProvider
├── pages/                # 라우트 매핑 페이지
├── features/             # 도메인별 components + hooks
├── components/           # 공통 UI/레이아웃/피드백
├── hooks/                # 공통 훅 (useAuth)
├── api/                  # API 클라이언트/인터셉터
├── contexts/             # zustand auth store
├── mocks/                # MSW 핸들러/데이터
├── styles/               # 디자인 토큰, 글로벌 스타일
├── constants/            # 라우트/쿼리키 상수
├── types/                # 공통 타입
├── main.tsx              # 엔트리 포인트
└── vite-env.d.ts         # Vite 타입 선언
```

---

## 7. 상태 관리 설계

- **전역 상태**: 인증 토큰, 로그인 여부, 로그인 후 복귀 경로
- **서버 상태**: 대시보드/할 일/회원정보 API 응답
- **로컬 UI 상태**: 폼 입력, 모달 열림, 로딩/에러 표시

---

## 8. API 요약

- `POST /api/sign-in`: 로그인 (200 토큰 발급, 400 에러 모달)
- `POST /api/refresh`: 토큰 갱신 (선택 구현)
- `GET /api/dashboard`: 대시보드 데이터
- `GET /api/task`: 할 일 목록 (무한 스크롤)
- `GET /api/task/:id`: 할 일 상세
- `GET /api/user`: 회원정보
- `DELETE /api/task/:id`: 상세 삭제 (UX 플로우 확인 목적)

---

## 9. MSW Mocking

- 네트워크 레벨 모킹, 실제 API와 동일한 요청/응답 흐름 유지
- 개발/테스트 환경에서 동일한 핸들러 재사용
- 명세 전체 API 스펙을 Mock으로 제공

---

## 10. 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (MSW 자동 활성화)
npm run dev
```

---

## 11. 품질 기준

- TypeScript strict 모드 적용
- ESLint로 논리적 오류 방지
- Prettier로 코드 형식 통일
