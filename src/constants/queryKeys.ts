// React Query keys
export const QUERY_KEYS = {
  dashboard: ['dashboard'] as const,
  tasks: ['tasks'] as const,
  task: (id: string) => ['task', id] as const,
  user: ['user'] as const,
} as const;
