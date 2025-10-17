import { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button, Table, Pagination } from '@/ui'
import type { TableColumn, TableSort } from '@/ui'
import { PencilSimple, Trash, Desktop, DeviceMobile, Globe, Phone } from '@phosphor-icons/react'
import type { ExtensionRow, Presence, DeviceStatus } from '@/types/extensions'

interface ExtensionsTableProps {
  data: ExtensionRow[]
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
  onEdit?: (extension: ExtensionRow) => void
  onDelete?: (extension: ExtensionRow) => void
}

export function ExtensionsTable({ 
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
}: ExtensionsTableProps) {
  
  const handleSort = (sort: TableSort) => {
    onSort(sort.key)
  }

  // Fallback so the footer renders even if parent didn't pass total
  const resolvedTotal = typeof total === 'number' ? total : data.length

  const formatPresence = (presence: Presence) => {
    switch (presence) {
      case 'Available':
        return { label: 'Available', color: 'text-green-600' }
      case 'Away':
        return { label: 'Away', color: 'text-yellow-600' }
      case 'DND':
        return { label: 'DND', color: 'text-red-600' }
      case 'Offline':
        return { label: 'Offline', color: 'text-gray-600' }
      default:
        return { label: 'Unknown', color: 'text-gray-600' }
    }
  }

  function DeviceIcons({ device }: { device: DeviceStatus }) {
    return (
      <div className="flex items-center gap-1">
        <Phone 
          size={14} 
          className={device.sip ? 'text-green-600' : 'text-slate-400'} 
          weight={device.sip ? 'fill' : 'regular'}
        />
        <Desktop 
          size={14} 
          className={device.pc ? 'text-green-600' : 'text-slate-400'} 
          weight={device.pc ? 'fill' : 'regular'}
        />
        <DeviceMobile 
          size={14} 
          className={device.mobile ? 'text-green-600' : 'text-slate-400'} 
          weight={device.mobile ? 'fill' : 'regular'}
        />
        <Globe 
          size={14} 
          className={device.web ? 'text-green-600' : 'text-slate-400'} 
          weight={device.web ? 'fill' : 'regular'}
        />
      </div>
    )
  }

  const columns: TableColumn<ExtensionRow>[] = [
    {
      key: 'extension',
      title: 'Extension',
      width: '220px',
      headerClassName: 'text-left min-w-[220px]',
      className: 'text-left min-w-[220px]',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-slate-100 text-slate-600 font-medium text-xs">
              {record.extension.slice(-2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-slate-900 truncate">{record.extension}</div>
            <div className="text-sm text-slate-500 truncate">{record.callerIdName || '—'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'device',
      title: 'Device Status',
      width: '130px',
      headerClassName: 'text-center min-w-[130px]',
      className: 'text-center min-w-[130px]',
      render: (_, record) => <DeviceIcons device={record.device} />,
    },
    {
      key: 'presence',
      title: 'Presence',
      dataIndex: 'presence',
      sortable: true,
      width: '120px',
      headerClassName: 'text-left min-w-[120px]',
      className: 'text-left min-w-[120px]',
      render: (value) => {
        const presenceConfig = formatPresence(value)
        return <div className={`font-medium ${presenceConfig.color}`}>{presenceConfig.label}</div>
      },
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      sortable: true,
      width: '120px',
      headerClassName: 'text-left min-w-[120px]',
      className: 'text-left min-w-[120px]',
      render: (value) => <div className="text-slate-900">{value || '—'}</div>,
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
      width: '200px',
      headerClassName: 'text-left min-w-[200px]',
      className: 'text-left min-w-[200px]',
      render: (value) => <div className="text-slate-900 truncate">{value || '—'}</div>,
    },
    {
      key: 'mobile',
      title: 'Mobile',
      dataIndex: 'mobile',
      sortable: true,
      width: '150px',
      headerClassName: 'text-left min-w-[150px]',
      className: 'text-left min-w-[150px]',
      render: (value) => <div className="text-slate-900">{value || '—'}</div>,
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
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <Table
          columns={columns}
          data={paginatedData}
          rowKey={(record) => record.id}
          sort={currentSort}
          onSortChange={handleSort}
          loading={loading}
          emptyText="No extensions found."
          maxHeight="calc(100vh - 280px)"
        />
      </div>

      {showPagination && onPageChange && (
        <div className="sticky bottom-0 left-0 right-0 z-50 flex-shrink-0 p-4 border-t border-slate-200 bg-white shadow-lg">
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