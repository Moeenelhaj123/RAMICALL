import { useState, useRef, useEffect } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { inputSm } from './form-classes'

interface CheckboxOption {
  value: string
  label: string
  checked: boolean
}

interface CheckboxDropdownProps {
  options: CheckboxOption[]
  placeholder?: string
  onChange: (selectedValues: string[]) => void
  disabled?: boolean
  className?: string
}

export function CheckboxDropdown({ 
  options, 
  placeholder = "Select options...", 
  onChange, 
  disabled = false,
  className = "" 
}: CheckboxDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalOptions, setInternalOptions] = useState(options)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInternalOptions(options)
  }, [options])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOptionToggle = (value: string) => {
    const updatedOptions = internalOptions.map(option =>
      option.value === value ? { ...option, checked: !option.checked } : option
    )
    setInternalOptions(updatedOptions)
    
    const selectedValues = updatedOptions
      .filter(option => option.checked)
      .map(option => option.value)
    onChange(selectedValues)
  }

  const selectedCount = internalOptions.filter(option => option.checked).length
  const displayText = selectedCount > 0 
    ? `${selectedCount} selected` 
    : placeholder

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          inputSm,
          "flex items-center justify-between px-2 py-1.5",
          "hover:bg-slate-50 transition-colors",
          className
        )}
      >
        <span className={cn(
          "text-xs truncate",
          selectedCount === 0 && "text-slate-400"
        )}>
          {displayText}
        </span>
        <CaretDown 
          size={14} 
          className={cn(
            "text-slate-400 transition-transform flex-shrink-0 ml-1",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <ul className="p-3 space-y-3">
            {internalOptions.map((option) => (
              <li key={option.value}>
                <div className="flex items-center">
                  <input
                    id={`checkbox-${option.value}`}
                    type="checkbox"
                    checked={option.checked}
                    onChange={() => handleOptionToggle(option.value)}
                    className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label
                    htmlFor={`checkbox-${option.value}`}
                    className="ml-2 text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}