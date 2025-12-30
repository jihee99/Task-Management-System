import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import type { TaskDetailResponse } from '@/types/api';

export interface TaskDetailProps {
  task: TaskDetailResponse;
  onDeleteClick: () => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onDeleteClick }) => {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full ${
            task.status === 'DONE'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {task.status === 'DONE' ? '완료' : '진행중'}
        </span>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">등록일시</p>
        <p className="text-gray-700">{formatDate(task.registerDatetime)}</p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">메모</p>
        <p className="text-gray-700 whitespace-pre-wrap">{task.memo}</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onDeleteClick} variant="secondary">
          <span className="flex items-center space-x-2">
            <Icon name="delete" size="sm" />
            <span>삭제</span>
          </span>
        </Button>
      </div>
    </div>
  );
};
