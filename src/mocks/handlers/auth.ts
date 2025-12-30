import { http, HttpResponse, delay } from 'msw';
import { generateToken } from '../utils/auth';
import { MESSAGES } from '@/constants/messages';

// Test account
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
};

export const authHandlers = [
  // Sign in
  http.post('/api/sign-in', async ({ request }) => {
    await delay(500); // Network delay simulation

    const body = (await request.json()) as {
      email: string;
      password: string;
    };

    // Validation
    if (body.email === TEST_USER.email && body.password === TEST_USER.password) {
      return HttpResponse.json({
        accessToken: generateToken('user-001', 3600), // 1 hour
        refreshToken: generateToken('user-001', 604800), // 7 days
      });
    }

    return HttpResponse.json(
      { errorMessage: MESSAGES.LOGIN_FAILED },
      { status: 400 }
    );
  }),

  // Token refresh
  http.post('/api/refresh', async ({ request }) => {
    await delay(200);

    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { errorMessage: MESSAGES.INVALID_TOKEN },
        { status: 400 }
      );
    }

    // Issue new tokens
    return HttpResponse.json({
      accessToken: generateToken('user-001', 3600),
      refreshToken: generateToken('user-001', 604800),
    });
  }),
];
