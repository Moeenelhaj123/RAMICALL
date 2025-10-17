import React, { useState, useEffect, useMemo } from 'react';
import { AllowIPToolbar } from '@/components/allow-ip/AllowIPToolbar';
import { AllowIPTable } from '@/components/allow-ip/AllowIPTable';
import { toast } from 'sonner';
import type { AllowIPRow, ListQuery } from '@/types/security';

interface AllowIPPageState {
  data: AllowIPRow[];
  loading: boolean;
  query: ListQuery;
  totalCount: number;
  selectedRows: AllowIPRow[];
}

export default function AllowIPPage() {
  const [state, setState] = useState<AllowIPPageState>({
    data: [],
    loading: true,
    query: {
      page: 1,
      pageSize: 50,
      q: '',
      sortBy: 'ip',
      order: 'asc',
    },
    totalCount: 0,
    selectedRows: [],
  });

  // Modal and drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load allow IP data
  const loadAllowIPs = async (newQuery?: Partial<ListQuery>) => {
    const queryToUse = newQuery ? { ...state.query, ...newQuery } : state.query;
    
    setState(prev => ({ ...prev, loading: true, query: queryToUse }));
    
    try {
      // Mock data - replace with actual API call
      const mockData: AllowIPRow[] = [
        {
          id: '1',
          ip: '192.168.1.100',
          description: 'Office Network Main',
          status: 'Active',
          createdBy: 'admin',
          createdOn: new Date('2024-01-15'),
          updated: new Date('2024-01-20'),
        },
        {
          id: '2',
          ip: '10.0.0.50',
          description: 'Remote Office Branch',
          status: 'Inactive',
          createdBy: 'manager',
          createdOn: new Date('2024-01-10'),
          updated: new Date('2024-01-18'),
        },
        {
          id: '3',
          ip: '172.16.0.25',
          description: 'VPN Gateway Server',
          status: 'Active',
          createdBy: 'admin',
          createdOn: new Date('2024-01-05'),
          updated: new Date('2024-01-15'),
        },
        {
          id: '4',
          ip: '203.0.113.10',
          description: 'External Partner Access',
          status: 'Active',
          createdBy: 'security',
          createdOn: new Date('2024-01-08'),
          updated: new Date('2024-01-22'),
        },
        {
          id: '5',
          ip: '198.51.100.5',
          description: 'Backup Server Network',
          status: 'Inactive',
          createdBy: 'admin',
          createdOn: new Date('2024-01-12'),
          updated: new Date('2024-01-19'),
        },
      ];

      // Simulate filtering
      const filteredData = mockData.filter(item => 
        !queryToUse.q || 
        item.ip.toLowerCase().includes(queryToUse.q.toLowerCase()) ||
        item.description.toLowerCase().includes(queryToUse.q.toLowerCase()) ||
        item.status.toLowerCase().includes(queryToUse.q.toLowerCase()) ||
        item.createdBy.toLowerCase().includes(queryToUse.q.toLowerCase())
      );

      // Simulate sorting
      const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[queryToUse.sortBy as keyof AllowIPRow] as string;
        const bValue = b[queryToUse.sortBy as keyof AllowIPRow] as string;
        
        const comparison = aValue.localeCompare(bValue);
        return queryToUse.order === 'asc' ? comparison : -comparison;
      });

      setState(prev => ({
        ...prev,
        data: sortedData,
        totalCount: filteredData.length,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load allow IP data:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Initial load
  useEffect(() => {
    loadAllowIPs();
  }, []);

  // Toolbar event handlers
  const handleSearch = (searchTerm: string) => {
    loadAllowIPs({ q: searchTerm, page: 1 });
  };

  const handleAddAllowIP = () => {
    setDrawerOpen(true);
  };

  const handleEditAllowIPs = () => {
    if (state.selectedRows.length === 1) {
      toast.info('Edit functionality coming soon');
    }
  };

  const handleImportAllowIPs = () => {
    setImportModalOpen(true);
  };

  const handleExportAllowIPs = async () => {
    try {
      // Mock export functionality
      toast.success('Allow IPs exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export Allow IPs');
    }
  };

  const handleDeleteAllowIPs = () => {
    if (state.selectedRows.length > 0) {
      setDeleteConfirmOpen(true);
    }
  };

  // Table event handlers
  const handleSort = (sortBy: string, order: 'asc' | 'desc') => {
    loadAllowIPs({ 
      sortBy: sortBy as 'ip' | 'description' | 'status' | 'createdBy' | 'createdOn' | 'updated', 
      order, 
      page: 1 
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    loadAllowIPs({ page, pageSize });
  };

  const handleRowSelect = (selectedRows: AllowIPRow[]) => {
    setState(prev => ({ ...prev, selectedRows }));
  };

  const handleRowEdit = (allowIP: AllowIPRow) => {
    // Handle single row edit
    toast.info('Edit functionality coming soon');
  };

  const handleRowDelete = async (allowIP: AllowIPRow) => {
    try {
      // Mock delete single row
      toast.success('Allow IP deleted successfully');
      await loadAllowIPs();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete Allow IP');
    }
  };

  // Memoized props for components
  const toolbarProps = useMemo(() => ({
    canEdit: state.selectedRows.length === 1,
    canDelete: state.selectedRows.length > 0,
    onAdd: handleAddAllowIP,
    onEdit: handleEditAllowIPs,
    onDelete: handleDeleteAllowIPs,
    onImport: handleImportAllowIPs,
    onExport: handleExportAllowIPs,
    searchValue: state.query.q,
    onSearch: handleSearch,
    loading: state.loading,
  }), [state.selectedRows.length, state.query.q, state.loading]);

  const tableProps = useMemo(() => ({
    data: state.data,
    loading: state.loading,
    sortBy: state.query.sortBy,
    sortOrder: state.query.order,
    onSort: (field: string) => {
      const newOrder = state.query.sortBy === field && state.query.order === 'asc' ? 'desc' : 'asc';
      handleSort(field, newOrder);
    },
    page: (state.query.page || 1) - 1, // Convert to 0-based indexing
    pageSize: state.query.pageSize || 50,
    total: state.totalCount,
    onPageChange: (page: number) => handlePageChange(page + 1, state.query.pageSize || 50), // Convert back to 1-based
    onPageSizeChange: (pageSize: number) => handlePageChange(1, pageSize),
    showPagination: true,
    onEdit: handleRowEdit,
    onDelete: handleRowDelete,
  }), [state]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar with built-in sticky */}
      <AllowIPToolbar {...toolbarProps} />

      {/* Full Width Table */}
      <div className="flex-1 overflow-hidden">
        <AllowIPTable {...tableProps} />
      </div>

      {/* TODO: Add modals and drawers when needed
      <AllowIPDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleDrawerSubmit}
      />

      <ImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportSubmit}
      />

      <DeleteConfirm
        open={deleteConfirmOpen}
        allowIPs={state.selectedRows}
        loading={deleteLoading}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
      */}
    </div>
  );
}