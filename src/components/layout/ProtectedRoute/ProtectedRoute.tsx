import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setRedirectPath = useAuthStore((state) => state.setRedirectPath);
  const location = useLocation();

  console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated, 'path:', location.pathname);

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to sign-in');
    // Save current path for redirect after login
    setRedirectPath(location.pathname);
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  console.log('[ProtectedRoute] Authenticated, rendering protected content');
  return <>{children}</>;
};
