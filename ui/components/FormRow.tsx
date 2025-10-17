import React from 'react';

export interface FormRowProps {
  children: React.ReactNode;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  htmlFor?: string;
}

export const FormRow = React.forwardRef<HTMLDivElement, FormRowProps>(
  ({ 
    children, 
    label, 
    required, 
    error, 
    helperText, 
    className = '',
    htmlFor
  }, ref) => {
    const hasError = Boolean(error);

    return (
      <div ref={ref} className={`space-y-1 ${className}`}>
        {label && (
          <label 
            htmlFor={htmlFor}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
            {required && <span className="text-red-500 ms-1">*</span>}
          </label>
        )}
        
        {children}
        
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormRow.displayName = 'FormRow';

// Form field wrapper that automatically handles form field spacing
export interface FormFieldsProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3;
}

export const FormFields = React.forwardRef<HTMLDivElement, FormFieldsProps>(
  ({ children, className = '', columns = 1 }, ref) => {
    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    };

    return (
      <div 
        ref={ref} 
        className={`grid gap-6 ${gridClasses[columns]} ${className}`}
      >
        {children}
      </div>
    );
  }
);

FormFields.displayName = 'FormFields';