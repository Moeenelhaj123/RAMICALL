import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className = '' }, ref) => {
    return (
      <div 
        ref={ref} 
        className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      >
        {icon && (
          <div className="mb-4 text-slate-400">
            {icon}
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-slate-600 mb-6 max-w-md">
            {description}
          </p>
        )}
        
        {action && (
          <div>
            {action}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';