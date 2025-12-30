import React from 'react';
import { StatCard } from '../StatCard';
import type { DashboardResponse } from '@/types/api';

export interface DashboardStatsProps {
  data: DashboardResponse;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="일" value={data.numOfTask} />
      <StatCard label="해야할 일" value={data.numOfRestTask} />
      <StatCard label="한 일" value={data.numOfDoneTask} />
    </div>
  );
};
