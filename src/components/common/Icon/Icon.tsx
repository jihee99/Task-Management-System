import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  LogIn,
  User,
  Trash2,
  Loader2,
} from 'lucide-react';

export type IconName =
  | 'dashboard'
  | 'task'
  | 'login'
  | 'user'
  | 'delete'
  | 'spinner';

export interface IconProps {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
};

const iconMap = {
  dashboard: LayoutDashboard,
  task: CheckSquare,
  login: LogIn,
  user: User,
  delete: Trash2,
  spinner: Loader2,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  className = '',
}) => {
  const IconComponent = iconMap[name];
  const iconSize = sizeMap[size];

  return <IconComponent size={iconSize} className={className} />;
};
