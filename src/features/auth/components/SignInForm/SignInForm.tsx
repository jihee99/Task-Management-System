import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { MESSAGES } from '@/constants/messages';
import { client } from '@/api/client';
import { useAuthStore } from '@/contexts/AuthContext';
import type { TokenResponse } from '@/types/api';

// Validation schema per spec: email RFC compliant, password 8-24 chars with only letters/numbers/Korean
const signInSchema = z.object({
  email: z.string().min(1, MESSAGES.REQUIRED_FIELD).email(MESSAGES.INVALID_EMAIL),
  password: z
    .string()
    .min(8, MESSAGES.INVALID_PASSWORD)
    .max(24, MESSAGES.INVALID_PASSWORD)
    .regex(/^[a-zA-Z0-9가-힣]+$/, MESSAGES.INVALID_PASSWORD),
});

type SignInFormData = z.infer<typeof signInSchema>;

export interface SignInFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSuccess, onError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);
    try {
      console.log('[SignIn] Attempting login with:', data.email);
      const response = await client.post<TokenResponse>('/api/sign-in', data);
      console.log('[SignIn] Login successful');
      const { accessToken, refreshToken } = response.data;
      login({ accessToken, refreshToken });
      onSuccess();
    } catch (error: any) {
      console.error('[SignIn] Login failed:', error);
      onError(error.response?.data?.errorMessage || MESSAGES.LOGIN_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-8 rounded-lg shadow-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          이메일 <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          placeholder="test@example.com"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          비밀번호 <span className="text-red-500">*</span>
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          placeholder="8-24자 (영문/한글/숫자만)"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      <Button
        type="submit"
        fullWidth
        disabled={!isValid || isSubmitting}
        loading={isSubmitting}
      >
        로그인
      </Button>
    </form>
  );
};
