import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { LoginPrompt } from '@/components/common/LoginPrompt';
import { DashboardStats, useDashboard } from '@/features/dashboard';
import type { AxiosError } from 'axios';

export const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useDashboard();

  // 401 에러 체크 (랜딩 페이지이므로 로그인 유도 UI 표시)
  const is401Error =
    error &&
    (error as AxiosError).response?.status === 401;

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSpinner fullScreen />
      </AppLayout>
    );
  }

  // 401 에러: 로그인 유도 UI 표시 (리다이렉트 없음)
  if (is401Error) {
    return (
      <AppLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-2">할 일 관리 시스템에 오신 것을 환영합니다</p>
        </div>
        <LoginPrompt
          title="로그인이 필요합니다"
          message="할 일 현황을 확인하려면 로그인하세요"
          buttonLabel="로그인하기"
        />
      </AppLayout>
    );
  }

  // 기타 에러
  if (error) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-red-600">데이터를 불러오는데 실패했습니다.</p>
        </div>
      </AppLayout>
    );
  }

  // 정상 데이터 표시
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">할 일 현황을 확인하세요</p>
      </div>
      {data && <DashboardStats data={data} />}
    </AppLayout>
  );
};
