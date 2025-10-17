import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    helperText, 
    error, 
    required, 
    iconLeft, 
    iconRight, 
    className = '', 
    id, 
    ...props 
  }, ref) => {
    const inputId = id || React.useId();
    const hasError = Boolean(error);

    const inputClasses = [
      'block w-full rounded-lg border transition-colors duration-200',
      'placeholder:text-slate-400',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
      // Spacing
      iconLeft && iconRight ? 'px-10' : iconLeft ? 'pl-10 pr-3' : iconRight ? 'pl-3 pr-10' : 'px-3',
      'py-2.5 text-sm',
      // Colors
      hasError 
        ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
        : 'border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-500',
      className
    ].join(' ');

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-slate-700"
          >
            {label}
            {required && <span className="text-red-500 ms-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {iconLeft && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="w-5 h-5 text-slate-400">
                {iconLeft}
              </span>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          
          {iconRight && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="w-5 h-5 text-slate-400">
                {iconRight}
              </span>
            </div>
          )}
        </div>
        
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';