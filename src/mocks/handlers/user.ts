import { http, HttpResponse, delay } from 'msw';
import { checkAuth } from '../utils/auth';

export const userHandlers = [
  http.get('/api/user', async ({ request }) => {
    await delay(200);

    // Authentication check
    const authError = checkAuth(request);
    if (authError) return authError;

    return HttpResponse.json({
      name: '홍길동',
      memo: '프론트엔드 개발자',
    });
  }),
];
