import React from 'react';
import { Button } from './Button';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean | ((total: number, range: [number, number]) => React.ReactNode);
  pageSizeOptions?: number[];
  className?: string;
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ 
    page, 
    pageSize, 
    total, 
    onPageChange, 
    onPageSizeChange,
    showSizeChanger = true,
    showQuickJumper = false,
    showTotal = true,
    pageSizeOptions = [10, 20, 50, 100],
    className = ''
  }, ref) => {
    const totalPages = Math.ceil(total / pageSize);
    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    // Generate page numbers to show
    const getPageNumbers = (): (number | string)[] => {
      const delta = 2;
      const range: number[] = [];
      const rangeWithDots: (number | string)[] = [];

      for (
        let i = Math.max(2, page - delta);
        i <= Math.min(totalPages - 1, page + delta);
        i++
      ) {
        range.push(i);
      }

      if (page - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (page + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    const pageNumbers = getPageNumbers();

    // Render total info
    const renderTotal = () => {
      if (!showTotal) return null;
      
      if (typeof showTotal === 'function') {
        return showTotal(total, [startItem, endItem]);
      }
      
      return (
        <span className="text-sm text-slate-600">
          Showing {startItem} to {endItem} of {total} entries
        </span>
      );
    };

    if (total === 0) return null;

    return (
      <div ref={ref} className={`flex items-center justify-between gap-4 ${className}`}>
        {/* Total info */}
        <div className="flex items-center gap-4">
          {renderTotal()}
          
          {/* Page size selector */}
          {showSizeChanger && onPageSizeChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Show</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-slate-600">per page</span>
            </div>
          )}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>

          {/* Page numbers */}
          {pageNumbers.map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === '...' ? (
                <span className="px-3 py-1 text-slate-500">...</span>
              ) : (
                <Button
                  variant={pageNum === page ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum as number)}
                  className="px-3 min-w-[40px]"
                >
                  {pageNum}
                </Button>
              )}
            </React.Fragment>
          ))}

          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>

          {/* Quick jumper */}
          {showQuickJumper && (
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-slate-600">Go to</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = parseInt((e.target as HTMLInputElement).value);
                    if (value >= 1 && value <= totalPages) {
                      onPageChange(value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';