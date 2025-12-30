import { useQuery } from '@tanstack/react-query';
import { client } from '@/api/client';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { TaskDetailResponse } from '@/types/api';

export const useTask = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.task(id),
    queryFn: async () => {
      const { data } = await client.get<TaskDetailResponse>(`/api/task/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
