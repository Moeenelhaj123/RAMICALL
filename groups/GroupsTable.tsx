import { useState } from 'react';
import {
  DotsThree,
  PencilSimple,
  Trash,
  Users,
} from '@phosphor-icons/react';
import { Button, Table, Pagination, Tag } from '@/ui';
import type { TableColumn, TableSort } from '@/ui';
import type { Group } from '@/types/groups';
import { formatDistanceToNow } from 'date-fns';

type GroupsTableProps = {
  groups: Group[];
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  page: number;
  rowsPerPage: number;
  totalGroups: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  showPagination?: boolean;
  loading?: boolean;
  groupMembers: Record<string, string[]>;
};

export function GroupsTable({
  groups,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
  page,
  rowsPerPage,
  totalGroups,
  onPageChange,
  onRowsPerPageChange,
  showPagination = true,
  loading = false,
  groupMembers,
}: GroupsTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const formatUpdatedAt = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDate = (date?: string) => {
    if (!date) return '—'
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch {
      return '—'
    }
  };

  const handleSort = (sort: TableSort) => {
    onSort?.(sort.key);
  };

  const paginatedGroups = groups.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const columns: TableColumn<Group>[] = [
    {
      key: 'name',
      title: 'Group',
      sortable: true,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: record.color || '#6366F1' }}
          />
          <div>
            <div className="font-medium text-slate-900">{record.name}</div>
            {record.notes && (
              <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                {record.notes}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'members',
      title: 'Members',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Users size={14} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-900">
            {record.memberUserIds.length}
          </span>
          {groupMembers[record.id]?.length > 0 && (
            <div className="text-xs text-slate-500 truncate max-w-xs">
              {groupMembers[record.id].slice(0, 2).join(', ')}
              {groupMembers[record.id].length > 2 && ` +${groupMembers[record.id].length - 2} more`}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created On',
      sortable: true,
      render: (_, record) => (
        <div className="text-sm text-slate-600">{formatDate(record.createdAt)}</div>
      ),
    },
    {
      key: 'updatedAt',
      title: 'Updated',
      sortable: true,
      render: (_, record) => (
        <span className="text-sm text-slate-600">
          {formatUpdatedAt(record.updatedAt)}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, record) => (
        <Tag variant={record.memberUserIds.length > 0 ? 'success' : 'neutral'}>
          {record.memberUserIds.length > 0 ? 'Active' : 'Empty'}
        </Tag>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Button
            variant="subtle"
            size="sm"
            onClick={() => onEdit(record)}
            className="h-8 w-8 p-0"
          >
            <PencilSimple size={18} />
          </Button>
          <Button
            variant="subtle"
            size="sm"
            onClick={() => onDelete(record)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash size={18} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <Table
          data={paginatedGroups}
          columns={columns}
          loading={loading}
          onSortChange={handleSort}
          emptyText="No groups found"
        />
      </div>

      {showPagination && (
        <div className="p-4 border-t border-slate-200 bg-white">
          <Pagination
            page={page + 1}
            pageSize={rowsPerPage}
            total={totalGroups}
            onPageChange={(newPage) => onPageChange(newPage - 1)}
            onPageSizeChange={onRowsPerPageChange}
            showSizeChanger
            showQuickJumper
          />
        </div>
      )}
    </div>
  );
}