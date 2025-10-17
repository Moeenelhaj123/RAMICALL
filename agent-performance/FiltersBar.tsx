import { useState, useEffect } from 'react'
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Button as MuiButton,
  Avatar,
  TextField
} from '@mui/material'
import { Download, ArrowCounterClockwise } from '@phosphor-icons/react'
import type { PerformanceQuery } from '@/types/performance'

type FilterPreset = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'custom'

type FiltersBarProps = {
  query: PerformanceQuery
  agentOptions?: Array<{ id: string; name: string; avatarUrl?: string; extension?: string }>
  groupOptions?: Array<{ id: string; name: string }>
  queueOptions?: Array<{ id: string; name: string }>
  onQueryChange: (query: PerformanceQuery) => void
  onExport: () => void
  loading?: boolean
}

const STORAGE_KEY = 'agentPerf.filters.v1'

function getPresetDates(preset: FilterPreset): { from: Date; to: Date } | null {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (preset) {
    case 'today':
      return { from: today, to: new Date() }
    case 'yesterday': {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return { from: yesterday, to: yesterday }
    }
    case 'last7': {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 6)
      return { from: weekAgo, to: today }
    }
    case 'last30': {
      const monthAgo = new Date(today)
      monthAgo.setDate(monthAgo.getDate() - 29)
      return { from: monthAgo, to: today }
    }
    case 'thisMonth': {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      return { from: firstDay, to: today }
    }
    default:
      return null
  }
}

export function FiltersBar({
  query,
  agentOptions = [],
  groupOptions = [],
  queueOptions = [],
  onQueryChange,
  onExport,
  loading
}: FiltersBarProps) {
  const [preset, setPreset] = useState<FilterPreset>('last7')
  const [localQuery, setLocalQuery] = useState<PerformanceQuery>(query)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setLocalQuery(parsed)
        onQueryChange(parsed)
      } catch (e) {
        console.error('Failed to parse stored filters', e)
      }
    }
  }, [])

  const handlePresetChange = (newPreset: FilterPreset) => {
    setPreset(newPreset)
    const dates = getPresetDates(newPreset)
    if (dates) {
      const updated = {
        ...localQuery,
        dateFrom: dates.from.toISOString(),
        dateTo: dates.to.toISOString()
      }
      setLocalQuery(updated)
    }
  }

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: Date | null) => {
    if (value) {
      setPreset('custom')
      setLocalQuery({ ...localQuery, [field]: value.toISOString() })
    }
  }

  const handleAgentsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    setLocalQuery({ ...localQuery, agents: typeof value === 'string' ? value.split(',') : value })
  }

  const handleGroupsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    setLocalQuery({ ...localQuery, groups: typeof value === 'string' ? value.split(',') : value })
  }

  const handleQueuesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    setLocalQuery({ ...localQuery, queues: typeof value === 'string' ? value.split(',') : value })
  }

  const handleApply = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localQuery))
    onQueryChange(localQuery)
  }

  const handleReset = () => {
    const resetQuery: PerformanceQuery = {
      dateFrom: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      dateTo: new Date().toISOString()
    }
    setLocalQuery(resetQuery)
    setPreset('last7')
    localStorage.removeItem(STORAGE_KEY)
    onQueryChange(resetQuery)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 md:p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-medium text-slate-700">Filters</h3>
        <div className="flex items-center gap-2">
          <MuiButton
            variant="outlined"
            size="small"
            startIcon={<ArrowCounterClockwise />}
            onClick={handleReset}
          >
            Reset
          </MuiButton>
          <MuiButton
            variant="outlined"
            size="small"
            startIcon={<Download />}
            onClick={onExport}
            disabled={loading}
          >
            Export CSV
          </MuiButton>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <FormControl size="small" fullWidth>
          <InputLabel id="preset-label">Date Range</InputLabel>
          <Select
            labelId="preset-label"
            value={preset}
            label="Date Range"
            onChange={(e) => handlePresetChange(e.target.value as FilterPreset)}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="yesterday">Yesterday</MenuItem>
            <MenuItem value="last7">Last 7 Days</MenuItem>
            <MenuItem value="last30">Last 30 Days</MenuItem>
            <MenuItem value="thisMonth">This Month</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="From"
          type="date"
          size="small"
          fullWidth
          value={new Date(localQuery.dateFrom).toISOString().split('T')[0]}
          onChange={(e) => handleDateChange('dateFrom', new Date(e.target.value))}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="To"
          type="date"
          size="small"
          fullWidth
          value={new Date(localQuery.dateTo).toISOString().split('T')[0]}
          onChange={(e) => handleDateChange('dateTo', new Date(e.target.value))}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl size="small" fullWidth>
          <InputLabel id="agents-label">Agents</InputLabel>
          <Select<string[]>
            labelId="agents-label"
            multiple
            value={localQuery.agents || []}
            onChange={handleAgentsChange}
            input={<OutlinedInput label="Agents" />}
            renderValue={(selected) => (
              <div className="flex flex-wrap gap-1">
                {selected.map((id) => {
                  const agent = agentOptions.find((a) => a.id === id)
                  return agent ? (
                    <Chip
                      key={id}
                      label={agent.name}
                      size="small"
                      avatar={agent.avatarUrl ? <Avatar src={agent.avatarUrl} /> : undefined}
                    />
                  ) : null
                })}
              </div>
            )}
          >
            {agentOptions.map((agent) => (
              <MenuItem key={agent.id} value={agent.id}>
                <div className="flex items-center gap-2">
                  {agent.avatarUrl && <Avatar src={agent.avatarUrl} sx={{ width: 24, height: 24 }} />}
                  <span>{agent.name}</span>
                  {agent.extension && (
                    <span className="text-xs text-slate-500">({agent.extension})</span>
                  )}
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {groupOptions.length > 0 && (
          <FormControl size="small" fullWidth>
            <InputLabel id="groups-label">Groups</InputLabel>
            <Select<string[]>
              labelId="groups-label"
              multiple
              value={localQuery.groups || []}
              onChange={handleGroupsChange}
              input={<OutlinedInput label="Groups" />}
              renderValue={(selected) => (
                <div className="flex flex-wrap gap-1">
                  {selected.map((id) => {
                    const group = groupOptions.find((g) => g.id === id)
                    return group ? <Chip key={id} label={group.name} size="small" /> : null
                  })}
                </div>
              )}
            >
              {groupOptions.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl size="small" fullWidth>
          <InputLabel id="queues-label">Queues</InputLabel>
          <Select<string[]>
            labelId="queues-label"
            multiple
            value={localQuery.queues || []}
            onChange={handleQueuesChange}
            input={<OutlinedInput label="Queues" />}
            renderValue={(selected) => (
              <div className="flex flex-wrap gap-1">
                {selected.map((id) => {
                  const queue = queueOptions.find((q) => q.id === id)
                  return queue ? <Chip key={id} label={queue.name} size="small" /> : null
                })}
              </div>
            )}
          >
            {queueOptions.map((queue) => (
              <MenuItem key={queue.id} value={queue.id}>
                {queue.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="flex justify-end">
        <MuiButton
          variant="contained"
          size="medium"
          onClick={handleApply}
          disabled={loading}
        >
          Apply Filters
        </MuiButton>
      </div>
    </div>
  )
}
