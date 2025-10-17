import React from 'react';
import { tokens } from '../tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    iconLeft, 
    iconRight, 
    loading = false, 
    disabled, 
    children, 
    className = '', 
    ...props 
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
    ];

    const variantClasses = {
      primary: [
        'bg-blue-600 text-white border border-blue-600',
        'hover:bg-blue-700 hover:border-blue-700',
        'focus:ring-blue-500',
        'active:bg-blue-800'
      ],
      secondary: [
        'bg-slate-100 text-slate-900 border border-slate-200',
        'hover:bg-slate-200 hover:border-slate-300',
        'focus:ring-slate-500',
        'active:bg-slate-300'
      ],
      outline: [
        'bg-transparent text-slate-700 border border-slate-300',
        'hover:bg-slate-50 hover:border-slate-400',
        'focus:ring-slate-500',
        'active:bg-slate-100'
      ],
      subtle: [
        'bg-transparent text-slate-600 border border-transparent',
        'hover:bg-slate-100 hover:text-slate-900',
        'focus:ring-slate-500 focus:bg-slate-100',
        'active:bg-slate-200'
      ],
      danger: [
        'bg-red-600 text-white border border-red-600',
        'hover:bg-red-700 hover:border-red-700',
        'focus:ring-red-500',
        'active:bg-red-800'
      ]
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5 min-h-[32px]',
      md: 'px-4 py-2 text-sm rounded-lg gap-2 min-h-[40px]',
      lg: 'px-6 py-3 text-base rounded-lg gap-2.5 min-h-[48px]'
    };

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    const allClasses = [
      ...baseClasses,
      ...variantClasses[variant],
      sizeClasses[size],
      className
    ].join(' ');

    return (
      <button
        ref={ref}
        className={allClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg 
              className={`animate-spin ${iconSizeClasses[size]}`}
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </>
        ) : (
          <>
            {iconLeft && (
              <span className={`flex-shrink-0 ${iconSizeClasses[size]}`}>
                {iconLeft}
              </span>
            )}
            {children}
            {iconRight && (
              <span className={`flex-shrink-0 ${iconSizeClasses[size]}`}>
                {iconRight}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';