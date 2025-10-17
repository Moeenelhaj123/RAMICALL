import { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Toolbar, ToolbarSection, Input, Button } from '@/ui';
import { 
  Plus, 
  MagnifyingGlass,
  Users
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import type { Group, GroupsQuery } from '@/types/groups';
import { fetchGroups, deleteGroup } from '@/services/groups';
import { fetchUsersByIds } from '@/services/users';
import { GroupDrawer } from '@/components/groups/GroupDrawer';
import { GroupsTable } from '@/components/groups/GroupsTable';

export function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize] = useState(25);
  const [total, setTotal] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; group: Group | null }>({
    open: false,
    group: null,
  });
  const [groupMembers, setGroupMembers] = useState<Record<string, string[]>>({});

  const query: GroupsQuery = useMemo(() => ({
    query: searchQuery || undefined,
    page,
    pageSize,
  }), [searchQuery, page, pageSize]);

  const loadGroups = useCallback(async (queryParams: GroupsQuery) => {
    setLoading(true);
    try {
      const response = await fetchGroups(queryParams);
      setGroups(response.groups);
      setTotal(response.total);

      // Load member names for each group
      const memberPromises = response.groups.map(async (group) => {
        if (group.memberUserIds.length > 0) {
          const members = await fetchUsersByIds(group.memberUserIds);
          return { groupId: group.id, memberNames: members.map(m => m.name) };
        }
        return { groupId: group.id, memberNames: [] };
      });

      const memberResults = await Promise.all(memberPromises);
      const membersMap = memberResults.reduce((acc, { groupId, memberNames }) => {
        acc[groupId] = memberNames;
        return acc;
      }, {} as Record<string, string[]>);

      setGroupMembers(membersMap);
    } catch (error) {
      console.error('Failed to load groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups(query);
  }, [loadGroups, query]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(0); // Reset to first page when searching
  }, []);

  const handleNewGroup = useCallback(() => {
    setEditingGroup(null);
    setDrawerOpen(true);
  }, []);

  const handleEditGroup = useCallback((group: Group) => {
    setEditingGroup(group);
    setDrawerOpen(true);
  }, []);

  const handleDeleteGroup = useCallback((group: Group) => {
    setDeleteConfirm({ open: true, group });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirm.group) return;

    try {
      await deleteGroup(deleteConfirm.group.id);
      toast.success(`Group "${deleteConfirm.group.name}" deleted successfully`);
      
      // Refresh the list
      loadGroups(query);
    } catch (error) {
      console.error('Failed to delete group:', error);
      toast.error('Failed to delete group');
    } finally {
      setDeleteConfirm({ open: false, group: null });
    }
  }, [deleteConfirm.group, loadGroups, query]);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setEditingGroup(null);
  }, []);

  const handleGroupSaved = useCallback(() => {
    setDrawerOpen(false);
    setEditingGroup(null);
    // Refresh the list
    loadGroups(query);
  }, [loadGroups, query]);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header with Toolbar */}
      <Toolbar
        leftArea={
          <ToolbarSection>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Users size={24} weight="bold" className="text-slate-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Groups</h1>
                <p className="text-sm text-slate-600">{total} groups</p>
              </div>
            </div>
          </ToolbarSection>
        }
        rightArea={
          <ToolbarSection>
            {/* Search Input */}
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              iconLeft={<MagnifyingGlass size={20} />}
            />

            {/* Add Group Button */}
            <Button
              variant="primary"
              onClick={handleNewGroup}
              disabled={loading}
              iconLeft={<Plus size={20} weight="bold" />}
            >
              Add Group
            </Button>
          </ToolbarSection>
        }
        sticky
      />

      {/* Main Content Area - Table Only */}
      <div className="flex-1 flex flex-col bg-white border border-slate-200">
        <GroupsTable
          groups={groups}
          onEdit={handleEditGroup}
          onDelete={handleDeleteGroup}
          page={page}
          rowsPerPage={pageSize}
          totalGroups={total}
          onPageChange={setPage}
          onRowsPerPageChange={() => {}} // pageSize is fixed for now
          showPagination={true}
          loading={loading}
          groupMembers={groupMembers}
        />
      </div>

      {/* Create/Edit Drawer */}
      <GroupDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        group={editingGroup}
        onSaved={handleGroupSaved}
        onCancel={handleDrawerClose}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ open, group: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm.group?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}