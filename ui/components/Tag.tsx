import React from 'react';

export interface TagProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onRemove?: () => void;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ variant = 'neutral', size = 'md', children, className = '', onRemove }, ref) => {
    const baseClasses = [
      'inline-flex items-center font-medium rounded-full transition-colors duration-200'
    ];

    const variantClasses = {
      success: 'bg-green-100 text-green-800 border border-green-200',
      warning: 'bg-amber-100 text-amber-800 border border-amber-200',
      danger: 'bg-red-100 text-red-800 border border-red-200',
      info: 'bg-blue-100 text-blue-800 border border-blue-200',
      neutral: 'bg-slate-100 text-slate-700 border border-slate-200'
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-sm gap-1.5',
      lg: 'px-3 py-1.5 text-sm gap-2'
    };

    const allClasses = [
      ...baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    ].join(' ');

    return (
      <span ref={ref} className={allClasses}>
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center justify-center ml-1 hover:bg-black/10 rounded-full transition-colors duration-200"
            style={{ width: size === 'sm' ? 14 : size === 'md' ? 16 : 18, height: size === 'sm' ? 14 : size === 'md' ? 16 : 18 }}
          >
            <svg 
              className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

// Alias for Badge
export const Badge = Tag;