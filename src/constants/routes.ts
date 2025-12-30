// Route path constants
export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  TASK_LIST: '/task',
  TASK_DETAIL: (id: string) => `/task/${id}`,
  USER: '/user',
} as const;
