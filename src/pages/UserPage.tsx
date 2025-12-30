import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/common/Button';
import { UserProfile, useUser } from '@/features/user';
import { useAuthStore } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

export const UserPage: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { data, isLoading, error } = useUser();

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSpinner fullScreen />
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-red-600">사용자 정보를 불러오는데 실패했습니다.</p>
        </div>
      </AppLayout>
    );
  }

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGN_IN, { replace: true });
  };

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">회원 정보</h1>
          <p className="text-gray-600 mt-2">내 정보를 확인하세요</p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
      <UserProfile data={data} />
    </AppLayout>
  );
};
