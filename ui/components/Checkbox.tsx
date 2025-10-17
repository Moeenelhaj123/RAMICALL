import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    label, 
    helperText, 
    error, 
    indeterminate = false,
    className = '', 
    id, 
    ...props 
  }, ref) => {
    const inputId = id || React.useId();
    const hasError = Boolean(error);

    // Handle indeterminate state
    React.useEffect(() => {
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    const checkboxClasses = [
      'h-4 w-4 rounded border-slate-300 text-blue-600 transition-colors duration-200',
      'focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      hasError ? 'border-red-300 focus:ring-red-500' : '',
      className
    ].join(' ');

    return (
      <div className="space-y-1">
        <div className="flex items-start gap-3">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              className={checkboxClasses}
              aria-invalid={hasError}
              aria-describedby={
                error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
              }
              {...props}
            />
          </div>
          
          {label && (
            <div className="flex-1">
              <label 
                htmlFor={inputId} 
                className="text-sm font-medium text-slate-700 cursor-pointer"
              >
                {label}
              </label>
              
              {helperText && !error && (
                <p id={`${inputId}-helper`} className="mt-1 text-sm text-slate-500">
                  {helperText}
                </p>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';