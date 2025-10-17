import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Queue } from "@/types/queues";
import { QueueSLAChip } from "./QueueSLAChip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DotsThree, PencilSimple, Power } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

interface QueuesTableProps {
  queues: Queue[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  onEdit: (queue: Queue) => void;
  onToggleStatus: (queue: Queue) => void;
  visibleColumns?: string[];
}

export function QueuesTable({
  queues,
  sorting,
  onSortingChange,
  onEdit,
  onToggleStatus,
  visibleColumns = [],
}: QueuesTableProps) {
  const columns = useMemo<ColumnDef<Queue>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Queue",
        cell: ({ row }) => (
          <div className="min-w-[180px]">
            <div className="font-medium text-slate-900">{row.original.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={row.original.status === "active" ? "default" : "secondary"}
                className="text-xs font-normal"
              >
                {row.original.status}
              </Badge>
            </div>
          </div>
        ),
      },
      {
        id: "strategy",
        accessorKey: "strategy",
        header: "Strategy",
        cell: ({ row }) => (
          <span className="text-sm text-slate-700 whitespace-nowrap capitalize">
            {row.original.strategy.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <span className="text-sm text-slate-700 tabular-nums">
            {row.original.priority ?? "-"}
          </span>
        ),
      },
      {
        id: "members",
        accessorKey: "members",
        header: "Members",
        cell: ({ row }) => (
          <span className="text-sm text-slate-700 tabular-nums font-medium">
            {row.original.members.length}
          </span>
        ),
      },
      {
        id: "waiting",
        accessorKey: "metrics.waiting",
        header: "Waiting",
        cell: ({ row }) => (
          <div className="min-w-[120px]">
            <div className="text-sm text-slate-700 tabular-nums">
              {row.original.metrics?.waiting ?? 0}
            </div>
            {row.original.metrics?.longestWaitSec ? (
              <div className="text-xs text-slate-500">
                Longest: {Math.floor(row.original.metrics.longestWaitSec / 60)}m{" "}
                {row.original.metrics.longestWaitSec % 60}s
              </div>
            ) : null}
          </div>
        ),
      },
      {
        id: "agents",
        header: "Agents",
        cell: ({ row }) => (
          <div className="text-sm text-slate-700 tabular-nums">
            <span className="text-emerald-600 font-medium">
              {row.original.metrics?.agentsReady ?? 0}
            </span>
            {" / "}
            <span className="text-blue-600 font-medium">
              {row.original.metrics?.agentsOnCall ?? 0}
            </span>
          </div>
        ),
      },
      {
        id: "sla",
        header: "SLA",
        cell: ({ row }) => <QueueSLAChip queue={row.original} />,
      },
      {
        id: "asa",
        header: "ASA",
        cell: ({ row }) => (
          <span className="text-sm text-slate-700 tabular-nums whitespace-nowrap">
            {row.original.metrics?.asaSec ? `${row.original.metrics.asaSec}s` : "-"}
          </span>
        ),
      },
      {
        id: "abandon",
        header: "Abandon %",
        cell: ({ row }) => (
          <span className="text-sm text-slate-700 tabular-nums">
            {row.original.metrics?.abandonRatePct
              ? `${row.original.metrics.abandonRatePct.toFixed(1)}%`
              : "-"}
          </span>
        ),
      },
      {
        id: "recording",
        header: "Recording",
        cell: ({ row }) => (
          <Badge variant={row.original.recording ? "default" : "secondary"} className="text-xs">
            {row.original.recording ? "On" : "Off"}
          </Badge>
        ),
      },
      {
        id: "updated",
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => (
          <span className="text-sm text-slate-500 whitespace-nowrap">
            {formatDistanceToNow(new Date(row.original.updatedAt), { addSuffix: true })}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(row.original)}
              className="h-8 w-8 p-0"
            >
              <PencilSimple size={16} weight="bold" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <DotsThree size={16} weight="bold" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onToggleStatus(row.original)}>
                  <Power size={16} className="mr-2" />
                  {row.original.status === "active" ? "Disable" : "Enable"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [onEdit, onToggleStatus]
  );

  const visibleColumnsFiltered = useMemo(
    () =>
      visibleColumns.length > 0
        ? columns.filter((col) => visibleColumns.includes(col.id!))
        : columns,
    [columns, visibleColumns]
  );

  const table = useReactTable({
    data: queues,
    columns: visibleColumnsFiltered,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange,
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-white sticky top-0 z-10 border-b border-slate-200">
            <tr>
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider whitespace-nowrap"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumnsFiltered.length}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  No queues found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
