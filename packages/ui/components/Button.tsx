'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  icon,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium focus:outline-none transition-all duration-200 transform hover:scale-105 active:scale-[0.98]';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50',
    secondary: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
    outline: 'border-2 border-indigo-500 bg-white text-indigo-600 hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50',
    gradient: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-xl focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 animate-gradient-x',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-sm rounded-xl',
    md: 'px-5 py-2.5 text-base rounded-xl',
    lg: 'px-6 py-3 text-lg rounded-xl',
  };
  
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer shadow-md';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default React.memo(Button); 