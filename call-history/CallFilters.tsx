import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckboxDropdown } from "@/components/ui/checkbox-dropdown";
import { RangeSlider } from "@/components/filters/RangeSlider";
import { MagnifyingGlass, X, Download, Phone, FunnelSimple } from "@phosphor-icons/react";
import { Menu, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import { Button as MuiButton } from "@mui/material";
import { ViewColumnOutlined } from "@mui/icons-material";
import type { CallDirection, CallResult, CallHistoryQuery, VisibleFilters } from "@/types/calls";
import { normalizePhone, looksLikePhone, clampRange } from "@/lib/formatters";
import { fmtMMSS } from "@/lib/time";
import { getVisibleFilters, setVisibleFilters, resetVisibleFilters } from "@/lib/utils";
import { inputSm } from "@/components/ui/form-classes";
import { cn } from "@/lib/utils";

type CallFiltersProps = {
  onFilterChange: (filters: Partial<CallHistoryQuery>) => void;
  onExportCSV: () => void;
  agentsOptions?: Array<{ id: string; name: string }>;
  loading?: boolean;
  currentNumber?: string;
  tableControls?: any;
};

export function CallFilters({ onFilterChange, onExportCSV, agentsOptions = [], loading, currentNumber, tableControls }: CallFiltersProps) {
  // Existing state
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedDirections, setSelectedDirections] = useState<string[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedQueues, setSelectedQueues] = useState<string[]>([]);
  
  // New filter states
  const [callerNumber, setCallerNumber] = useState("");
  const [calledNumber, setCalledNumber] = useState("");
  const [selectedHungupBy, setSelectedHungupBy] = useState<string[]>([]);
  
  // Range slider states (seconds)
  const [duration, setDuration] = useState<[number, number]>([0, 3600]);      // 0..60min
  const [talkTime, setTalkTime] = useState<[number, number]>([0, 3600]);
  const [ringTime, setRingTime] = useState<[number, number]>([0, 180]);       // 0..3min
  const [onHold, setOnHold] = useState<[number, number]>([0, 900]);           // 0..15min
  
  // Visible filters state
  const [visibleFilters, setVisibleFiltersState] = useState<VisibleFilters>(getVisibleFilters());
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  
  // Filters collapsed state
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem("callHistory.filters.collapsed.v1");
    // Default to collapsed on small screens
    if (stored === null && typeof window !== 'undefined' && window.innerWidth < 768) {
      return true;
    }
    return stored === "1";
  });

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem("callHistory.filters.collapsed.v1", collapsed ? "1" : "0");
  }, [collapsed]);

  // Initialize collapsed state on mount for responsive behavior
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filters: Partial<CallHistoryQuery> = {};
      
      // Basic filters
      if (search) filters.search = search;
      if (dateFrom) filters.dateFrom = new Date(dateFrom).toISOString();
      if (dateTo) filters.dateTo = new Date(dateTo).toISOString();
      if (selectedDirections.length > 0) filters.direction = selectedDirections[0] as CallDirection;
      if (selectedResults.length > 0) filters.results = selectedResults as CallResult[];
      if (selectedAgents.length > 0) filters.agentIds = selectedAgents;
      if (selectedQueues.length > 0) filters.queueIds = selectedQueues;
      
      // New filters
      if (callerNumber.trim()) {
        filters.callerNumber = looksLikePhone(callerNumber) ? normalizePhone(callerNumber) : callerNumber;
      }
      if (calledNumber.trim()) {
        filters.calledNumber = looksLikePhone(calledNumber) ? normalizePhone(calledNumber) : calledNumber;
      }
      
      // Range slider filters
      if (duration[0] > 0 || duration[1] < 3600) {
        filters.durationSec = { min: duration[0], max: duration[1] };
      }
      
      if (ringTime[0] > 0 || ringTime[1] < 180) {
        filters.ringTimeSec = { min: ringTime[0], max: ringTime[1] };
      }
      
      if (talkTime[0] > 0 || talkTime[1] < 3600) {
        filters.talkTimeSec = { min: talkTime[0], max: talkTime[1] };
      }
      
      if (onHold[0] > 0 || onHold[1] < 900) {
        filters.onHoldSec = { min: onHold[0], max: onHold[1] };
      }
      
      // Hungup by
      if (selectedHungupBy.length > 0) {
        filters.hungupBy = selectedHungupBy as any[];
      }
      
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [
    search, dateFrom, dateTo, selectedDirections, selectedResults, selectedAgents, selectedQueues,
    callerNumber, calledNumber, duration, ringTime, talkTime, onHold, selectedHungupBy, onFilterChange
  ]);

  const handleReset = () => {
    // Reset all filter states
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setSelectedDirections([]);
    setSelectedResults([]);
    setSelectedAgents([]);
    setSelectedQueues([]);
    setCallerNumber("");
    setCalledNumber("");
    setDuration([0, 3600]);
    setTalkTime([0, 3600]);
    setRingTime([0, 180]);
    setOnHold([0, 900]);
    setSelectedHungupBy([]);
    onFilterChange({ number: currentNumber });
  };

  const handleClearNumber = () => {
    onFilterChange({ number: undefined });
  };

  const handleVisibleFiltersChange = (filters: VisibleFilters) => {
    setVisibleFiltersState(filters);
    setVisibleFilters(filters);
  };

  // Close filter menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setFilterMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filterMenuOptions = [
    { key: 'direction', label: 'Direction' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'callerNumber', label: 'Caller Number' },
    { key: 'calledNumber', label: 'Called Number' },
    { key: 'result', label: 'Result' },
    { key: 'agent', label: 'Agent' },
    { key: 'queue', label: 'Queue' },
    { key: 'duration', label: 'Duration' },
    { key: 'ringTime', label: 'Ring Time' },
    { key: 'talkTime', label: 'Talk Time' },
    { key: 'onHold', label: 'On Hold' },
    { key: 'hungupBy', label: 'Hungup By' }
  ];

  const hasActiveFilters = search || dateFrom || dateTo || selectedDirections.length > 0 || 
    selectedResults.length > 0 || selectedAgents.length > 0 || selectedQueues.length > 0 || 
    callerNumber || calledNumber || 
    (duration[0] > 0 || duration[1] < 3600) || 
    (ringTime[0] > 0 || ringTime[1] < 180) || 
    (talkTime[0] > 0 || talkTime[1] < 3600) || 
    (onHold[0] > 0 || onHold[1] < 900) || 
    selectedHungupBy.length > 0 || currentNumber;

  // Dropdown options
  const directionOptions = [
    { value: 'inbound', label: 'Inbound', checked: selectedDirections.includes('inbound') },
    { value: 'outbound', label: 'Outbound', checked: selectedDirections.includes('outbound') }
  ];

  const resultOptions = [
    { value: 'answered', label: 'Answered', checked: selectedResults.includes('answered') },
    { value: 'busy', label: 'Busy', checked: selectedResults.includes('busy') },
    { value: 'no_answer', label: 'No Answer', checked: selectedResults.includes('no_answer') },
    { value: 'hungup', label: 'Hung Up', checked: selectedResults.includes('hungup') }
  ];

  const agentDropdownOptions = agentsOptions.map(agent => ({
    value: agent.id,
    label: agent.name,
    checked: selectedAgents.includes(agent.id)
  }));

  const queueOptions = [
    { value: 'queue1', label: 'Support Queue', checked: selectedQueues.includes('queue1') },
    { value: 'queue2', label: 'Sales Queue', checked: selectedQueues.includes('queue2') },
    { value: 'queue3', label: 'Billing Queue', checked: selectedQueues.includes('queue3') }
  ];

  const hungupByOptions = [
    { value: 'unknown', label: 'Unknown', checked: selectedHungupBy.includes('unknown') },
    { value: 'client', label: 'Client', checked: selectedHungupBy.includes('client') },
    { value: 'agent', label: 'Agent', checked: selectedHungupBy.includes('agent') }
  ];

  // Active filter chips helper
  const getActiveFilterChips = () => {
    const chips: Array<{ label: string; onRemove: () => void }> = [];

    if (callerNumber) {
      chips.push({
        label: `Caller: ${callerNumber}`,
        onRemove: () => setCallerNumber("")
      });
    }

    if (calledNumber) {
      chips.push({
        label: `Called: ${calledNumber}`,
        onRemove: () => setCalledNumber("")
      });
    }

    if (selectedDirections.length > 0) {
      chips.push({
        label: `Direction: ${selectedDirections.join(", ")}`,
        onRemove: () => setSelectedDirections([])
      });
    }

    if (selectedResults.length > 0) {
      chips.push({
        label: `Result: ${selectedResults.join(", ")}`,
        onRemove: () => setSelectedResults([])
      });
    }

    if (selectedAgents.length > 0) {
      const agentNames = selectedAgents.map(id => 
        agentsOptions.find(a => a.id === id)?.name || id
      );
      chips.push({
        label: `Agent: ${agentNames.join(", ")}`,
        onRemove: () => setSelectedAgents([])
      });
    }

    if (selectedQueues.length > 0) {
      chips.push({
        label: `Queue: ${selectedQueues.join(", ")}`,
        onRemove: () => setSelectedQueues([])
      });
    }

    if (duration[0] > 0 || duration[1] < 3600) {
      chips.push({
        label: `Duration: ${fmtMMSS(duration[0])}-${fmtMMSS(duration[1])}`,
        onRemove: () => setDuration([0, 3600])
      });
    }

    if (ringTime[0] > 0 || ringTime[1] < 180) {
      chips.push({
        label: `Ring Time: ${fmtMMSS(ringTime[0])}-${fmtMMSS(ringTime[1])}`,
        onRemove: () => setRingTime([0, 180])
      });
    }

    if (talkTime[0] > 0 || talkTime[1] < 3600) {
      chips.push({
        label: `Talk Time: ${fmtMMSS(talkTime[0])}-${fmtMMSS(talkTime[1])}`,
        onRemove: () => setTalkTime([0, 3600])
      });
    }

    if (onHold[0] > 0 || onHold[1] < 900) {
      chips.push({
        label: `On Hold: ${fmtMMSS(onHold[0])}-${fmtMMSS(onHold[1])}`,
        onRemove: () => setOnHold([0, 900])
      });
    }

    if (selectedHungupBy.length > 0) {
      chips.push({
        label: `Hungup By: ${selectedHungupBy.join(", ")}`,
        onRemove: () => setSelectedHungupBy([])
      });
    }

    return chips;
  };

  return (
    <div className="w-full bg-white">
      <div className="p-4">
        {currentNumber && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-700">Filtered by number:</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-900 rounded-lg border border-slate-200">
              <Phone size={14} weight="bold" aria-hidden="true" />
              <span className="text-sm font-medium">{currentNumber}</span>
              <button
                onClick={handleClearNumber}
                disabled={loading}
                className="text-slate-500 hover:text-slate-700 disabled:opacity-50"
                aria-label="Clear number filter"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {getActiveFilterChips().length > 0 && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-700">Active filters:</span>
            {getActiveFilterChips().map((chip, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-900 rounded-lg border border-blue-200"
              >
                <span className="text-sm font-medium tabular-nums">{chip.label}</span>
                <button
                  onClick={chip.onRemove}
                  disabled={loading}
                  className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                  aria-label={`Remove ${chip.label} filter`}
                >
                  <X size={16} weight="bold" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 justify-end mb-4">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasActiveFilters || loading}
            className="h-9 gap-2 border-slate-300 bg-white text-slate-700 hover:bg-red-50 hover:border-red-300 hover:text-red-700 rounded-lg disabled:opacity-50 text-sm"
          >
            <X size={16} aria-hidden="true" />
            Reset All
          </Button>

          {/* Filters Expander */}
          <Button
            variant="outline"
            onClick={() => setCollapsed(v => !v)}
            className="h-9 gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 rounded-lg text-sm"
            aria-expanded={!collapsed}
            aria-controls="call-filters-panel"
          >
            <FunnelSimple size={16} aria-hidden="true" />
            {collapsed ? "Show Filters" : "Hide Filters"}
          </Button>

          {/* Filter Picker */}
          <div className="relative" ref={filterMenuRef}>
            <Button
              variant="outline"
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="h-9 gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 rounded-lg text-sm"
            >
              <FunnelSimple size={16} aria-hidden="true" />
              Filter Options
            </Button>
            
            {filterMenuOpen && (
              <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-48 p-2">
                <div className="space-y-1">
                  {filterMenuOptions.map((option) => (
                    <label
                      key={option.key}
                      className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={visibleFilters[option.key] || false}
                        onChange={(e) => {
                          handleVisibleFiltersChange({
                            ...visibleFilters,
                            [option.key]: e.target.checked
                          });
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-slate-700">{option.label}</span>
                    </label>
                  ))}
                  <hr className="my-2 border-slate-200" />
                  <button
                    onClick={() => {
                      resetVisibleFilters();
                      setVisibleFiltersState(getVisibleFilters());
                      setFilterMenuOpen(false);
                    }}
                    className="w-full text-left p-2 text-sm text-slate-600 hover:bg-slate-50 rounded"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Columns Button */}
          {tableControls && (
            <Button
              variant="outline"
              onClick={tableControls.handleColumnsMenuOpen}
              className="h-9 gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 rounded-lg text-sm"
              aria-haspopup="menu"
              aria-label="Toggle column visibility"
            >
              <ViewColumnOutlined sx={{ fontSize: 16 }} aria-hidden="true" />
              Columns
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={onExportCSV}
            disabled={loading}
            className="h-9 gap-2 border-slate-300 bg-white text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 rounded-lg text-sm"
          >
            <Download size={16} aria-hidden="true" />
            Export CSV
          </Button>
        </div>

        {/* Column Visibility Menu */}
        {tableControls && (
          <Menu
            anchorEl={tableControls.anchorEl}
            open={Boolean(tableControls.anchorEl)}
            onClose={tableControls.handleColumnsMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                  minWidth: 200,
                  border: "1px solid rgb(226 232 240 / 0.6)",
                },
              },
            }}
          >
            {tableControls.table?.getAllLeafColumns().map((col: any) => {
              if (!col.columnDef.enableHiding) return null;
              return (
                <MenuItem
                  key={col.id}
                  dense
                  disableRipple
                  onClick={(e) => e.stopPropagation()}
                  sx={{ py: 0.5 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={col.getIsVisible()}
                        onChange={(e) => col.toggleVisibility(e.target.checked)}
                        size="small"
                      />
                    }
                    label={col.columnDef.header as string}
                    sx={{ width: "100%", m: 0 }}
                  />
                </MenuItem>
              );
            })}
          </Menu>
        )}
        
        {/* Collapsible Filter Panel */}
        <div id="call-filters-panel" hidden={collapsed} className="mt-3">
          <div className="space-y-3 mb-4">
          {/* Row 1 - 5 filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {/* Direction Filter */}
            {visibleFilters.direction && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">Direction</label>
                <CheckboxDropdown
                  options={directionOptions}
                  placeholder="Direction..."
                  onChange={setSelectedDirections}
                  disabled={loading}
                />
              </div>
            )}

            {/* Start Date Filter */}
            {visibleFilters.startDate && (
              <div>
                <label htmlFor="startDate" className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">Start Date</label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className={cn(inputSm, "input-reset")}
                />
              </div>
            )}

            {/* End Date Filter */}
            {visibleFilters.endDate && (
              <div>
                <label htmlFor="endDate" className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">End Date</label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className={cn(inputSm, "input-reset")}
                />
              </div>
            )}

            {/* Caller Number Filter */}
            {visibleFilters.callerNumber && (
              <div>
                <label htmlFor="callerNumber" className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">Caller Number</label>
                <Input
                  id="callerNumber"
                  type="text"
                  placeholder="Phone number..."
                  value={callerNumber}
                  onChange={(e) => setCallerNumber(e.target.value)}
                  className={inputSm}
                />
              </div>
            )}

            {/* Called Number Filter */}
            {visibleFilters.calledNumber && (
              <div>
                <label htmlFor="calledNumber" className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">Called Number</label>
                <Input
                  id="calledNumber"
                  type="text"
                  placeholder="Phone number..."
                  value={calledNumber}
                  onChange={(e) => setCalledNumber(e.target.value)}
                  className={inputSm}
                />
              </div>
            )}
          </div>

          {/* Row 2 - 5 filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {/* Duration Range Filter */}
            {visibleFilters.duration && (
              <RangeSlider label="Duration" value={duration} onChange={setDuration} max={7200} step={5} />
            )}

            {/* Result Filter */}
            {visibleFilters.result && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">Result</label>
                <CheckboxDropdown
                  options={resultOptions}
                  placeholder="Results..."
                  onChange={setSelectedResults}
                  disabled={loading}
                />
              </div>
            )}

            {/* Agent Filter */}
            {visibleFilters.agent && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">Agent</label>
                <CheckboxDropdown
                  options={agentDropdownOptions}
                  placeholder="Agents..."
                  onChange={setSelectedAgents}
                  disabled={loading}
                />
              </div>
            )}

            {/* Queue Filter */}
            {visibleFilters.queue && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">Queue</label>
                <CheckboxDropdown
                  options={queueOptions}
                  placeholder="Queues..."
                  onChange={setSelectedQueues}
                  disabled={loading}
                />
              </div>
            )}

            {/* Ring Time Range Filter */}
            {visibleFilters.ringTime && (
              <RangeSlider label="Ring Time" value={ringTime} onChange={setRingTime} max={300} step={1} />
            )}
          </div>

          {/* Row 3 - 5 filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {/* Talk Time Range Filter */}
            {visibleFilters.talkTime && (
              <RangeSlider label="Talk Time" value={talkTime} onChange={setTalkTime} max={7200} step={5} />
            )}

            {/* On Hold Range Filter */}
            {visibleFilters.onHold && (
              <RangeSlider label="On Hold" value={onHold} onChange={setOnHold} max={3600} step={5} />
            )}

            {/* Hungup By Filter */}
            {visibleFilters.hungupBy && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">Hungup By</label>
                <CheckboxDropdown
                  options={hungupByOptions}
                  placeholder="Hungup by..."
                  onChange={setSelectedHungupBy}
                  disabled={loading}
                />
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
