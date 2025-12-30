import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/contexts/AuthContext';
import { Icon } from '@/components/common/Icon';
import { ROUTES } from '@/constants/routes';

export const GNB: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Main navigation */}
          <div className="flex space-x-8">
            <NavLink
              to={ROUTES.HOME}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon name="dashboard" size="sm" />
              <span>대시보드</span>
            </NavLink>

            <NavLink
              to={ROUTES.TASK_LIST}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon name="task" size="sm" />
              <span>할 일</span>
            </NavLink>
          </div>

          {/* Right side - Auth icon */}
          <div>
            {isAuthenticated ? (
              <NavLink
                to={ROUTES.USER}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Icon name="user" size="sm" />
                <span>회원정보</span>
              </NavLink>
            ) : (
              <NavLink
                to={ROUTES.SIGN_IN}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Icon name="login" size="sm" />
                <span>로그인</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
