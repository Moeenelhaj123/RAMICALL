import React, { useState, useEffect, useMemo } from 'react';
import { ExtensionsToolbar } from '@/components/extensions/ExtensionsToolbar';
import { ExtensionsTable } from '@/components/extensions/ExtensionsTable';
import ExtensionDrawer, { ExtensionCreateDTO } from '@/components/extensions/ExtensionDrawer';
import { ImportModal } from '@/components/extensions/ImportModal';
import { DeleteConfirm } from '@/components/extensions/DeleteConfirm';
import * as extensionsService from '@/services/extensions';
import { toast } from 'sonner';
import type { SortingState } from '@tanstack/react-table';
import type { 
  ExtensionRow, 
  ExtensionsResponse, 
  ListQuery, 
  ExtensionFormData,
  ImportResult 
} from '@/types/extensions';

interface ExtensionsPageState {
  data: ExtensionRow[];
  loading: boolean;
  query: ListQuery;
  totalCount: number;
  selectedRows: ExtensionRow[];
}

export default function ExtensionsPage() {
  const [state, setState] = useState<ExtensionsPageState>({
    data: [],
    loading: true,
    query: {
      page: 1,
      pageSize: 50,
      q: '',
      sortBy: 'extension',
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

  // Load extensions data
  const loadExtensions = async (newQuery?: Partial<ListQuery>) => {
    const queryToUse = newQuery ? { ...state.query, ...newQuery } : state.query;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response: ExtensionsResponse = await extensionsService.getExtensions(queryToUse);
      
      setState(prev => ({
        ...prev,
        data: response.data,
        totalCount: response.meta.total,
        query: queryToUse,
        loading: false,
        // Reset selection when data changes
        selectedRows: prev.selectedRows.filter(selected =>
          response.data.some(row => row.extension === selected.extension)
        ),
      }));
    } catch (error) {
      console.error('Failed to load extensions:', error);
      toast.error('Failed to load extensions');
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Initial load
  useEffect(() => {
    loadExtensions();
  }, []);

  // Toolbar event handlers
  const handleSearch = (searchTerm: string) => {
    loadExtensions({ q: searchTerm, page: 1 });
  };

  const handleAddExtension = () => {
    setDrawerOpen(true);
  };

  const handleEditExtensions = () => {
    // Keep existing edit functionality if needed
    if (state.selectedRows.length === 1) {
      // For now, just show a message - edit functionality can be added later
      toast.info('Edit functionality coming soon');
    }
  };

  const handleImportExtensions = () => {
    setImportModalOpen(true);
  };

  const handleExportExtensions = async () => {
    try {
      await extensionsService.exportExtensions(state.query);
      toast.success('Extensions exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export extensions');
    }
  };

  const handleDeleteExtensions = () => {
    if (state.selectedRows.length > 0) {
      setDeleteConfirmOpen(true);
    }
  };

  // Table event handlers
  const handleSort = (sortBy: string, order: 'asc' | 'desc') => {
    loadExtensions({ 
      sortBy: sortBy as 'presence' | 'extension' | 'callerIdName' | 'role' | 'email' | 'mobile', 
      order, 
      page: 1 
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    loadExtensions({ page, pageSize });
  };

  const handleRowSelectionChange = (selectedRows: ExtensionRow[]) => {
    setState(prev => ({ ...prev, selectedRows }));
  };

  const handleRowEdit = (row: ExtensionRow) => {
    // For now, just show a message - edit functionality can be added later
    toast.info('Edit functionality coming soon');
  };

  const handleRowDelete = (row: ExtensionRow) => {
    setState(prev => ({ ...prev, selectedRows: [row] }));
    setDeleteConfirmOpen(true);
  };

  // Drawer handlers
  const handleDrawerSubmit = async (payload: ExtensionCreateDTO) => {
    try {
      await extensionsService.createExtension(payload);
      toast.success('Extension created successfully');
      
      // Reload data
      await loadExtensions();
      
      // Close drawer
      setDrawerOpen(false);
    } catch (error) {
      console.error('Failed to create extension:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create extension';
      
      // Handle specific error cases
      if (errorMessage.includes('409') || errorMessage.toLowerCase().includes('duplicate') || errorMessage.toLowerCase().includes('already exists')) {
        toast.error('Extension already exists');
      } else {
        toast.error(errorMessage);
      }
      throw error; // Re-throw to keep drawer open
    }
  };

  // Import handler
  const handleImportSubmit = async (file: File): Promise<ImportResult> => {
    try {
      const result = await extensionsService.importExtensions(file);
      
      // Reload data after import
      await loadExtensions();
      
      if (result.summary.imported > 0) {
        toast.success(`Successfully imported ${result.summary.imported} extension(s)`);
      }
      
      if (result.summary.failed > 0) {
        toast.warning(`${result.summary.failed} extension(s) failed to import`);
      }
      
      return result;
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Import failed');
      throw error;
    }
  };

  // Delete confirmation handler
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    
    try {
      const extensionNumbers = state.selectedRows.map(row => row.extension);
      await extensionsService.deleteExtensions(extensionNumbers);
      
      toast.success(
        extensionNumbers.length === 1 
          ? 'Extension deleted successfully' 
          : `${extensionNumbers.length} extensions deleted successfully`
      );
      
      // Reload data
      await loadExtensions();
      
      // Close dialog and reset selection
      setDeleteConfirmOpen(false);
      setState(prev => ({ ...prev, selectedRows: [] }));
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete extension(s)');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Memoized toolbar props
  const toolbarProps = useMemo(() => ({
    canEdit: state.selectedRows.length === 1,
    canDelete: state.selectedRows.length > 0,
    searchValue: state.query.q || '',
    onSearch: handleSearch,
    onAdd: handleAddExtension,
    onEdit: handleEditExtensions,
    onImport: handleImportExtensions,
    onExport: handleExportExtensions,
    onDelete: handleDeleteExtensions,
  }), [state.selectedRows.length, state.query.q]);

  // Memoized table props
  const tableProps = useMemo(() => ({
    data: state.data,
    loading: state.loading,
    sortBy: state.query.sortBy || 'extension',
    sortOrder: state.query.order || 'asc',
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
      <ExtensionsToolbar {...toolbarProps} />

      {/* Full Width Table */}
      <div className="flex-1 overflow-hidden">
        <ExtensionsTable {...tableProps} />
      </div>

      {/* Modals and Drawers */}
      <ExtensionDrawer
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
        extensions={state.selectedRows}
        loading={deleteLoading}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}