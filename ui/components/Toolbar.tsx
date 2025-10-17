import React from 'react';

export interface ToolbarProps {
  leftArea?: React.ReactNode;
  rightArea?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ leftArea, rightArea, children, className = '', sticky = false }, ref) => {
    const toolbarClasses = [
      'flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-slate-200',
      sticky ? 'sticky top-0 z-40' : '',
      className
    ].join(' ');

    return (
      <div ref={ref} className={toolbarClasses}>
        {/* Left area */}
        <div className="flex items-center gap-3">
          {leftArea}
        </div>

        {/* Center content */}
        {children && (
          <div className="flex-1 flex items-center justify-center">
            {children}
          </div>
        )}

        {/* Right area */}
        <div className="flex items-center gap-3">
          {rightArea}
        </div>
      </div>
    );
  }
);

Toolbar.displayName = 'Toolbar';

// Toolbar sections for better composition
export const ToolbarSection = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
}>(({ children, className = '' }, ref) => (
  <div ref={ref} className={`flex items-center gap-2 ${className}`}>
    {children}
  </div>
));

ToolbarSection.displayName = 'ToolbarSection';