import { useState, useEffect, useMemo } from 'react';
import { fetchGroupById } from '@/services/groups';
import type { Group } from '@/types/groups';

/**
 * Hook to expand group IDs to user IDs for filter components
 * Useful for merging selected users + expanded group users in analytics filters
 * 
 * @param groupIds Array of group IDs to expand
 * @returns Array of unique user IDs from all groups (deduplicated)
 */
export function useGroupUserIds(groupIds: string[]): {
  userIds: string[];
  loading: boolean;
  error: string | null;
} {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (groupIds.length === 0) {
      setGroups([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const loadGroups = async () => {
      try {
        const groupPromises = groupIds.map(id => fetchGroupById(id));
        const groupResults = await Promise.all(groupPromises);
        
        // Filter out null results (groups that don't exist)
        const validGroups = groupResults.filter((group): group is Group => group !== null);
        
        setGroups(validGroups);
      } catch (err) {
        console.error('Failed to load groups for user IDs:', err);
        setError('Failed to load group data');
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [groupIds]);

  // Memoize the user IDs to avoid unnecessary recalculations
  const userIds = useMemo(() => {
    const allUserIds = groups.flatMap(group => group.memberUserIds);
    
    // Deduplicate user IDs
    return Array.from(new Set(allUserIds));
  }, [groups]);

  return { userIds, loading, error };
}

/**
 * Utility function to merge selected user IDs with expanded group user IDs
 * This is useful in filter components where you want to include both directly
 * selected users and users from selected groups
 * 
 * @param selectedUserIds Direct user selections
 * @param selectedGroupIds Group selections to expand
 * @returns Promise<string[]> Merged and deduplicated user IDs
 */
export async function mergeUserAndGroupIds(
  selectedUserIds: string[], 
  selectedGroupIds: string[]
): Promise<string[]> {
  if (selectedGroupIds.length === 0) {
    return selectedUserIds;
  }

  try {
    // Fetch all selected groups
    const groupPromises = selectedGroupIds.map(id => fetchGroupById(id));
    const groups = await Promise.all(groupPromises);
    
    // Extract user IDs from valid groups
    const groupUserIds = groups
      .filter((group): group is Group => group !== null)
      .flatMap(group => group.memberUserIds);
    
    // Merge and deduplicate
    const allUserIds = [...selectedUserIds, ...groupUserIds];
    return Array.from(new Set(allUserIds));
  } catch (error) {
    console.error('Failed to merge user and group IDs:', error);
    // Fallback to just the selected user IDs
    return selectedUserIds;
  }
}

/**
 * Hook variant that automatically merges selected users and groups
 * Perfect for filter components that need both direct and group-based selections
 * 
 * @param selectedUserIds Array of directly selected user IDs
 * @param selectedGroupIds Array of selected group IDs to expand
 * @returns Object with merged user IDs, loading state, and error state
 */
export function useMergedUserIds(
  selectedUserIds: string[], 
  selectedGroupIds: string[]
): {
  userIds: string[];
  loading: boolean;
  error: string | null;
} {
  const [mergedUserIds, setMergedUserIds] = useState<string[]>(selectedUserIds);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedGroupIds.length === 0) {
      setMergedUserIds(selectedUserIds);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const mergeIds = async () => {
      try {
        const merged = await mergeUserAndGroupIds(selectedUserIds, selectedGroupIds);
        setMergedUserIds(merged);
      } catch (err) {
        console.error('Failed to merge user and group IDs:', err);
        setError('Failed to process group selections');
        setMergedUserIds(selectedUserIds); // Fallback to user selections only
      } finally {
        setLoading(false);
      }
    };

    mergeIds();
  }, [selectedUserIds, selectedGroupIds]);

  return { userIds: mergedUserIds, loading, error };
}