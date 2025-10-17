export type UserRole = "User" | "Admin" | "Manager"

export type UserAccount = {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
  mobileNumber?: string
  createdOn: string
  createdBy?: string
  lastLogin?: string
  lastCall?: string
  hasPassword?: boolean
  disabled?: boolean
}

export type CreateUserPayload = {
  name: string
  email: string
  role: UserRole
  mobileNumber?: string
  password: string
  avatarUrl?: string
}

export type UpdateUserPayload = Partial<Omit<UserAccount, "id" | "createdOn">> & {
  newPassword?: string
}

export type UsersPageProps = {
  users: UserAccount[]
  loading?: boolean
  onCreateUser?: (payload: CreateUserPayload) => Promise<void>
  onUpdateUser?: (id: string, updates: UpdateUserPayload) => Promise<void>
  onDisableUser?: (id: string) => Promise<void>
  onEnableUser?: (id: string) => Promise<void>
  onResetPassword?: (id: string, newPassword: string) => Promise<void>
}

export type TablePreferences = {
  sortBy: "createdOn" | "lastLogin"
  sortOrder: "asc" | "desc"
  pageSize: number
}
