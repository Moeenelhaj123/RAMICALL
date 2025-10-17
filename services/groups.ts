import type { 
  Group, 
  GroupsQuery, 
  GroupsResponse, 
  CreateGroupRequest, 
  UpdateGroupRequest 
} from '@/types/groups';

// Mock data for development
const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Sales Team',
    memberUserIds: ['1', '2', '3'],
    color: '#10B981',
    notes: 'Main sales representatives',
    createdAt: '2025-10-01T10:00:00.000Z',
    updatedAt: '2025-10-15T14:30:00.000Z',
    createdByUserId: '1',
  },
  {
    id: '2',
    name: 'Support Team',
    memberUserIds: ['4', '5', '6'],
    color: '#6366F1',
    notes: 'Customer support agents',
    createdAt: '2025-10-02T09:15:00.000Z',
    updatedAt: '2025-10-14T16:45:00.000Z',
    createdByUserId: '1',
  },
  {
    id: '3',
    name: 'Management',
    memberUserIds: ['1', '7'],
    color: '#EC4899',
    notes: 'Team leads and managers',
    createdAt: '2025-10-03T11:20:00.000Z',
    updatedAt: '2025-10-12T13:10:00.000Z',
    createdByUserId: '1',
  },
];

let mockGroupsStore = [...mockGroups];

/**
 * Fetch groups with optional search and pagination
 */
export async function fetchGroups(query: GroupsQuery = {}): Promise<GroupsResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredGroups = [...mockGroupsStore];

  // Apply search filter
  if (query.query) {
    const searchLower = query.query.toLowerCase();
    filteredGroups = filteredGroups.filter(group =>
      group.name.toLowerCase().includes(searchLower) ||
      group.notes?.toLowerCase().includes(searchLower)
    );
  }

  // Apply pagination
  const page = query.page || 0;
  const pageSize = query.pageSize || 25;
  const startIndex = page * pageSize;
  const paginatedGroups = filteredGroups.slice(startIndex, startIndex + pageSize);

  return {
    groups: paginatedGroups,
    total: filteredGroups.length,
    page,
    pageSize,
  };
}

/**
 * Create a new group
 */
export async function createGroup(data: CreateGroupRequest): Promise<Group> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const newGroup: Group = {
    id: Math.random().toString(36).substring(2, 15),
    name: data.name,
    memberUserIds: data.memberUserIds,
    color: data.color,
    notes: data.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdByUserId: '1', // Mock current user
  };

  mockGroupsStore.push(newGroup);
  return newGroup;
}

/**
 * Update an existing group
 */
export async function updateGroup(id: string, data: UpdateGroupRequest): Promise<Group> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const groupIndex = mockGroupsStore.findIndex(g => g.id === id);
  if (groupIndex === -1) {
    throw new Error('Group not found');
  }

  const updatedGroup: Group = {
    ...mockGroupsStore[groupIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockGroupsStore[groupIndex] = updatedGroup;
  return updatedGroup;
}

/**
 * Delete a group
 */
export async function deleteGroup(id: string): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const groupIndex = mockGroupsStore.findIndex(g => g.id === id);
  if (groupIndex === -1) {
    throw new Error('Group not found');
  }

  mockGroupsStore.splice(groupIndex, 1);
}

/**
 * Get a single group by ID
 */
export async function fetchGroupById(id: string): Promise<Group | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return mockGroupsStore.find(g => g.id === id) || null;
}