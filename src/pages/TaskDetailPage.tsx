import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/common/Button';
import { TaskDetail, useTask, useDeleteTask, DeleteConfirmModal } from '@/features/task';
import { ROUTES } from '@/constants/routes';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading, error } = useTask(id!);
  const deleteTask = useDeleteTask();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      await deleteTask.mutateAsync(id);
      navigate(ROUTES.TASK_LIST, { replace: true });
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSpinner fullScreen />
      </AppLayout>
    );
  }

  if (error || !task) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            할 일을 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            요청하신 할 일이 존재하지 않거나 삭제되었습니다.
          </p>
          <Button onClick={() => navigate(ROUTES.TASK_LIST)}>
            목록으로 돌아가기
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.TASK_LIST)}
        >
          ← 목록으로 돌아가기
        </Button>
      </div>

      <TaskDetail task={task} onDeleteClick={handleDeleteClick} />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        targetId={id!}
        onConfirm={handleDeleteConfirm}
      />
    </AppLayout>
  );
};
