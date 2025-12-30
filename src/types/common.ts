// Common utility types

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export interface PaginationParams {
  page: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: Error | null;
}
