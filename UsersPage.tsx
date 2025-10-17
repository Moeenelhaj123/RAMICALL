import { useState, useEffect, useMemo } from 'react'
import {
  UsersThree,
  MagnifyingGlass,
  Plus,
  Funnel,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button, Input, Select, Tag, Toolbar, ToolbarSection } from '@/ui'
import type { SelectOption } from '@/ui'
import { UsersTable } from './users/UsersTable'
import { UserModal } from './users/UserModal'
import type {
  UserAccount,
  UserRole,
  TablePreferences,
  CreateUserPayload,
  UpdateUserPayload,
  UsersPageProps,
} from '@/types/users'

const STORAGE_KEY = 'users.view.v1'

const defaultPreferences: TablePreferences = {
  sortBy: 'createdOn',
  sortOrder: 'desc',
  pageSize: 25,
}

function loadPreferences(): TablePreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) }
    }
  } catch (e) {
    console.error('Failed to load preferences:', e)
  }
  return defaultPreferences
}

function savePreferences(prefs: TablePreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch (e) {
    console.error('Failed to save preferences:', e)
  }
}

export function UsersPage(props?: UsersPageProps) {
  const [preferences, setPreferences] = useState<TablePreferences>(loadPreferences)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [page, setPage] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserAccount | undefined>()

  const users = props?.users || mockUsers
  const loading = props?.loading || false

  // Role filter options
  const roleOptions: SelectOption[] = [
    { value: '', label: 'All Roles' },
    { value: 'Admin', label: 'Admin' },
    { value: 'Manager', label: 'Manager' },
    { value: 'User', label: 'User' },
  ]

  useEffect(() => {
    savePreferences(preferences)
  }, [preferences])

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.mobileNumber?.toLowerCase().includes(query)
      )
    }

    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter)
    }

    result.sort((a, b) => {
      const field = preferences.sortBy
      const aVal = a[field] || ''
      const bVal = b[field] || ''
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return preferences.sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [users, searchQuery, roleFilter, preferences.sortBy, preferences.sortOrder])

  const handleSort = (field: "createdOn" | "lastLogin") => {
    setPreferences((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value)
    setPage(0)
  }

  const handleAddUser = () => {
    setEditingUser(undefined)
    setModalOpen(true)
  }

  const handleEditUser = (user: UserAccount) => {
    setEditingUser(user)
    setModalOpen(true)
  }

  const handleSaveUser = async (payload: CreateUserPayload | { id: string; updates: UpdateUserPayload }) => {
    try {
      if ('id' in payload) {
        await props?.onUpdateUser?.(payload.id, payload.updates)
        toast.success('User updated successfully')
      } else {
        await props?.onCreateUser?.(payload)
        toast.success('User created successfully')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred')
      throw error
    }
  }

  const handleDisableUser = async (id: string) => {
    try {
      await props?.onDisableUser?.(id)
      toast.success('User disabled successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to disable user')
      throw error
    }
  }

  const handleEnableUser = async (id: string) => {
    try {
      await props?.onEnableUser?.(id)
      toast.success('User enabled successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to enable user')
      throw error
    }
  }

  const handleResetPassword = (id: string) => {
    const user = users.find((u) => u.id === id)
    if (user) {
      setEditingUser(user)
      setModalOpen(true)
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header with Toolbar */}
      <Toolbar
        leftArea={
          <ToolbarSection>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <UsersThree size={24} weight="bold" className="text-slate-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Users</h1>
                <p className="text-sm text-slate-600">{filteredAndSortedUsers.length} users</p>
              </div>
            </div>
          </ToolbarSection>
        }
        rightArea={
          <ToolbarSection>
            {/* Search Input */}
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(0)
              }}
              iconLeft={<MagnifyingGlass size={20} />}
            />

            {/* Role Filter */}
            <Select
              placeholder="Filter by role"
              options={roleOptions}
              value={roleFilter}
              onChange={(value) => handleRoleFilterChange(value as string)}
            />

            {/* Add User Button */}
            <Button
              variant="primary"
              onClick={handleAddUser}
              disabled={loading}
              iconLeft={<Plus size={20} weight="bold" />}
            >
              Add User
            </Button>
          </ToolbarSection>
        }
        sticky
      />

      {/* Active Filters */}
      {roleFilter && (
        <div className="px-6 py-3 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Filters:</span>
            <Tag
              variant="info"
              onRemove={() => setRoleFilter('')}
            >
              {roleFilter}
            </Tag>
          </div>
        </div>
      )}

      {/* Main Content Area - Table Only */}
      <div className="flex-1 flex flex-col bg-white border border-slate-200">
        <UsersTable
          users={filteredAndSortedUsers}
          onEdit={handleEditUser}
          onDisable={props?.onDisableUser ? handleDisableUser : undefined}
          onEnable={props?.onEnableUser ? handleEnableUser : undefined}
          onResetPassword={props?.onResetPassword ? handleResetPassword : undefined}
          sortBy={preferences.sortBy}
          sortOrder={preferences.sortOrder}
          onSort={handleSort}
          page={page}
          rowsPerPage={preferences.pageSize}
          onPageChange={setPage}
          onRowsPerPageChange={(size) => {
            setPreferences({ ...preferences, pageSize: size })
            setPage(0)
          }}
          showPagination={true}
        />
      </div>

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </div>
  )
}

const mockUsers: UserAccount[] = [
  {
    id: '1',
    name: 'Majed Alnajar',
    email: 'majed.alnajar@example.com',
    role: 'Admin',
    avatarUrl: '',
    mobileNumber: '+971-50-123-4567',
    createdOn: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lastCall: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    hasPassword: true,
  },
  {
    id: '2',
    name: 'Rashed Alnuaimi',
    email: 'rashed.alnuaimi@example.com',
    role: 'Manager',
    mobileNumber: '+971-50-987-6543',
    createdOn: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lastCall: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    hasPassword: true,
  },
  {
    id: '3',
    name: 'Mahdi Alomari',
    email: 'mahdi.alomari@example.com',
    role: 'User',
    mobileNumber: '+971-50-234-5678',
    createdOn: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    lastCall: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    hasPassword: true,
  },
  {
    id: '4',
    name: 'Tareq Global',
    email: 'tareq.global@example.com',
    role: 'User',
    mobileNumber: '+971-50-345-6789',
    createdOn: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    hasPassword: true,
  },
  {
    id: '5',
    name: 'Ruba Khamis',
    email: 'ruba.khamis@example.com',
    role: 'Manager',
    mobileNumber: '+971-50-456-7890',
    createdOn: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    lastCall: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    hasPassword: true,
  },
  {
    id: '6',
    name: 'Yousef Elhaj',
    email: 'yousef.elhaj@example.com',
    role: 'User',
    mobileNumber: '+971-50-567-8901',
    createdOn: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    disabled: true,
    hasPassword: true,
  },
]
