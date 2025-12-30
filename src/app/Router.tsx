import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ROUTES } from '@/constants/routes';
import { SignInPage } from '@/pages/SignInPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { TaskListPage } from '@/pages/TaskListPage';
import { TaskDetailPage } from '@/pages/TaskDetailPage';
import { UserPage } from '@/pages/UserPage';

export const Router: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
      {/* 대시보드는 랜딩 페이지로 ProtectedRoute 미적용 */}
      <Route path={ROUTES.HOME} element={<DashboardPage />} />
      <Route
        path={ROUTES.TASK_LIST}
        element={
          <ProtectedRoute>
            <TaskListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task/:id"
        element={
          <ProtectedRoute>
            <TaskDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.USER}
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};
