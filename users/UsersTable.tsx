import { useState } from 'react'
import {
  DotsThree,
  PencilSimple,
  LockKey,
  CheckCircle,
  XCircle,
} from '@phosphor-icons/react'
import { Button, Table, Tag, Pagination } from '@/ui'
import type { TableColumn, TableSort } from '@/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RoleChip } from './RoleChip'
import type { UserAccount } from '@/types/users'
import { formatDistanceToNow } from 'date-fns'

type UsersTableProps = {
  users: UserAccount[]
  onEdit: (user: UserAccount) => void
  onDisable?: (id: string) => Promise<void>
  onEnable?: (id: string) => Promise<void>
  onResetPassword?: (id: string) => void
  sortBy: "createdOn" | "lastLogin"
  sortOrder: "asc" | "desc"
  onSort: (field: "createdOn" | "lastLogin") => void
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  showPagination?: boolean
}

export function UsersTable({
  users,
  onEdit,
  onDisable,
  onEnable,
  onResetPassword,
  sortBy,
  sortOrder,
  onSort,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  showPagination = true,
}: UsersTableProps) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const formatDate = (date?: string) => {
    if (!date) return '—'
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch {
      return '—'
    }
  }

  const formatDateTime = (date?: string) => {
    if (!date) return '—'
    try {
      const dateObj = new Date(date)
      return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return '—'
    }
  }

  const handleToggleStatus = async (user: UserAccount) => {
    setLoadingUserId(user.id)
    setOpenDropdownId(null)
    try {
      if (user.disabled) {
        await onEnable?.(user.id)
      } else {
        await onDisable?.(user.id)
      }
    } finally {
      setLoadingUserId(null)
    }
  }

  const handleEdit = (user: UserAccount) => {
    setOpenDropdownId(null)
    onEdit(user)
  }

  const handleResetPasswordClick = (userId: string) => {
    setOpenDropdownId(null)
    onResetPassword?.(userId)
  }

  const paginatedUsers = users.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
  const totalPages = Math.ceil(users.length / rowsPerPage)

  const handleSort = (sort: TableSort) => {
    onSort(sort.key as "createdOn" | "lastLogin")
  }

  const columns: TableColumn<UserAccount>[] = [
    {
      key: 'user',
      title: 'User',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={record.avatarUrl} alt={record.name} />
            <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
              {record.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-slate-900">{record.name}</div>
            {record.mobileNumber && (
              <div className="text-sm text-slate-500">{record.mobileNumber}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      render: (value) => (
        <div className="text-slate-900">{value}</div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      render: (value) => <RoleChip role={value} />,
    },
    {
      key: 'createdOn',
      title: 'Created On',
      dataIndex: 'createdOn',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-slate-600">{formatDate(value)}</div>
      ),
    },
    {
      key: 'lastLogin',
      title: 'Last Login',
      dataIndex: 'lastLogin',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-slate-600">{formatDate(value)}</div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, record) => (
        <Tag variant={record.disabled ? 'neutral' : 'success'}>
          {record.disabled ? 'Disabled' : 'Active'}
        </Tag>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <div className="relative">
          <Button 
            variant="subtle" 
            size="sm" 
            className="p-2"
            onClick={() => setOpenDropdownId(openDropdownId === record.id ? null : record.id)}
          >
            <DotsThree size={16} weight="bold" />
          </Button>
          
          {openDropdownId === record.id && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setOpenDropdownId(null)}
              />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 shadow-lg z-20 py-1">
                <button
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  onClick={() => handleEdit(record)}
                >
                  <PencilSimple size={16} />
                  Edit User
                </button>
                
                {onResetPassword && (
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    onClick={() => handleResetPasswordClick(record.id)}
                  >
                    <LockKey size={16} />
                    Reset Password
                  </button>
                )}
                
                {(onDisable || onEnable) && (
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleToggleStatus(record)}
                    disabled={loadingUserId === record.id}
                  >
                    {record.disabled ? (
                      <>
                        <CheckCircle size={16} />
                        Enable User
                      </>
                    ) : (
                      <>
                        <XCircle size={16} />
                        Disable User
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ),
    },
  ]

  const currentSort: TableSort = {
    key: sortBy,
    direction: sortOrder,
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1">
        <Table
          columns={columns}
          data={paginatedUsers}
          rowKey="id"
          sort={currentSort}
          onSortChange={handleSort}
          emptyText="No users found"
        />
      </div>

      {showPagination && (
        <div className="p-4 border-t border-slate-200 bg-white">
          <Pagination
            page={page + 1}
            pageSize={rowsPerPage}
            total={users.length}
            onPageChange={(newPage) => onPageChange(newPage - 1)}
            onPageSizeChange={onRowsPerPageChange}
            showSizeChanger
            showQuickJumper
          />
        </div>
      )}
    </div>
  )
}
