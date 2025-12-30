import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/constants/routes';

export interface LoginPromptProps {
  title?: string;
  message?: string;
  buttonLabel?: string;
}

export const LoginPrompt: React.FC<LoginPromptProps> = ({
  title = '로그인이 필요합니다',
  message = '할 일 현황을 확인하려면 로그인하세요',
  buttonLabel = '로그인하기',
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button onClick={() => navigate(ROUTES.SIGN_IN)}>{buttonLabel}</Button>
      </div>
    </div>
  );
};
