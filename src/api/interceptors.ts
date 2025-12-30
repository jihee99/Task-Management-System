import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

export const setupInterceptors = (client: AxiosInstance) => {
  // Request interceptor: Add Authorization header
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const { accessToken } = useAuthStore.getState();

      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle 401 errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;

      if (status === 401) {
        const currentPath = window.location.pathname;

        // 대시보드는 랜딩 페이지이므로 401 리다이렉트 제외
        // 페이지 레벨에서 로그인 유도 UI 표시
        if (currentPath === ROUTES.HOME) {
          console.log('[Interceptor] Dashboard 401 - skipping redirect');
          return Promise.reject(error);
        }

        // 보호된 페이지: 즉시 리다이렉트
        const { setRedirectPath, logout } = useAuthStore.getState();

        console.log('[Interceptor] Protected page 401 - redirecting to login');

        // Save current path for redirect after login
        if (currentPath !== ROUTES.SIGN_IN) {
          setRedirectPath(currentPath);
        }

        // Clear tokens
        logout();

        // Redirect to login page
        window.location.href = ROUTES.SIGN_IN;
      }

      return Promise.reject(error);
    }
  );
};
