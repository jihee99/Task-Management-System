import React from 'react';
import { Card } from '@/components/common/Card';

export interface StatCardProps {
  label: string;
  value: number;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <Card className="p-6">
      <div className="text-sm font-medium text-gray-600 mb-2">{label}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </Card>
  );
};
