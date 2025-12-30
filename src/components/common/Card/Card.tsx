import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  className?: string;
  as?: 'div' | 'article';
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  hoverable,
  className = '',
  as: Component = 'div',
}) => {
  const isClickable = !!onClick;
  const shouldHover = hoverable ?? isClickable;

  const baseStyles = 'bg-white rounded-lg border border-gray-200 shadow-sm';
  const hoverStyles = shouldHover
    ? 'hover:shadow-md transition-shadow duration-200'
    : '';
  const clickableStyles = isClickable ? 'cursor-pointer' : '';

  return (
    <Component
      onClick={onClick}
      className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      {...(isClickable && { role: 'button', tabIndex: 0 })}
    >
      {children}
    </Component>
  );
};
