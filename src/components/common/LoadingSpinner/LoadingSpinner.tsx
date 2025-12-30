import React from 'react';
import { Icon } from '../Icon';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  fullScreen = false,
  label = 'Loading...',
}) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <Icon name="spinner" size={size} className="animate-spin text-blue-500" />
      {label && (
        <span className="sr-only" role="status">
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};
