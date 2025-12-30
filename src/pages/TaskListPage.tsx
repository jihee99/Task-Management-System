import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { VirtualizedTaskList, useTasks } from '@/features/task';
import { ROUTES } from '@/constants/routes';
import { Icon } from '@/components/common/Icon';

export const TaskListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useTasks();
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const tasks = data?.pages.flat() ?? [];

  React.useEffect(() => {
    if (error) {
      setErrorModalOpen(true);
    }
  }, [error]);

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSpinner fullScreen />
      </AppLayout>
    );
  }

  const handleTaskClick = (id: string) => {
    navigate(ROUTES.TASK_DETAIL(id));
  };

  const handleRetry = () => {
    setErrorModalOpen(false);
    window.location.reload();
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">할 일 목록</h1>
        <p className="text-gray-600 mt-2">총 {tasks.length}개의 할 일</p>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={<Icon name="task" size="lg" />}
          title="할 일이 없습니다"
          description="새로운 할 일을 추가해보세요"
        />
      ) : (
        <VirtualizedTaskList
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onLoadMore={fetchNextPage}
          hasNextPage={!!hasNextPage}
          isLoadingMore={isFetchingNextPage}
        />
      )}

      <Modal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="오류 발생"
      >
        <p className="text-gray-700 mb-4">
          {error?.message || '할 일 목록을 불러오는데 실패했습니다.'}
        </p>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => setErrorModalOpen(false)} fullWidth>
            닫기
          </Button>
          <Button onClick={handleRetry} fullWidth>
            다시 시도
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
};
