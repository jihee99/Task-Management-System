import React from 'react';
import type { UserResponse } from '@/types/api';

export interface UserProfileProps {
  data: UserResponse;
}

export const UserProfile: React.FC<UserProfileProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">회원 정보</h2>
      <div className="h-1 w-20 bg-blue rounded"></div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            이름
          </label>
          <p className="text-lg text-gray-900">{data.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            메모
          </label>
          <p className="text-lg text-gray-900 whitespace-pre-wrap">{data.memo}</p>
        </div>
      </div>
    </div>
  );
};
