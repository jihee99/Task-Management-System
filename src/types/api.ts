// ============================================
// Common Types
// ============================================

/** API Error Response */
export interface ApiErrorResponse {
  errorMessage: string;
}

// ============================================
// Authentication
// ============================================

/** Login Request */
export interface SignInRequest {
  email: string;
  password: string;
}

/** Token Response (Login, Refresh common) */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/** JWT Payload (decoded) */
export interface JwtPayload {
  id: string;
  exp: number; // Unix timestamp
}

// ============================================
// User
// ============================================

/** User Info Response */
export interface UserResponse {
  name: string;
  memo: string;
}

// ============================================
// Dashboard
// ============================================

/** Dashboard Response */
export interface DashboardResponse {
  numOfTask: number;
  numOfRestTask: number;
  numOfDoneTask: number;
}

// ============================================
// Task
// ============================================

/** Task Status */
export type TaskStatus = 'TODO' | 'DONE';

/**
 * Task List Item
 *
 * Original spec: { title, memo, status }
 * Extended: Added `id` field for navigation to detail page
 * Reason: Required for routing to /task/:id when clicking task cards
 */
export interface TaskListItem {
  id: string; // Required for detail page navigation
  title: string;
  memo: string;
  status: TaskStatus;
}

/**
 * Task List Response
 *
 * IMPORTANT: Returns array directly (no meta object)
 * This matches the API spec exactly
 */
export type TaskListResponse = TaskListItem[];

/**
 * Task Detail Response
 *
 * Original spec: { title, memo, registerDatetime }
 * (No id or status fields in response)
 */
export interface TaskDetailResponse {
  id: string;
  title: string;
  memo: string;
  status: TaskStatus;
  registerDatetime: string; // ISO 8601 format
}

/** Task Delete Response */
export interface TaskDeleteResponse {
  message: string;
}
