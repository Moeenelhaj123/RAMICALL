import React from 'react';
import { TableProps, TableColumn, TableSort } from './types';

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination,
  sort,
  onSortChange,
  rowKey = 'id',
  stickyHeader = true,
  stickyHeaderTop = '0px',
  maxHeight,
  className = '',
  emptyText = 'No data available',
  onRowClick
}: TableProps<T>) => {
  // Get row key function
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey] || index);
  };

  // Handle sort click
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable || !onSortChange) return;

    const newDirection = 
      sort?.key === column.key && sort.direction === 'asc' ? 'desc' : 'asc';
    
    onSortChange({
      key: column.key,
      direction: newDirection
    });
  };

  // Get sort icon
  const getSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;

    const isActive = sort?.key === column.key;
    const direction = sort?.direction;

    return (
      <span className="inline-flex flex-col ml-1">
        <svg 
          className={`w-3 h-3 ${
            isActive && direction === 'asc' ? 'text-blue-600' : 'text-slate-400'
          }`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
        <svg 
          className={`w-3 h-3 -mt-1 ${
            isActive && direction === 'desc' ? 'text-blue-600' : 'text-slate-400'
          }`}
          fill="currentColor" 
          viewBox="0 0 20 20"
          style={{ transform: 'rotate(180deg)' }}
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </span>
    );
  };

  // Render cell content
  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    if (column.render) {
      return column.render(
        column.dataIndex ? record[column.dataIndex] : record,
        record,
        index
      );
    }
    
    if (column.dataIndex) {
      const value = record[column.dataIndex];
      return value !== null && value !== undefined ? String(value) : '';
    }
    
    return '';
  };

  const tableClasses = [
    'w-full min-w-[1800px] border-separate border-spacing-0 table-fixed',
    className
  ].join(' ');

  const containerClasses = [
    'w-full overflow-x-auto overflow-y-auto',
    'border border-slate-200 bg-white'
  ].join(' ');

  return (
    <div className={containerClasses} style={{ maxHeight }}>
      <table className={tableClasses}>
        <thead 
          className={stickyHeader ? 'sticky z-20 bg-slate-50 border-b-2 border-slate-300' : 'bg-slate-50 border-b-2 border-slate-300'}
          style={stickyHeader ? { top: stickyHeaderTop } : undefined}
        >
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={[
                  'px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-50 border-r border-slate-200 last:border-r-0',
                  'whitespace-nowrap overflow-hidden text-ellipsis',
                  column.sortable ? 'cursor-pointer hover:bg-slate-100' : '',
                  column.headerClassName || ''
                ].join(' ')}
                style={{ width: column.width }}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center min-h-[20px]">
                  {column.title}
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center">
                <div className="flex items-center justify-center">
                  <svg 
                    className="animate-spin h-5 w-5 text-slate-400 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr
                key={getRowKey(record, index)}
                className={[
                  'hover:bg-slate-50',
                  onRowClick ? 'cursor-pointer' : ''
                ].join(' ')}
                onClick={() => onRowClick?.(record, index)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={[
                      'px-4 py-3 text-sm text-slate-900 align-middle whitespace-nowrap overflow-hidden text-ellipsis border-r border-slate-200 last:border-r-0',
                      column.className || ''
                    ].join(' ')}
                    style={{ width: column.width }}
                  >
                    {renderCell(column, record, index)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.displayName = 'Table';