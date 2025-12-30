import { useQuery } from '@tanstack/react-query';
import { client } from '@/api/client';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { DashboardResponse } from '@/types/api';

export const useDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: async () => {
      const { data } = await client.get<DashboardResponse>('/api/dashboard');
      return data;
    },
  });
};
