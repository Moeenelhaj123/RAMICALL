import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    width, 
    height, 
    className = '', 
    variant = 'text',
    animation = 'pulse'
  }, ref) => {
    const baseClasses = [
      'bg-slate-200',
      variant === 'text' && 'rounded',
      variant === 'circular' && 'rounded-full',
      variant === 'rectangular' && 'rounded-md',
      animation === 'pulse' && 'animate-pulse',
      animation === 'wave' && 'animate-pulse', // Could be enhanced with CSS wave animation
      className
    ].filter(Boolean).join(' ');

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    // Default dimensions based on variant
    if (!height) {
      if (variant === 'text') style.height = '1em';
      if (variant === 'circular') style.height = '40px';
      if (variant === 'rectangular') style.height = '40px';
    }
    
    if (!width) {
      if (variant === 'circular') style.width = style.height;
      if (variant === 'rectangular') style.width = '100%';
    }

    return (
      <div 
        ref={ref} 
        className={baseClasses}
        style={style}
        aria-hidden="true"
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Convenience components for common patterns
export const SkeletonText = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>((props, ref) => (
  <Skeleton ref={ref} variant="text" {...props} />
));
SkeletonText.displayName = 'SkeletonText';

export const SkeletonAvatar = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>((props, ref) => (
  <Skeleton ref={ref} variant="circular" width={40} height={40} {...props} />
));
SkeletonAvatar.displayName = 'SkeletonAvatar';

export const SkeletonButton = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>((props, ref) => (
  <Skeleton ref={ref} variant="rectangular" width={80} height={32} {...props} />
));
SkeletonButton.displayName = 'SkeletonButton';