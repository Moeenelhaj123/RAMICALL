import React from 'react';

export interface TableColumn<T = any> {
  key: string;
  title: string | React.ReactNode;
  dataIndex?: keyof T;
  width?: number | string;
  fixed?: 'left' | 'right';
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: TablePagination;
  sort?: TableSort;
  onSortChange?: (sort: TableSort) => void;
  rowKey?: keyof T | ((record: T) => string);
  stickyHeader?: boolean;
  stickyHeaderTop?: string;
  maxHeight?: string;
  className?: string;
  emptyText?: string;
  onRowClick?: (record: T, index: number) => void;
}