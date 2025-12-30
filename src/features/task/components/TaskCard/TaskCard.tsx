import React from 'react';
import { Card } from '@/components/common/Card';
import type { TaskListItem } from '@/types/api';

export interface TaskCardProps {
  task: TaskListItem;
  onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <Card onClick={onClick} hoverable className="p-4 mb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{task.memo}</p>
        </div>
        <span
          className={`ml-4 px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
            task.status === 'DONE'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {task.status === 'DONE' ? '완료' : '진행중'}
        </span>
      </div>
    </Card>
  );
};
