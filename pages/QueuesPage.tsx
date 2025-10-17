import { useState, useMemo, useCallback, useEffect } from "react";
import { Queue, QueueStatus, QueueStrategy } from "@/types/queues";
import { UserAccount } from "@/types/users";
import { QueuesTable } from "@/components/queues/QueuesTable";
import { QueueCard } from "@/components/queues/QueueCard";
import { QueueDrawer } from "@/components/queues/QueueDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MagnifyingGlass, Plus, SquaresFour, Table, Funnel, Columns } from "@phosphor-icons/react";
import { filterQueues, sortQueues } from "@/selectors/queues";
import { useQueueRealtime } from "@/hooks/useQueueRealtime";
import { SortingState } from "@tanstack/react-table";
import { toast } from "sonner";

interface QueuesPageProps {
  users: UserAccount[];
}

type ViewMode = "table" | "cards";
type TabValue = "all" | "active" | "disabled";

const STORAGE_PREFS_KEY = "queues.prefs.v1";
const STORAGE_COLUMNS_KEY = "queues.columns.v1";

const ALL_COLUMNS = [
  "name",
  "strategy",
  "priority",
  "members",
  "waiting",
  "agents",
  "sla",
  "asa",
  "abandon",
  "recording",
  "updated",
  "actions",
];

function generateMockQueues(): Queue[] {
  return [
    {
      id: "1",
      name: "Sales Support",
      status: "active",
      strategy: "round_robin",
      priority: 10,
      recording: true,
      callbackEnabled: true,
      members: [
        { userId: "1", penalty: 0, wrapUpSec: 30, loginMode: "dynamic", skills: ["sales"] },
        { userId: "2", penalty: 0, wrapUpSec: 30, loginMode: "dynamic", skills: ["sales"] },
      ],
      sla: { thresholdSec: 20, targetPct: 80 },
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      metrics: {
        waiting: 3,
        longestWaitSec: 145,
        agentsReady: 2,
        agentsOnCall: 1,
        serviceLevelPct: 85.2,
        asaSec: 18,
        abandonRatePct: 4.2,
        answeredToday: 124,
        inboundToday: 129,
      },
    },
    {
      id: "2",
      name: "Technical Support",
      status: "active",
      strategy: "least_recent",
      priority: 5,
      recording: true,
      callbackEnabled: false,
      members: [
        { userId: "3", penalty: 0, wrapUpSec: 60, loginMode: "dynamic", skills: ["technical", "tier1"] },
        { userId: "4", penalty: 0, wrapUpSec: 60, loginMode: "dynamic", skills: ["technical", "tier2"] },
        { userId: "5", penalty: 1, wrapUpSec: 60, loginMode: "static", skills: ["technical", "tier3"] },
      ],
      sla: { thresholdSec: 30, targetPct: 75 },
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      metrics: {
        waiting: 7,
        longestWaitSec: 320,
        agentsReady: 1,
        agentsOnCall: 2,
        serviceLevelPct: 68.5,
        asaSec: 42,
        abandonRatePct: 8.1,
        answeredToday: 87,
        inboundToday: 95,
      },
    },
    {
      id: "3",
      name: "Customer Service",
      status: "active",
      strategy: "ring_all",
      priority: 8,
      recording: false,
      callbackEnabled: true,
      members: [
        { userId: "1", penalty: 0, wrapUpSec: 20, loginMode: "dynamic" },
        { userId: "2", penalty: 0, wrapUpSec: 20, loginMode: "dynamic" },
        { userId: "3", penalty: 0, wrapUpSec: 20, loginMode: "dynamic" },
        { userId: "6", penalty: 0, wrapUpSec: 20, loginMode: "dynamic" },
      ],
      sla: { thresholdSec: 15, targetPct: 90 },
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      metrics: {
        waiting: 1,
        longestWaitSec: 45,
        agentsReady: 3,
        agentsOnCall: 1,
        serviceLevelPct: 92.3,
        asaSec: 12,
        abandonRatePct: 2.1,
        answeredToday: 203,
        inboundToday: 207,
      },
    },
    {
      id: "4",
      name: "VIP Support",
      status: "disabled",
      strategy: "linear",
      priority: 15,
      recording: true,
      callbackEnabled: true,
      members: [
        { userId: "5", penalty: 0, wrapUpSec: 45, loginMode: "static", skills: ["vip", "premium"] },
      ],
      sla: { thresholdSec: 10, targetPct: 95 },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      metrics: {
        waiting: 0,
        longestWaitSec: 0,
        agentsReady: 0,
        agentsOnCall: 0,
        serviceLevelPct: 0,
        asaSec: 0,
        abandonRatePct: 0,
        answeredToday: 0,
        inboundToday: 0,
      },
    },
  ];
}

export function QueuesPage({ users }: QueuesPageProps) {
  const [queues, setQueues] = useState<Queue[]>(() => generateMockQueues());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");
  const [strategyFilter, setStrategyFilter] = useState<QueueStrategy[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedQueue, setSelectedQueue] = useState<Queue | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(ALL_COLUMNS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFS_KEY);
      if (saved) {
        const prefs = JSON.parse(saved);
        if (prefs.viewMode) setViewMode(prefs.viewMode);
        if (prefs.statusFilter) setStatusFilter(prefs.statusFilter);
        if (prefs.strategyFilter) setStrategyFilter(prefs.strategyFilter);
      }

      const savedColumns = localStorage.getItem(STORAGE_COLUMNS_KEY);
      if (savedColumns) {
        setVisibleColumns(JSON.parse(savedColumns));
      }
    } catch (e) {
      console.error("Failed to load preferences", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_PREFS_KEY,
        JSON.stringify({ viewMode, statusFilter, strategyFilter })
      );
    } catch (e) {
      console.error("Failed to save preferences", e);
    }
  }, [viewMode, statusFilter, strategyFilter]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COLUMNS_KEY, JSON.stringify(visibleColumns));
    } catch (e) {
      console.error("Failed to save column preferences", e);
    }
  }, [visibleColumns]);

  const filteredQueues = useMemo(() => {
    let filtered = filterQueues(
      queues,
      search,
      activeTab === "all" ? statusFilter : activeTab,
      strategyFilter.length > 0 ? strategyFilter : undefined
    );

    if (sorting.length > 0) {
      const sortBy = sorting[0].id;
      const sortDir = sorting[0].desc ? "desc" : "asc";
      filtered = sortQueues(filtered, sortBy, sortDir);
    }

    return filtered;
  }, [queues, search, statusFilter, strategyFilter, activeTab, sorting]);

  const handleSaveQueue = useCallback(
    async (queueData: any) => {
      try {
        if (queueData.id) {
          setQueues((prev) =>
            prev.map((q) =>
              q.id === queueData.id ? { ...q, ...queueData, updatedAt: new Date().toISOString() } : q
            )
          );
          toast.success("Queue updated successfully");
        } else {
          const newQueue: Queue = {
            ...queueData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metrics: {
              waiting: 0,
              longestWaitSec: 0,
              agentsReady: 0,
              agentsOnCall: 0,
              serviceLevelPct: 0,
              asaSec: 0,
              abandonRatePct: 0,
              answeredToday: 0,
              inboundToday: 0,
            },
          };
          setQueues((prev) => [...prev, newQueue]);
          toast.success("Queue created successfully");
        }
      } catch (error) {
        toast.error("Failed to save queue");
        throw error;
      }
    },
    []
  );

  const handleEditQueue = (queue: Queue) => {
    setSelectedQueue(queue);
    setDrawerOpen(true);
  };

  const handleAddQueue = () => {
    setSelectedQueue(undefined);
    setDrawerOpen(true);
  };

  const handleToggleStatus = useCallback((queue: Queue) => {
    const newStatus: QueueStatus = queue.status === "active" ? "disabled" : "active";
    setQueues((prev) =>
      prev.map((q) =>
        q.id === queue.id
          ? { ...q, status: newStatus, updatedAt: new Date().toISOString() }
          : q
      )
    );
    toast.success(`Queue ${newStatus === "active" ? "enabled" : "disabled"}`);
  }, []);

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedQueue(undefined);
  };

  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]
    );
  };

  const handleMetricsUpdate = useCallback((queueId: string, metrics: Queue["metrics"]) => {
    setQueues((prev) =>
      prev.map((q) => (q.id === queueId ? { ...q, metrics } : q))
    );
  }, []);

  useQueueRealtime(queues, handleMetricsUpdate);

  return (
    <div className="bg-white p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Queues</h1>
          <Button onClick={handleAddQueue} className="gap-2">
            <Plus size={18} weight="bold" />
            Add Queue
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                placeholder="Search queues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Funnel size={16} weight="bold" />
                    Strategy
                    {strategyFilter.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                        {strategyFilter.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by Strategy</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={strategyFilter.includes("round_robin")}
                    onCheckedChange={() =>
                      setStrategyFilter((prev) =>
                        prev.includes("round_robin")
                          ? prev.filter((s) => s !== "round_robin")
                          : [...prev, "round_robin"]
                      )
                    }
                  >
                    Round Robin
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={strategyFilter.includes("least_recent")}
                    onCheckedChange={() =>
                      setStrategyFilter((prev) =>
                        prev.includes("least_recent")
                          ? prev.filter((s) => s !== "least_recent")
                          : [...prev, "least_recent"]
                      )
                    }
                  >
                    Least Recent
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={strategyFilter.includes("ring_all")}
                    onCheckedChange={() =>
                      setStrategyFilter((prev) =>
                        prev.includes("ring_all")
                          ? prev.filter((s) => s !== "ring_all")
                          : [...prev, "ring_all"]
                      )
                    }
                  >
                    Ring All
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={strategyFilter.includes("fewest_calls")}
                    onCheckedChange={() =>
                      setStrategyFilter((prev) =>
                        prev.includes("fewest_calls")
                          ? prev.filter((s) => s !== "fewest_calls")
                          : [...prev, "fewest_calls"]
                      )
                    }
                  >
                    Fewest Calls
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={strategyFilter.includes("skills")}
                    onCheckedChange={() =>
                      setStrategyFilter((prev) =>
                        prev.includes("skills")
                          ? prev.filter((s) => s !== "skills")
                          : [...prev, "skills"]
                      )
                    }
                  >
                    Skills-Based
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {viewMode === "table" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Columns size={16} weight="bold" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {ALL_COLUMNS.filter((c) => c !== "name" && c !== "actions").map((col) => (
                      <DropdownMenuCheckboxItem
                        key={col}
                        checked={visibleColumns.includes(col)}
                        onCheckedChange={() => toggleColumnVisibility(col)}
                      >
                        {col.charAt(0).toUpperCase() + col.slice(1)}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <div className="flex items-center border border-slate-200 rounded-lg p-1">
                <Button
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-8 w-8 p-0"
                >
                  <Table size={16} weight="bold" />
                </Button>
                <Button
                  variant={viewMode === "cards" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="h-8 w-8 p-0"
                >
                  <SquaresFour size={16} weight="bold" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="mt-4">
            <TabsList>
              <TabsTrigger value="all">All ({queues.length})</TabsTrigger>
              <TabsTrigger value="active">
                Active ({queues.filter((q) => q.status === "active").length})
              </TabsTrigger>
              <TabsTrigger value="disabled">
                Disabled ({queues.filter((q) => q.status === "disabled").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredQueues.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12">
            <div className="text-center">
              <p className="text-slate-500 mb-4">No queues found</p>
              <Button onClick={handleAddQueue} variant="outline" className="gap-2">
                <Plus size={18} weight="bold" />
                Create your first queue
              </Button>
            </div>
          </div>
        ) : viewMode === "table" ? (
          <QueuesTable
            queues={filteredQueues}
            sorting={sorting}
            onSortingChange={setSorting}
            onEdit={handleEditQueue}
            onToggleStatus={handleToggleStatus}
            visibleColumns={visibleColumns}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredQueues.map((queue) => (
              <QueueCard key={queue.id} queue={queue} onEdit={handleEditQueue} />
            ))}
          </div>
        )}
      </div>

      <QueueDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        queue={selectedQueue}
        users={users}
        onSave={handleSaveQueue}
      />
    </div>
  );
}
