import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUp, ArrowDown, CircleNotch } from "@phosphor-icons/react";
import { Menu, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import { Button as MuiButton } from "@mui/material";
import { ViewColumnOutlined } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CallRecord, CallDirection, CallResult, HungupBy } from "@/types/calls";
import { formatDateTime, formatDuration, formatPhone } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type CallHistoryTableProps = {
  rows: CallRecord[];
  loading?: boolean;
  onRowClick?: (record: CallRecord) => void;
  onSortChange?: (sortBy: keyof CallRecord, sortDir: "asc" | "desc") => void;
  onTableReady?: (tableInstance: any) => void;
  // Pagination props
  currentPage?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

function DirectionPill({ direction }: { direction: CallDirection }) {
  const isInbound = direction === "inbound";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
        isInbound
          ? "bg-green-100 text-green-700"
          : "bg-blue-100 text-blue-700"
      )}
    >
      {isInbound ? <ArrowDown size={10} weight="bold" aria-hidden="true" /> : <ArrowUp size={10} weight="bold" aria-hidden="true" />}
      {isInbound ? "In" : "Out"}
    </span>
  );
}

function ResultPill({ result }: { result: CallResult }) {
  const styles: Record<CallResult, string> = {
    answered: "bg-emerald-100 text-emerald-700",
    busy: "bg-amber-100 text-amber-700",
    no_answer: "bg-slate-200 text-slate-700",
    hungup: "bg-rose-100 text-rose-700",
  };

  const labels: Record<CallResult, string> = {
    answered: "OK",
    busy: "Busy",
    no_answer: "N/A",
    hungup: "Hung",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
        styles[result]
      )}
    >
      {labels[result]}
    </span>
  );
}

function HungupByBadge({ hungupBy }: { hungupBy?: HungupBy }) {
  if (!hungupBy) return <span className="text-slate-400">—</span>;
  
  const labels: Record<HungupBy, string> = {
    agent: "Agent",
    client: "Client",
    system: "System",
    unknown: "Unknown",
  };

  return <span className="text-slate-700">{labels[hungupBy]}</span>;
}

export function CallHistoryTable({
  rows,
  loading,
  onRowClick,
  onSortChange,
  onTableReady,
  currentPage = 0,
  pageSize = 25,
  total = 0,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
}: CallHistoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "startAt", desc: true }]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const raw = localStorage.getItem("callHistory.columns.v1");
    return raw ? JSON.parse(raw) : {};
  });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Table styling constants
  const ellipsis = "truncate whitespace-nowrap max-w-[1px]";
  const cellBase = "px-1 py-0.5 align-middle text-slate-700";

  const columns = useMemo<ColumnDef<CallRecord>[]>(
    () => [
      {
        id: "direction",
        accessorKey: "direction",
        header: "DIRECTION",
        size: 120,
        minSize: 110,
        cell: ({ row }) => {
          const value = row.original.direction;
          return (
            <div className={`${cellBase}`} title={value}>
              <DirectionPill direction={value} />
            </div>
          );
        },
        enableHiding: true,
      },
      {
        id: "startAt",
        accessorKey: "startAt",
        header: "START DATE",
        size: 180,
        minSize: 160,
        cell: ({ row }) => {
          const value = formatDateTime(row.original.startAt);
          return (
            <span className={`${cellBase} ${ellipsis} tabular-nums`} title={value}>
              {value}
            </span>
          );
        },
        enableHiding: true,
      },
      {
        id: "endAt",
        accessorKey: "endAt",
        header: "END DATE",
        size: 180,
        minSize: 160,
        cell: ({ row }) => {
          const value = formatDateTime(row.original.endAt);
          return (
            <span className={`${cellBase} ${ellipsis} tabular-nums`} title={value}>
              {value}
            </span>
          );
        },
        enableHiding: true,
      },
      {
        id: "callerNumber",
        accessorKey: "callerNumber",
        header: "CALLER NUMBER",
        size: 180,
        minSize: 160,
        cell: ({ row }) => {
          const value = formatPhone(row.original.callerNumber);
          return (
            <span className={`${cellBase} ${ellipsis} tabular-nums`} title={value}>
              {value}
            </span>
          );
        },
        enableHiding: true,
      },
      {
        id: "calledNumber",
        accessorKey: "calledNumber",
        header: "CALLED NUMBER",
        size: 200,
        minSize: 180,
        cell: ({ row }) => {
          const value = formatPhone(row.original.calledNumber);
          return (
            <span className={`${cellBase} ${ellipsis} tabular-nums`} title={value}>
              {value}
            </span>
          );
        },
        enableHiding: true,
      },
      {
        id: "totalDurationSec",
        accessorKey: "totalDurationSec",
        header: "TOTAL DURATION",
        size: 140,
        minSize: 120,
        cell: ({ row }) => {
          const value = formatDuration(row.original.totalDurationSec);
          return (
            <span className={`${cellBase} ${ellipsis} tabular-nums`} title={value}>
              {value}
            </span>
          );
        },
        enableHiding: true,
      },
      {
        id: "result",
        accessorKey: "result",
        header: "RESULT",
        size: 120,
        minSize: 100,
        cell: ({ row }) => {
          const value = row.original.result;
          return (
            <div className={`${cellBase}`} title={value}>
              <ResultPill result={value} />
            </div>
          );
        },
        enableHiding: true,
      },
      {
        id: "agentName",
        accessorKey: "agentName",
        header: "AGENT",
        size: 150,
        minSize: 120,
        cell: ({ row }) => {
          const value = row.original.agentName || "—";
          return (
            <span className={`${cellBase} ${ellipsis}`} title={value}>
              {value}
            </span>
          );
        },
        enableHiding: true,
      },
      {
        id: "queueName",
        accessorKey: "queueName",
        header: "QUEUE",
        size: 150,
        minSize: 120,
        cell: ({ row }) => {
          const value = row.original.queueName || "—";
          return (
            <span className={`${cellBase} ${ellipsis}`} title={value}>
              {value}
            </span>
          );
        },
        enableHiding: true,
      },
      {
        id: "hungupBy",
        accessorKey: "hungupBy",
        header: "HUNGUP BY",
        size: 120,
        minSize: 100,
        cell: ({ row }) => {
          const value = row.original.hungupBy || "Unknown";
          return (
            <div className={`${cellBase}`} title={value}>
              <HungupByBadge hungupBy={row.original.hungupBy} />
            </div>
          );
        },
        enableHiding: true,
      },
      {
        id: "talkTimeSec",
        accessorKey: "talkTimeSec",
        header: "TALK TIME",
        size: 120,
        minSize: 100,
        cell: ({ row }) => {
          const value = formatDuration(row.original.talkTimeSec);
          return (
            <span className={`${cellBase} ${ellipsis} tabular-nums`} title={value}>
              {value}
            </span>
          );
        },
        enableHiding: true,
      },
      {
        id: "answeredAt",
        accessorKey: "answeredAt",
        header: "ANSWERED AT",
        size: 180,
        minSize: 160,
        cell: ({ row }) => {
          const value = formatDateTime(row.original.answeredAt);
          return (
            <span className={`${cellBase} ${ellipsis} tabular-nums`} title={value}>
              {value}
            </span>
          );
        },
        enableHiding: true,
      },
      {
        id: "ringTimeSec",
        accessorKey: "ringTimeSec",
        header: "RING TIME",
        size: 120,
        minSize: 100,
        cell: ({ row }) => {
          const value = formatDuration(row.original.ringTimeSec);
          return (
            <span className={`${cellBase} ${ellipsis} tabular-nums`} title={value}>
              {value}
            </span>
          );
        },
        enableHiding: true,
      },
      {
        id: "onHoldDurationSec",
        accessorKey: "onHoldDurationSec",
        header: "ON HOLD DURATION",
        size: 160,
        minSize: 140,
        cell: ({ row }) => {
          const value = formatDuration(row.original.onHoldDurationSec);
          return (
            <span className={`${cellBase} ${ellipsis} tabular-nums`} title={value}>
              {value}
            </span>
          );
        },
        enableHiding: true,
      },
    ],
    []
  );

  useEffect(() => {
    localStorage.setItem("callHistory.columns.v1", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const table = useReactTable({
    data: rows,
    columns,
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    defaultColumn: { size: 160, minSize: 120, maxSize: 500 },
    state: { 
      sorting,
      columnVisibility,
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      if (onSortChange && newSorting.length > 0) {
        const sort = newSorting[0];
        onSortChange(sort.id as keyof CallRecord, sort.desc ? "desc" : "asc");
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  useEffect(() => {
    if (onTableReady && table) {
      onTableReady({
        table,
        columnVisibility,
        setColumnVisibility,
        anchorEl,
        setAnchorEl,
        handleColumnsMenuOpen,
        handleColumnsMenuClose,
      });
    }
  }, [table, columnVisibility, anchorEl, onTableReady]);

  const handleColumnsMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColumnsMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
        <CircleNotch size={32} className="animate-spin text-accent" aria-label="Loading" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
        <p className="text-slate-600 text-sm font-medium">No call records found</p>
      </div>
    );
  }

  const startRow = currentPage * pageSize + 1;
  const endRow = Math.min((currentPage + 1) * pageSize, total);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Table Container - Full Height with Contained Scroll */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full w-full border border-slate-200 rounded-lg flex flex-col">
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="min-w-[1200px] w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-white border-b-2 border-slate-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        style={{ width: header.getSize() }}
                        className="px-2 py-1.5 text-left text-xs font-bold text-slate-700 uppercase tracking-tight whitespace-nowrap border-r border-slate-200 last:border-r-0 bg-slate-50"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              "flex items-center gap-2 select-none",
                              header.column.getCanSort() && "cursor-pointer hover:text-blue-600 transition-colors"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() && (
                              <span className="text-blue-600">
                                {header.column.getIsSorted() === "desc" ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {table.getRowModel().rows.map((row, index) => {
                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-blue-50",
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="px-2 py-1 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 last:border-r-0"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Integrated Pagination - Sticky Bottom */}
      {rows.length > 0 && (
        <div className="shrink-0 bg-white border-t border-slate-200 px-4 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-700 font-medium">Rows:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(val) => onPageSizeChange?.(Number(val))}
                disabled={loading}
              >
                <SelectTrigger className="w-16 h-7 bg-white border-slate-300 text-slate-700 text-xs focus:ring-blue-500 focus:ring-1 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
              <span>
                {startRow}–{endRow} of {total}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 0 || loading}
                className="h-7 px-2 text-xs border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50"
                aria-label="Previous page"
              >
                Prev
              </Button>
              <span className="text-xs text-slate-700 font-medium min-w-[60px] text-center">
                {currentPage + 1}/{totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || loading}
                className="h-7 px-2 text-xs border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50"
                aria-label="Next page"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
