import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInForm } from '@/features/auth';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const redirectAfterLoginPath = useAuthStore((state) => state.redirectAfterLoginPath);
  const setRedirectPath = useAuthStore((state) => state.setRedirectPath);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      setRedirectPath(null);
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate, setRedirectPath]);

  const handleSuccess = () => {
    const path = redirectAfterLoginPath || ROUTES.HOME;
    setRedirectPath(null); // Clear redirect path

    // Use setTimeout to ensure state is updated before navigation
    setTimeout(() => {
      navigate(path, { replace: true });
    }, 100);
  };

  const handleError = (message: string) => {
    setError(message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            할 일 관리 시스템
          </h1>
          <p className="text-gray-600">로그인하여 시작하세요</p>
        </div>

        <SignInForm onSuccess={handleSuccess} onError={handleError} />

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>테스트 계정</p>
          <p>이메일: test@example.com</p>
          <p>비밀번호: password123</p>
        </div>

        <Modal isOpen={!!error} onClose={() => setError(null)} title="로그인 실패">
          <p className="text-gray-700 mb-4">{error}</p>
          <Button onClick={() => setError(null)} fullWidth>
            확인
          </Button>
        </Modal>
      </div>
    </div>
  );
};
