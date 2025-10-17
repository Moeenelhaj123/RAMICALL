import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    helperText, 
    error, 
    required, 
    resize = 'vertical',
    className = '', 
    id, 
    rows = 4,
    ...props 
  }, ref) => {
    const inputId = id || React.useId();
    const hasError = Boolean(error);

    const textareaClasses = [
      'block w-full rounded-lg border transition-colors duration-200',
      'placeholder:text-slate-400',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
      'px-3 py-2.5 text-sm',
      // Resize
      resize === 'none' && 'resize-none',
      resize === 'vertical' && 'resize-y',
      resize === 'horizontal' && 'resize-x',
      resize === 'both' && 'resize',
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
        
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={textareaClasses}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
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

Textarea.displayName = 'Textarea';