import { HttpResponse } from 'msw';
import { MESSAGES } from '@/constants/messages';

/**
 * Check authentication from request headers
 * Returns 401 response if authentication fails, null if succeeds
 */
export const checkAuth = (request: Request) => {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return HttpResponse.json(
      { errorMessage: MESSAGES.AUTH_REQUIRED },
      { status: 401 }
    );
  }

  // Token expiration check (optional)
  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token));

    if (payload.exp < Date.now() / 1000) {
      return HttpResponse.json(
        { errorMessage: MESSAGES.TOKEN_EXPIRED },
        { status: 401 }
      );
    }
  } catch {
    return HttpResponse.json(
      { errorMessage: MESSAGES.INVALID_TOKEN },
      { status: 401 }
    );
  }

  return null; // Authentication successful
};

/**
 * Generate mock JWT token
 */
export const generateToken = (userId: string, expiresIn: number): string => {
  const payload = {
    id: userId,
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };
  return btoa(JSON.stringify(payload));
};
