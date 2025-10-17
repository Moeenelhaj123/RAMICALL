import { useMemo, useState, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState
} from '@tanstack/react-table'
import { Avatar, Menu, MenuItem, FormControlLabel, Checkbox } from '@mui/material'
import { Button as MuiButton } from '@mui/material'
import { ViewColumnOutlined } from '@mui/icons-material'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'
import type { AgentPerformanceRow } from '@/types/performance'
import { formatDuration, fmtInt } from '@/lib/formatters'
import { cn } from '@/lib/utils'

type PerformanceTableProps = {
  rows: AgentPerformanceRow[]
  loading?: boolean
  onSortChange?: (sortBy: keyof AgentPerformanceRow, sortDir: 'asc' | 'desc') => void
}

const STORAGE_KEY = 'agentPerf.columns.v1'

function AgentCell({ row }: { row: AgentPerformanceRow }) {
  return (
    <div className="flex items-center gap-2">
      {row.agent.avatarUrl ? (
        <Avatar src={row.agent.avatarUrl} sx={{ width: 32, height: 32 }} />
      ) : (
        <Avatar sx={{ width: 32, height: 32 }}>{row.agent.name.charAt(0)}</Avatar>
      )}
      <div>
        <div className="text-sm font-medium text-slate-900">{row.agent.name}</div>
        {row.extension && (
          <div className="text-xs text-slate-500">{row.extension}</div>
        )}
      </div>
    </div>
  )
}

export function PerformanceTable({ rows, loading, onSortChange }: PerformanceTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setColumnVisibility(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse column visibility', e)
      }
    }
  }, [])

  useEffect(() => {
    if (Object.keys(columnVisibility).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(columnVisibility))
    }
  }, [columnVisibility])

  const columns = useMemo<ColumnDef<AgentPerformanceRow>[]>(
    () => [
      {
        id: 'agent',
        accessorFn: (row) => row.agent.name,
        header: 'Agent',
        cell: ({ row }) => <AgentCell row={row.original} />,
        size: 200,
        enableSorting: true
      },
      {
        id: 'extension',
        accessorKey: 'extension',
        header: 'Extension',
        cell: ({ getValue }) => getValue() || '—',
        size: 100,
        enableSorting: true
      },
      {
        id: 'answeredCount',
        accessorKey: 'answeredCount',
        header: '#Answered',
        cell: ({ getValue }) => fmtInt(getValue() as number),
        size: 100,
        enableSorting: true
      },
      {
        id: 'busyCount',
        accessorKey: 'busyCount',
        header: '#Busy',
        cell: ({ getValue }) => fmtInt(getValue() as number),
        size: 80,
        enableSorting: true
      },
      {
        id: 'hungupCount',
        accessorKey: 'hungupCount',
        header: '#HungUp',
        cell: ({ getValue }) => fmtInt(getValue() as number),
        size: 90,
        enableSorting: true
      },
      {
        id: 'noAnswerCount',
        accessorKey: 'noAnswerCount',
        header: '#No Answer',
        cell: ({ getValue }) => fmtInt(getValue() as number),
        size: 110,
        enableSorting: true
      },
      {
        id: 'missedCount',
        accessorKey: 'missedCount',
        header: '#Missed',
        cell: ({ getValue }) => fmtInt(getValue() as number),
        size: 90,
        enableSorting: true
      },
      {
        id: 'avgRingSec',
        accessorKey: 'avgRingSec',
        header: 'Avg Ring',
        cell: ({ getValue }) => formatDuration(getValue() as number),
        size: 90,
        enableSorting: true
      },
      {
        id: 'outboundCount',
        accessorKey: 'outboundCount',
        header: 'Outbound',
        cell: ({ getValue }) => fmtInt(getValue() as number),
        size: 100,
        enableSorting: true
      },
      {
        id: 'outboundAnsweredCount',
        accessorKey: 'outboundAnsweredCount',
        header: 'Outbound Answered',
        cell: ({ getValue }) => fmtInt(getValue() as number),
        size: 150,
        enableSorting: true
      },
      {
        id: 'outboundClientsCount',
        accessorKey: 'outboundClientsCount',
        header: 'Outbound Clients',
        cell: ({ getValue }) => fmtInt(getValue() as number),
        size: 140,
        enableSorting: true
      },
      {
        id: 'uniqueContactsCount',
        accessorKey: 'uniqueContactsCount',
        header: 'Unique',
        cell: ({ getValue }) => fmtInt(getValue() as number),
        size: 90,
        enableSorting: true
      },
      {
        id: 'outboundTalkingSec',
        accessorKey: 'outboundTalkingSec',
        header: 'Outbound Talking',
        cell: ({ getValue }) => formatDuration(getValue() as number),
        size: 140,
        enableSorting: true
      },
      {
        id: 'totalTalkingSec',
        accessorKey: 'totalTalkingSec',
        header: 'Total Talking',
        cell: ({ getValue }) => formatDuration(getValue() as number),
        size: 120,
        enableSorting: true
      },
      {
        id: 'breaksCount',
        accessorKey: 'breaksCount',
        header: '#Breaks',
        cell: ({ getValue }) => fmtInt(getValue() as number),
        size: 90,
        enableSorting: true
      },
      {
        id: 'breaksDurationSec',
        accessorKey: 'breaksDurationSec',
        header: 'Breaks Duration',
        cell: ({ getValue }) => formatDuration(getValue() as number),
        size: 130,
        enableSorting: true
      }
    ],
    []
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      columnVisibility
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  useEffect(() => {
    if (sorting.length > 0 && onSortChange) {
      const sort = sorting[0]
      onSortChange(sort.id as keyof AgentPerformanceRow, sort.desc ? 'desc' : 'asc')
    }
  }, [sorting, onSortChange])

  const handleOpenColumnMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setColumnMenuAnchor(event.currentTarget)
  }

  const handleCloseColumnMenu = () => {
    setColumnMenuAnchor(null)
  }

  const handleToggleColumn = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId]
    }))
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-slate-300 border-t-blue-600 rounded-full"></div>
          <div className="mt-4 text-slate-600">Loading performance data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-3 md:p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">Agent Performance</h3>
        <MuiButton
          variant="outlined"
          size="small"
          startIcon={<ViewColumnOutlined />}
          onClick={handleOpenColumnMenu}
        >
          Columns
        </MuiButton>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1800px] w-full table-fixed">
          <thead className="bg-white sticky top-0 z-10 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.column.columnDef.size }}
                    className={cn(
                      'px-4 py-3 md:px-5 md:py-3.5 text-left text-xs font-medium text-slate-700 uppercase tracking-wider',
                      header.column.getCanSort() && 'cursor-pointer select-none hover:bg-slate-50'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className="text-slate-500">
                          {header.column.getIsSorted() === 'asc' ? (
                            <ArrowUp size={14} weight="bold" />
                          ) : (
                            <ArrowDown size={14} weight="bold" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={cn(
                  idx % 2 === 0 ? 'bg-white' : 'bg-slate-50',
                  'hover:bg-slate-100'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap px-4 py-3 md:px-5 md:py-3.5 text-sm text-slate-700 font-tabular-nums"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No performance data found for the selected filters.
          </div>
        )}
      </div>

      <Menu
        anchorEl={columnMenuAnchor}
        open={Boolean(columnMenuAnchor)}
        onClose={handleCloseColumnMenu}
      >
        {table.getAllLeafColumns().map((column) => (
          <MenuItem key={column.id} dense>
            <FormControlLabel
              control={
                <Checkbox
                  checked={column.getIsVisible()}
                  onChange={() => handleToggleColumn(column.id)}
                  size="small"
                />
              }
              label={
                typeof column.columnDef.header === 'string'
                  ? column.columnDef.header
                  : column.id
              }
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
