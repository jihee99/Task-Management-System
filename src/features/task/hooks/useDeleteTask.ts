import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/api/client';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/api/task/${id}`);
    },
    onSuccess: () => {
      // Invalidate tasks list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });
};
