import { useAuthStore } from '@/contexts/AuthContext';

export const useAuth = () => {
  const { isAuthenticated, login, logout, setRedirectPath, redirectAfterLoginPath } =
    useAuthStore();

  return {
    isAuthenticated,
    login,
    logout,
    setRedirectPath,
    redirectAfterLoginPath,
  };
};
