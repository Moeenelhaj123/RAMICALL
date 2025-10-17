import type { UserLite, UsersQuery, UsersResponse } from '@/types/groups';

// Mock user data - convert from existing UserAccount type
const mockUsers: UserLite[] = [
  {
    id: '1',
    name: 'Majed Alnajar',
    email: 'majed.alnajar@example.com',
    extension: '1001',
    active: true,
    avatarUrl: '',
  },
  {
    id: '2',
    name: 'Rashed Alnuaimi',
    email: 'rashed.alnuaimi@example.com',
    extension: '1002',
    active: true,
    avatarUrl: '',
  },
  {
    id: '3',
    name: 'Fatima Alkindi',
    email: 'fatima.alkindi@example.com',
    extension: '1003',
    active: true,
    avatarUrl: '',
  },
  {
    id: '4',
    name: 'Ahmad Alshehhi',
    email: 'ahmad.alshehhi@example.com',
    extension: '1004',
    active: true,
    avatarUrl: '',
  },
  {
    id: '5',
    name: 'Sarah Almheiri',
    email: 'sarah.almheiri@example.com',
    extension: '1005',
    active: true,
    avatarUrl: '',
  },
  {
    id: '6',
    name: 'Mohammed Alzaabi',
    email: 'mohammed.alzaabi@example.com',
    extension: '1006',
    active: true,
    avatarUrl: '',
  },
  {
    id: '7',
    name: 'Aisha Alsuwaidi',
    email: 'aisha.alsuwaidi@example.com',
    extension: '1007',
    active: true,
    avatarUrl: '',
  },
  {
    id: '8',
    name: 'Omar Almazrouei',
    email: 'omar.almazrouei@example.com',
    extension: '1008',
    active: false, // Inactive user
    avatarUrl: '',
  },
];

/**
 * Fetch users with optional filtering and pagination
 */
export async function fetchUsers(query: UsersQuery = {}): Promise<UsersResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));

  let filteredUsers = [...mockUsers];

  // Filter by active status
  if (query.active !== undefined) {
    filteredUsers = filteredUsers.filter(user => user.active === query.active);
  }

  // Apply search filter
  if (query.query) {
    const searchLower = query.query.toLowerCase();
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.extension?.toLowerCase().includes(searchLower)
    );
  }

  // Apply pagination
  const page = query.page || 0;
  const pageSize = query.pageSize || 50; // Larger page size for selectors
  const startIndex = page * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  return {
    users: paginatedUsers,
    total: filteredUsers.length,
    page,
    pageSize,
  };
}

/**
 * Get users by IDs (useful for resolving group members)
 */
export async function fetchUsersByIds(userIds: string[]): Promise<UserLite[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150));

  return mockUsers.filter(user => userIds.includes(user.id));
}