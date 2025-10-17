export interface Group {
  id: string;
  name: string;
  memberUserIds: string[];
  color?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
}

export interface UserLite {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  extension?: string;
  active?: boolean;
}

// API Types
export interface GroupsQuery {
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface GroupsResponse {
  groups: Group[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateGroupRequest {
  name: string;
  memberUserIds: string[];
  color?: string;
  notes?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  memberUserIds?: string[];
  color?: string;
  notes?: string;
}

export interface UsersQuery {
  active?: boolean;
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface UsersResponse {
  users: UserLite[];
  total: number;
  page: number;
  pageSize: number;
}

// Default colors for groups
export const GROUP_COLORS = [
  '#6366F1', // indigo-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EC4899', // pink-500
  '#22D3EE', // cyan-400
  '#8B5CF6', // violet-500
  '#EF4444', // red-500
  '#84CC16', // lime-500
] as const;