import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MagnifyingGlass, Phone, XCircle } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { usePhoneSearch, looksLikePhone } from '@/hooks/usePhoneSearch';
import { toNumberHistoryRoute, type PhoneHit } from '@/api/clients';
import { formatDistanceToNow } from 'date-fns';
import { CircularProgress } from '@mui/material';

interface GlobalSearchProps {
  onNavigate?: (route: string) => void;
}

export function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { loading, results, search, clear } = usePhoneSearch();

  const showPhoneResults = isOpen && looksLikePhone(value) && value.trim().length >= 4;

  useEffect(() => {
    if (value.trim().length >= 4 && looksLikePhone(value)) {
      search(value);
      setIsOpen(true);
    } else {
      clear();
      setIsOpen(false);
    }
  }, [value, search, clear]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (hit: PhoneHit) => {
    const route = toNumberHistoryRoute(hit.number);
    setValue('');
    setIsOpen(false);
    clear();
    
    if (onNavigate) {
      onNavigate(route);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showPhoneResults) return;

    if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      }
      return;
    }
  };

  const handleClear = () => {
    setValue('');
    setIsOpen(false);
    clear();
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex-1 max-w-sm">
      <MagnifyingGlass
        size={18}
        weight="bold"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
        aria-hidden="true"
      />
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search numbers..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-10 pr-10 h-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Search phone numbers"
        aria-expanded={showPhoneResults}
        aria-controls={showPhoneResults ? "phone-results" : undefined}
        aria-autocomplete="list"
        role="combobox"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10"
          aria-label="Clear search"
        >
          <XCircle size={18} weight="fill" />
        </button>
      )}

      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {showPhoneResults && !loading && `${results.length} result${results.length !== 1 ? 's' : ''} found`}
      </div>

      {showPhoneResults && (
        <div
          ref={dropdownRef}
          id="phone-results"
          role="listbox"
          aria-label="Phone results"
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50"
        >
          {loading && (
            <div className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-slate-500">
              <CircularProgress size={16} className="text-slate-400" />
              <span>Searching...</span>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="px-3 py-4 text-sm text-slate-500 text-center">
              No matching numbers
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul>
              {results.map((hit, index) => (
                <li
                  key={hit.number}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={`flex items-center justify-between gap-3 px-3 py-2 cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-slate-100'
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => handleSelect(hit)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="shrink-0 rounded-md border border-slate-200 p-1.5 bg-slate-50">
                      <Phone size={16} className="text-slate-600" weight="bold" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-slate-900 truncate font-medium">
                        {hit.display || hit.number}
                      </div>
                      {(hit.name || hit.label) && (
                        <div className="text-xs text-slate-500 truncate">
                          {hit.name}
                          {hit.name && hit.label && ' · '}
                          {hit.label}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 tabular-nums shrink-0">
                    {hit.lastCallAt && formatDistanceToNow(new Date(hit.lastCallAt), { addSuffix: true })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
