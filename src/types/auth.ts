// Authentication related types

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  redirectAfterLoginPath: string | null;
}

export interface AuthActions {
  login: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  setRedirectPath: (path: string | null) => void;
}

export interface AuthStore extends AuthState, AuthActions {
  isAuthenticated: boolean; // Derived state from accessToken
}
