import { Queue } from "@/types/queues";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilSimple, Users, Phone, Clock, ChartLine } from "@phosphor-icons/react";
import { QueueSLAChip } from "./QueueSLAChip";

interface QueueCardProps {
  queue: Queue;
  onEdit: (queue: Queue) => void;
}

export function QueueCard({ queue, onEdit }: QueueCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900 truncate mb-2">
              {queue.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={queue.status === "active" ? "default" : "secondary"}
                className="text-xs"
              >
                {queue.status}
              </Badge>
              <span className="text-xs text-slate-500 capitalize">
                {queue.strategy.replace(/_/g, " ")}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(queue)}
            className="shrink-0 h-8 w-8 p-0"
          >
            <PencilSimple size={16} weight="bold" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-slate-400" />
            <div>
              <div className="text-xs text-slate-500">Members</div>
              <div className="text-sm font-semibold text-slate-900 tabular-nums">
                {queue.members.length}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} className="text-slate-400" />
            <div>
              <div className="text-xs text-slate-500">Waiting</div>
              <div className="text-sm font-semibold text-slate-900 tabular-nums">
                {queue.metrics?.waiting ?? 0}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            <div>
              <div className="text-xs text-slate-500">Longest Wait</div>
              <div className="text-sm font-semibold text-slate-900 tabular-nums">
                {queue.metrics?.longestWaitSec
                  ? `${Math.floor(queue.metrics.longestWaitSec / 60)}m ${
                      queue.metrics.longestWaitSec % 60
                    }s`
                  : "-"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ChartLine size={16} className="text-slate-400" />
            <div>
              <div className="text-xs text-slate-500">Agents</div>
              <div className="text-sm font-semibold text-slate-900 tabular-nums">
                <span className="text-emerald-600">{queue.metrics?.agentsReady ?? 0}</span>
                {" / "}
                <span className="text-blue-600">{queue.metrics?.agentsOnCall ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">SLA</span>
            <QueueSLAChip queue={queue} />
          </div>
        </div>
      </div>
    </div>
  );
}
