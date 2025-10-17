import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Toolbar, ToolbarSection, Select } from '@/ui';
import {
  Download,
  ArrowCounterClockwise,
  MagnifyingGlass,
  CalendarBlank,
  CaretDown,
} from '@phosphor-icons/react';
import type { PerformanceQuery } from '@/types/performance';

interface AgentPerformanceToolbarProps {
  query: PerformanceQuery;
  agentOptions?: Array<{ id: string; name: string; avatarUrl?: string; extension?: string }>;
  groupOptions?: Array<{ id: string; name: string }>;
  queueOptions?: Array<{ id: string; name: string }>;
  onQueryChange: (query: PerformanceQuery) => void;
  onExport: () => void;
  loading?: boolean;
}

type FilterPreset = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'custom';

function getPresetDates(preset: FilterPreset): { from: Date; to: Date } | null {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (preset) {
    case 'today':
      return { from: today, to: new Date() };
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: yesterday, to: yesterday };
    }
    case 'last7': {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 6);
      return { from: weekAgo, to: today };
    }
    case 'last30': {
      const monthAgo = new Date(today);
      monthAgo.setDate(monthAgo.getDate() - 29);
      return { from: monthAgo, to: today };
    }
    case 'thisMonth': {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: firstDay, to: today };
    }
    default:
      return null;
  }
}

export function AgentPerformanceToolbar({
  query,
  agentOptions = [],
  groupOptions = [],
  queueOptions = [],
  onQueryChange,
  onExport,
  loading = false,
}: AgentPerformanceToolbarProps) {
  const [filtersDropdownOpen, setFiltersDropdownOpen] = useState(false);
  const filtersDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filtersDropdownRef.current && !filtersDropdownRef.current.contains(event.target as Node)) {
        setFiltersDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePresetChange = (preset: FilterPreset) => {
    const dates = getPresetDates(preset);
    if (dates) {
      onQueryChange({
        ...query,
        dateFrom: dates.from.toISOString(),
        dateTo: dates.to.toISOString(),
      });
    }
  };

  const handleReset = () => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    onQueryChange({
      dateFrom: todayStart.toISOString(),
      dateTo: new Date().toISOString(),
      agents: [],
      groups: [],
      queues: [],
    });
  };

  const formatDateForInput = (dateString: string) => {
    return new Date(dateString).toISOString().slice(0, 16);
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    const date = new Date(value);
    onQueryChange({
      ...query,
      [field]: date.toISOString(),
    });
  };

  return (
    <Toolbar
      leftArea={
        <ToolbarSection>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Agent Performance</h1>
            <p className="text-sm text-slate-600">View and analyze agent performance metrics over time</p>
          </div>
        </ToolbarSection>
      }
      rightArea={
        <ToolbarSection>
          {/* Date Range Quick Filters */}
          <div className="flex items-center gap-2">
            <Button 
              variant={new Date(query.dateFrom).toDateString() === new Date().toDateString() ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handlePresetChange('today')}
            >
              Today
            </Button>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => handlePresetChange('yesterday')}
            >
              Yesterday
            </Button>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => handlePresetChange('last7')}
            >
              Last 7 Days
            </Button>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => handlePresetChange('last30')}
            >
              Last 30 Days
            </Button>
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <CalendarBlank size={16} className="text-slate-400" />
              <input
                type="datetime-local"
                value={formatDateForInput(query.dateFrom)}
                onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                className="block rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-slate-400">to</span>
            <input
              type="datetime-local"
              value={formatDateForInput(query.dateTo)}
              onChange={(e) => handleDateChange('dateTo', e.target.value)}
              className="block rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Advanced Filters Dropdown */}
          <div className="relative" ref={filtersDropdownRef}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFiltersDropdownOpen(!filtersDropdownOpen)}
              iconRight={<CaretDown size={14} />}
            >
              Filters
            </Button>

            {filtersDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
                <div className="space-y-4">
                  {/* Agent Filter */}
                  {agentOptions.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Agents
                      </label>
                      <Select
                        multiple
                        value={query.agents || []}
                        onChange={(values) => onQueryChange({ ...query, agents: values as string[] })}
                        placeholder="Select agents..."
                        options={agentOptions.map(agent => ({
                          value: agent.id,
                          label: `${agent.name}${agent.extension ? ` (${agent.extension})` : ''}`,
                        }))}
                      />
                    </div>
                  )}

                  {/* Group Filter */}
                  {groupOptions.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Groups
                      </label>
                      <Select
                        multiple
                        value={query.groups || []}
                        onChange={(values) => onQueryChange({ ...query, groups: values as string[] })}
                        placeholder="Select groups..."
                        options={groupOptions.map(group => ({
                          value: group.id,
                          label: group.name,
                        }))}
                      />
                    </div>
                  )}

                  {/* Queue Filter */}
                  {queueOptions.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Queues
                      </label>
                      <Select
                        multiple
                        value={query.queues || []}
                        onChange={(values) => onQueryChange({ ...query, queues: values as string[] })}
                        placeholder="Select queues..."
                        options={queueOptions.map(queue => ({
                          value: queue.id,
                          label: queue.name,
                        }))}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setFiltersDropdownOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            iconLeft={<ArrowCounterClockwise size={16} />}
          >
            Reset
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onExport}
            iconLeft={<Download size={16} />}
            disabled={loading}
          >
            Export
          </Button>
        </ToolbarSection>
      }
      sticky
    />
  );
}