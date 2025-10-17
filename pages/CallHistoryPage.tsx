import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CallFilters } from "@/components/call-history/CallFilters";
import { CallHistoryTable } from "@/components/call-history/CallHistoryTable";
import type { CallRecord, CallHistoryQuery } from "@/types/calls";
import { loadCallHistoryPreferences, saveCallHistoryPreferences } from "@/lib/callHistoryPreferences";
import { toast } from "sonner";
import { formatDateTime, formatDuration, formatPhone } from "@/lib/formatters";

type CallHistoryPageProps = {
  rows: CallRecord[];
  total: number;
  loading?: boolean;
  onQueryChange?: (query: CallHistoryQuery) => Promise<void>;
  agentsOptions?: Array<{ id: string; name: string }>;
  initialNumber?: string;
};

export function CallHistoryPage({
  rows,
  total,
  loading,
  onQueryChange,
  agentsOptions = [],
  initialNumber,
}: CallHistoryPageProps) {
  const [currentQuery, setCurrentQuery] = useState<CallHistoryQuery>({
    page: 0,
    pageSize: 25,
    sortBy: "startAt",
    sortDir: "desc",
  });

  useEffect(() => {
    async function initializeQuery() {
      const prefs = await loadCallHistoryPreferences();
      const initialQuery: CallHistoryQuery = {
        page: 0,
        pageSize: prefs?.pageSize || 25,
        sortBy: "startAt",
        sortDir: "desc",
        number: initialNumber,
      };
      
      setCurrentQuery(initialQuery);
      onQueryChange?.(initialQuery);
    }
    
    initializeQuery();
  }, [initialNumber]);

  useEffect(() => {
    saveCallHistoryPreferences({
      filters: {
        search: currentQuery.search,
        dateFrom: currentQuery.dateFrom,
        dateTo: currentQuery.dateTo,
        direction: currentQuery.direction,
        results: currentQuery.results,
        agentIds: currentQuery.agentIds,
        queueIds: currentQuery.queueIds,
      },
      pageSize: currentQuery.pageSize || 25,
      columnVisibility: {},
    });
  }, [currentQuery]);

  const handleFilterChange = useCallback(
    (filters: Partial<CallHistoryQuery>) => {
      const newQuery: CallHistoryQuery = { ...currentQuery, ...filters, page: 0 };
      setCurrentQuery(newQuery);
      onQueryChange?.(newQuery);
    },
    [currentQuery, onQueryChange]
  );

  const handleSortChange = useCallback(
    (sortBy: keyof CallRecord, sortDir: "asc" | "desc") => {
      const newQuery: CallHistoryQuery = { ...currentQuery, sortBy, sortDir };
      setCurrentQuery(newQuery);
      onQueryChange?.(newQuery);
    },
    [currentQuery, onQueryChange]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const newQuery: CallHistoryQuery = { ...currentQuery, page };
      setCurrentQuery(newQuery);
      onQueryChange?.(newQuery);
    },
    [currentQuery, onQueryChange]
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      const newQuery: CallHistoryQuery = { ...currentQuery, pageSize, page: 0 };
      setCurrentQuery(newQuery);
      onQueryChange?.(newQuery);
    },
    [currentQuery, onQueryChange]
  );

  const handleExportCSV = useCallback(() => {
    const headers = [
      "Direction",
      "Start Date",
      "End Date",
      "Caller Number",
      "Called Number",
      "Total Duration",
      "Result",
      "Agent",
      "Queue",
      "Hungup By",
      "Talk Time",
      "Answered At",
      "Ring Time",
      "On Hold Duration",
    ];

    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        [
          row.direction,
          formatDateTime(row.startAt),
          formatDateTime(row.endAt),
          formatPhone(row.callerNumber),
          formatPhone(row.calledNumber),
          formatDuration(row.totalDurationSec),
          row.result,
          row.agentName || "",
          row.queueName || "",
          row.hungupBy || "",
          formatDuration(row.talkTimeSec),
          formatDateTime(row.answeredAt),
          formatDuration(row.ringTimeSec),
          formatDuration(row.onHoldDurationSec),
        ]
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `call-history-${new Date().toISOString()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV exported successfully");
  }, [rows]);

  const handleRowClick = useCallback((record: CallRecord) => {
    toast.info("Call details feature coming soon");
    console.log("Call record clicked:", record);
  }, []);

  const [tableControls, setTableControls] = useState<any>(null);

  const handleTableReady = useCallback((controls: any) => {
    setTableControls(controls);
  }, []);

  const pageSize = currentQuery.pageSize || 25;
  const currentPage = currentQuery.page || 0;
  const totalPages = Math.ceil(total / pageSize);
  const startRow = currentPage * pageSize + 1;
  const endRow = Math.min((currentPage + 1) * pageSize, total);

  return (
    <div className="bg-white h-full flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0">
        <CallFilters
          onFilterChange={handleFilterChange}
          onExportCSV={handleExportCSV}
          agentsOptions={agentsOptions}
          loading={loading}
          currentNumber={currentQuery.number}
          tableControls={tableControls}
        />

        <div className="flex-1 min-h-0 overflow-hidden">
          <CallHistoryTable
            rows={rows}
            loading={loading}
            onRowClick={handleRowClick}
            onSortChange={handleSortChange}
            onTableReady={handleTableReady}
            currentPage={currentPage}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </div>
  );
}
