import { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button, Table, Pagination } from '@/ui'
import type { TableColumn, TableSort } from '@/ui'
import { PencilSimple, Eye } from '@phosphor-icons/react'
import { formatDuration, fmtInt } from '@/lib/formatters'
import type { AgentPerformanceData } from '@/types/performance'

interface AgentPerformanceTableProps {
  data: AgentPerformanceData[]
  loading?: boolean
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onSort: (field: string) => void
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  showPagination?: boolean
}

export function AgentPerformanceTable({ 
  data, 
  loading = false, 
  sortBy, 
  sortOrder, 
  onSort,
  page = 0,
  pageSize = 25,
  total,
  onPageChange,
  onPageSizeChange,
  showPagination = true
}: AgentPerformanceTableProps) {
  
  const handleSort = (sort: TableSort) => {
    onSort(sort.key)
  }

  // Fallback so the footer renders even if parent didn't pass total
  const resolvedTotal = typeof total === 'number' ? total : data.length

  const columns: TableColumn<AgentPerformanceData>[] = [
    {
      key: 'agent',
      title: 'Agent',
      width: '220px',
      headerClassName: 'text-left min-w-[220px]',
      className: 'text-left min-w-[220px]',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={record.agent.avatarUrl} alt={record.agent.name} />
            <AvatarFallback className="bg-slate-100 text-slate-600 font-medium text-xs">
              {record.agent.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-slate-900 truncate">{record.agent.name}</div>
            <div className="text-sm text-slate-500 truncate">{record.agent.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'answeredCount',
      title: 'Answered',
      dataIndex: 'answeredCount',
      sortable: true,
      width: '110px',
      headerClassName: 'text-right min-w-[110px]',
      className: 'text-right tabular-nums min-w-[110px]',
      render: (value) => <div className="text-slate-900">{fmtInt(value)}</div>,
    },
    {
      key: 'busyCount',
      title: 'Busy',
      dataIndex: 'busyCount',
      sortable: true,
      width: '100px',
      headerClassName: 'text-right min-w-[100px]',
      className: 'text-right tabular-nums min-w-[100px]',
      render: (value) => <div className="text-slate-900">{fmtInt(value)}</div>,
    },
    {
      key: 'hungupCount',
      title: 'Hung Up',
      dataIndex: 'hungupCount',
      sortable: true,
      width: '110px',
      headerClassName: 'text-right min-w-[110px]',
      className: 'text-right tabular-nums min-w-[110px]',
      render: (value) => <div className="text-slate-900">{fmtInt(value)}</div>,
    },
    {
      key: 'noAnswerCount',
      title: 'No Answer',
      dataIndex: 'noAnswerCount',
      sortable: true,
      width: '120px',
      headerClassName: 'text-right min-w-[120px]',
      className: 'text-right tabular-nums min-w-[120px]',
      render: (value) => <div className="text-slate-900">{fmtInt(value)}</div>,
    },
    {
      key: 'missedCount',
      title: 'Missed',
      dataIndex: 'missedCount',
      sortable: true,
      width: '110px',
      headerClassName: 'text-right min-w-[110px]',
      className: 'text-right tabular-nums min-w-[110px]',
      render: (value) => <div className="text-slate-900">{fmtInt(value)}</div>,
    },
    {
      key: 'avgRingSec',
      title: 'Avg Ring',
      dataIndex: 'avgRingSec',
      sortable: true,
      width: '110px',
      headerClassName: 'text-right min-w-[110px]',
      className: 'text-right tabular-nums min-w-[110px]',
      render: (value) => <div className="text-slate-900">{formatDuration(value)}</div>,
    },
    {
      key: 'outboundCount',
      title: 'Outbound',
      dataIndex: 'outboundCount',
      sortable: true,
      width: '120px',
      headerClassName: 'text-right min-w-[120px]',
      className: 'text-right tabular-nums min-w-[120px]',
      render: (value) => <div className="text-slate-900">{fmtInt(value)}</div>,
    },
    {
      key: 'outboundAnsweredCount',
      title: 'Out Answered',
      dataIndex: 'outboundAnsweredCount',
      sortable: true,
      width: '150px',
      headerClassName: 'text-right min-w-[150px]',
      className: 'text-right tabular-nums min-w-[150px]',
      render: (value) => <div className="text-slate-900">{fmtInt(value)}</div>,
    },
    {
      key: 'outboundClientsCount',
      title: 'Out Clients',
      dataIndex: 'outboundClientsCount',
      sortable: true,
      width: '150px',
      headerClassName: 'text-right min-w-[150px]',
      className: 'text-right tabular-nums min-w-[150px]',
      render: (value) => <div className="text-slate-900">{fmtInt(value)}</div>,
    },
    {
      key: 'totalTalkingSec',
      title: 'Talk Time',
      dataIndex: 'totalTalkingSec',
      sortable: true,
      width: '140px',
      headerClassName: 'text-right min-w-[140px]',
      className: 'text-right tabular-nums min-w-[140px]',
      render: (value) => <div className="text-slate-900">{formatDuration(value)}</div>,
    },
    {
      key: 'uniqueContactsCount',
      title: 'Contacts',
      dataIndex: 'uniqueContactsCount',
      sortable: true,
      width: '140px',
      headerClassName: 'text-right min-w-[140px]',
      className: 'text-right tabular-nums min-w-[140px]',
      render: (value) => <div className="text-slate-900">{fmtInt(value)}</div>,
    },
    {
      key: 'breaksDurationSec',
      title: 'Break Time',
      dataIndex: 'breaksDurationSec',
      sortable: true,
      width: '130px',
      headerClassName: 'text-right min-w-[130px]',
      className: 'text-right tabular-nums min-w-[130px]',
      render: (value) => <div className="text-slate-900">{formatDuration(value)}</div>,
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '110px',
      headerClassName: 'text-center min-w-[110px]',
      className: 'text-center min-w-[110px]',
      render: (_, record) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="subtle"
            size="sm"
            className="p-2"
          >
            <PencilSimple size={14} />
          </Button>
          <Button
            variant="subtle"
            size="sm"
            className="p-2"
          >
            <Eye size={14} />
          </Button>
        </div>
      ),
    },
  ]

  const currentSort: TableSort = {
    key: sortBy,
    direction: sortOrder,
  }

  const paginatedData = showPagination 
    ? data.slice(page * pageSize, (page + 1) * pageSize)
    : data

  const totalPages = Math.ceil(data.length / pageSize)

  return (
    <div className="relative h-full flex flex-col">
      {/* Table container that fills available space */}
      <div className="flex-1 overflow-auto">
        <Table
          columns={columns}
          data={paginatedData}
          rowKey={(record) => record.agent.id}
          sort={currentSort}
          onSortChange={handleSort}
          loading={loading}
          emptyText="No performance data found for the selected range."
        />
      </div>

      {/* Pagination - always at bottom regardless of data amount */}
      {showPagination && onPageChange && (
        <div className="flex-shrink-0 border-t border-slate-200 bg-white p-4 shadow-lg">
          <Pagination
            page={page + 1}
            pageSize={pageSize}
            total={resolvedTotal}
            onPageChange={(newPage) => onPageChange(newPage - 1)}
            onPageSizeChange={onPageSizeChange}
            showSizeChanger
            showQuickJumper
          />
        </div>
      )}
    </div>
  )
}