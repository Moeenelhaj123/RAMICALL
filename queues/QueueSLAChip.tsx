import { Queue } from "@/types/queues";
import { Badge } from "@/components/ui/badge";

interface QueueSLAChipProps {
  queue: Queue;
}

export function QueueSLAChip({ queue }: QueueSLAChipProps) {
  if (!queue.sla) {
    return <span className="text-sm text-slate-500">No SLA</span>;
  }

  const currentPct = queue.metrics?.serviceLevelPct ?? 0;
  const targetPct = queue.sla.targetPct;
  const isMeeting = currentPct >= targetPct;

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isMeeting ? "default" : "destructive"}
        className="font-normal"
      >
        {currentPct.toFixed(1)}% / {targetPct}%
      </Badge>
      <span className="text-xs text-slate-500">
        {queue.sla.thresholdSec}s
      </span>
    </div>
  );
}
