import { useMemo } from 'react'
import { Button, Table, Pagination } from '@/ui'
import type { TableColumn } from '@/ui'
import { PencilSimple, Trash, CheckCircle, XCircle } from '@phosphor-icons/react'
import type { AllowIPRow } from '@/types/security'

interface AllowIPTableProps {
  data: AllowIPRow[]
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
  onEdit?: (allowIP: AllowIPRow) => void
  onDelete?: (allowIP: AllowIPRow) => void
}

export function AllowIPTable({ 
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
  showPagination = true,
  onEdit,
  onDelete
}: AllowIPTableProps) {
  
  // Fallback so the footer renders even if parent didn't pass total
  const resolvedTotal = typeof total === 'number' ? total : data.length

  const formatStatus = (status: string) => {
    switch (status) {
      case 'Active':
        return { label: 'Active', color: 'text-green-600', icon: <CheckCircle size={16} /> }
      case 'Inactive':
        return { label: 'Inactive', color: 'text-red-600', icon: <XCircle size={16} /> }
      default:
        return { label: status, color: 'text-slate-600', icon: null }
    }
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const columns: TableColumn<AllowIPRow>[] = [
    {
      key: 'ip',
      title: 'IP Address',
      dataIndex: 'ip',
      sortable: true,
      width: '180px',
      headerClassName: 'text-left min-w-[180px]',
      className: 'text-left min-w-[180px]',
      render: (value) => (
        <div className="font-semibold text-slate-900">
          {value}
        </div>
      )
    },
    {
      key: 'description',
      title: 'Description',
      dataIndex: 'description',
      sortable: true,
      width: '250px',
      headerClassName: 'text-left min-w-[250px]',
      className: 'text-left min-w-[250px]',
      render: (value) => (
        <div className="text-slate-700">
          {value}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      width: '120px',
      headerClassName: 'text-left min-w-[120px]',
      className: 'text-left min-w-[120px]',
      render: (value) => {
        const status = formatStatus(value)
        return (
          <div className={`flex items-center gap-1 ${status.color}`}>
            {status.icon}
            <span className="font-medium">{status.label}</span>
          </div>
        )
      }
    },
    {
      key: 'createdBy',
      title: 'Created By',
      dataIndex: 'createdBy',
      sortable: true,
      width: '140px',
      headerClassName: 'text-left min-w-[140px]',
      className: 'text-left min-w-[140px]',
      render: (value) => (
        <div className="text-slate-700">
          {value}
        </div>
      )
    },
    {
      key: 'createdOn',
      title: 'Created On',
      dataIndex: 'createdOn',
      sortable: true,
      width: '160px',
      headerClassName: 'text-left min-w-[160px]',
      className: 'text-left min-w-[160px]',
      render: (value) => (
        <div className="text-slate-600 text-sm">
          {formatDate(value)}
        </div>
      )
    },
    {
      key: 'updated',
      title: 'Updated',
      dataIndex: 'updated',
      sortable: true,
      width: '160px',
      headerClassName: 'text-left min-w-[160px]',
      className: 'text-left min-w-[160px]',
      render: (value) => (
        <div className="text-slate-600 text-sm">
          {formatDate(value)}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '120px',
      headerClassName: 'text-center min-w-[120px]',
      className: 'text-center min-w-[120px]',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="subtle"
            size="sm"
            className="p-2"
            onClick={() => onEdit?.(record)}
          >
            <PencilSimple size={14} />
          </Button>
          <Button
            variant="subtle"
            size="sm"
            className="p-2"
            onClick={() => onDelete?.(record)}
          >
            <Trash size={14} />
          </Button>
        </div>
      )
    }
  ]

  const currentSort = {
    key: sortBy,
    direction: sortOrder,
  }

  const paginatedData = showPagination 
    ? data.slice(page * pageSize, (page + 1) * pageSize)
    : data

  const handleSort = (sort: any) => {
    onSort(sort.key)
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Table container that fills available space */}
      <div className="flex-1 overflow-auto">
        <Table
          columns={columns}
          data={paginatedData}
          rowKey={(record) => record.id}
          sort={currentSort}
          onSortChange={handleSort}
          loading={loading}
          emptyText="No IP addresses found."
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