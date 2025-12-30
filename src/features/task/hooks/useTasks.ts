import { useInfiniteQuery } from '@tanstack/react-query';
import { client } from '@/api/client';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { TaskListResponse } from '@/types/api';

const PAGE_SIZE = 20;

export const useTasks = () => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.tasks,
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await client.get<TaskListResponse>('/api/task', {
        params: { page: pageParam },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If last page has fewer items than PAGE_SIZE, we've reached the end
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });
};
