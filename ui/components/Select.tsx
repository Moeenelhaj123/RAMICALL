import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | string[];
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  required?: boolean;
  maxHeight?: string;
  onChange: (value: string | string[]) => void;
  onSearch?: (query: string) => void;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ 
    label,
    placeholder = 'Select option...',
    options,
    value,
    multiple = false,
    searchable = false,
    disabled = false,
    error,
    helperText,
    required,
    maxHeight = '240px',
    onChange,
    onSearch,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const selectRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const selectId = React.useId();
    const hasError = Boolean(error);

    // Filter options based on search
    const filteredOptions = searchable && searchQuery
      ? options.filter(option => 
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

    // Get selected values as array
    const selectedValues = multiple 
      ? (Array.isArray(value) ? value : [])
      : (value ? [value] : []);

    // Get display text
    const getDisplayText = () => {
      if (selectedValues.length === 0) return placeholder;
      
      if (multiple) {
        if (selectedValues.length === 1) {
          const option = options.find(opt => opt.value === selectedValues[0]);
          return option?.label || selectedValues[0];
        }
        return `${selectedValues.length} selected`;
      }
      
      const option = options.find(opt => opt.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    };

    // Handle option selection
    const handleSelect = (optionValue: string) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.includes(optionValue)
          ? currentValues.filter(v => v !== optionValue)
          : [...currentValues, optionValue];
        onChange(newValues);
      } else {
        onChange(optionValue);
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          if (!isOpen) {
            setIsOpen(true);
            e.preventDefault();
          } else if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[focusedIndex].value);
            e.preventDefault();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setFocusedIndex(prev => 
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex(prev => 
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
          break;
      }
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      setFocusedIndex(-1);
      onSearch?.(query);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    // Scroll focused option into view
    useEffect(() => {
      if (focusedIndex >= 0 && optionsRef.current) {
        const focusedElement = optionsRef.current.children[focusedIndex] as HTMLElement;
        if (focusedElement) {
          focusedElement.scrollIntoView({ block: 'nearest' });
        }
      }
    }, [focusedIndex]);

    const triggerClasses = [
      'relative w-full rounded-lg border bg-white px-3 py-2.5 text-left transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
      hasError 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500',
      disabled ? 'cursor-not-allowed' : 'cursor-pointer'
    ].join(' ');

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={selectId} 
            className="block text-sm font-medium text-slate-700"
          >
            {label}
            {required && <span className="text-red-500 ms-1">*</span>}
          </label>
        )}
        
        <div ref={selectRef} className="relative" {...props}>
          <div
            id={selectId}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={hasError}
            tabIndex={disabled ? -1 : 0}
            className={triggerClasses}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
          >
            <span className="block truncate text-sm">
              {getDisplayText()}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg 
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>

          {isOpen && (
            <div 
              className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg animate-scale-in"
              style={{ maxHeight }}
            >
              {searchable && (
                <div className="p-2 border-b border-slate-100">
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search options..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              )}
              
              <div 
                ref={optionsRef}
                className="max-h-60 overflow-auto py-1 scrollbar-thin"
                role="listbox"
                aria-multiselectable={multiple}
              >
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-slate-500">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option, index) => {
                    const isSelected = selectedValues.includes(option.value);
                    const isFocused = index === focusedIndex;
                    
                    return (
                      <div
                        key={option.value}
                        role="option"
                        aria-selected={isSelected}
                        className={[
                          'relative cursor-pointer select-none px-3 py-2 text-sm transition-colors',
                          isFocused ? 'bg-blue-50 text-blue-900' : 'text-slate-900',
                          isSelected ? 'bg-blue-100 text-blue-900' : 'hover:bg-slate-50',
                          option.disabled ? 'opacity-50 cursor-not-allowed' : ''
                        ].join(' ')}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{option.label}</span>
                          {isSelected && (
                            <svg 
                              className="h-4 w-4 text-blue-600 flex-shrink-0 ms-2" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
        
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

Select.displayName = 'Select';