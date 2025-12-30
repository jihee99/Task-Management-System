import { useQuery } from '@tanstack/react-query';
import { client } from '@/api/client';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { UserResponse } from '@/types/api';

export const useUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.user,
    queryFn: async () => {
      const { data } = await client.get<UserResponse>('/api/user');
      return data;
    },
  });
};
