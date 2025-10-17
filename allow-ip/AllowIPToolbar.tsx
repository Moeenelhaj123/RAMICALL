import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Toolbar, ToolbarSection } from '@/ui';
import {
  Plus,
  PencilSimple,
  ArrowSquareIn,
  Download,
  Trash,
  DotsThree,
  MagnifyingGlass,
  CaretDown,
} from '@phosphor-icons/react';

interface AllowIPToolbarProps {
  canEdit: boolean;
  canDelete: boolean;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onImport: () => void;
  onExport: () => void;
  searchValue: string;
  onSearch: (value: string) => void;
  loading?: boolean;
}

export function AllowIPToolbar({
  canEdit,
  canDelete,
  onAdd,
  onEdit,
  onDelete,
  onImport,
  onExport,
  searchValue,
  onSearch,
  loading = false,
}: AllowIPToolbarProps) {
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const addDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addDropdownRef.current && !addDropdownRef.current.contains(event.target as Node)) {
        setAddDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Toolbar
      leftArea={
        <ToolbarSection>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Allow IP</h1>
            <p className="text-sm text-slate-600">Manage IP addresses and access control</p>
          </div>
        </ToolbarSection>
      }
      rightArea={
        <ToolbarSection>
          {/* Search Bar */}
          <Input
            placeholder="Search IP addresses..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            iconLeft={<MagnifyingGlass size={16} />}
          />

          {/* Add Dropdown */}
          <div className="relative" ref={addDropdownRef}>
            <Button
              variant="primary"
              onClick={() => setAddDropdownOpen(!addDropdownOpen)}
              iconLeft={<Plus size={16} />}
              iconRight={<CaretDown size={14} />}
              disabled={loading}
            >
              Add
            </Button>

            {/* Dropdown menu */}
            {addDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setAddDropdownOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-slate-200 shadow-lg w-44 py-1">
                  <button
                    onClick={() => {
                      onAdd();
                      setAddDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Single IP Address
                  </button>
                  <button
                    onClick={() => {
                      onImport();
                      setAddDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ArrowSquareIn size={16} />
                    Bulk Import
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Edit Button */}
          <Button
            variant="outline"
            onClick={onEdit}
            disabled={!canEdit}
            iconLeft={<PencilSimple size={16} />}
          >
            Edit
          </Button>

          {/* Export Button */}
          <Button
            variant="outline"
            onClick={onExport}
            iconLeft={<Download size={16} />}
          >
            Export
          </Button>

          {/* Delete Button */}
          <Button
            variant="danger"
            onClick={onDelete}
            disabled={!canDelete}
            iconLeft={<Trash size={16} />}
          >
            Delete
          </Button>

          {/* More Dropdown */}
          <div className="relative" ref={moreDropdownRef}>
            <Button
              variant="outline"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              iconLeft={<DotsThree size={16} />}
              iconRight={<CaretDown size={14} />}
            >
              More
            </Button>

            {/* Dropdown menu */}
            {moreDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setMoreDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 shadow-lg w-52 py-1">
                  <button
                    onClick={() => setMoreDropdownOpen(false)}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Security Settings
                  </button>
                  <button
                    onClick={() => setMoreDropdownOpen(false)}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Access Logs
                  </button>
                  <button
                    onClick={() => setMoreDropdownOpen(false)}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Whitelist Template
                  </button>
                </div>
              </>
            )}
          </div>
        </ToolbarSection>
      }
      sticky
    />
  );
}