'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient';
  hoverEffect?: boolean;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  footer,
  variant = 'default',
  hoverEffect = false,
  icon,
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white shadow-card border border-gray-100',
    glass: 'bg-white bg-opacity-70 backdrop-blur-lg border border-white border-opacity-20 shadow-lg',
    gradient: 'bg-gradient-to-br from-primary-50 to-accent-50 border border-white border-opacity-20 shadow-lg'
  };
  
  const hoverClasses = hoverEffect ? 'hover:shadow-xl hover:transform hover:scale-[1.01]' : '';
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-5 border-b border-gray-100">
          {title && (
            <div className="flex items-center">
              {icon && <div className="mr-3 text-indigo-500">{icon}</div>}
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">{title}</h3>
            </div>
          )}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">{footer}</div>}
    </div>
  );
};

export default React.memo(Card);