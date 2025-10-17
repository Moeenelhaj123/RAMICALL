import { useEffect } from "react";
import { Queue } from "@/types/queues";

export function useQueueRealtime(
  queues: Queue[],
  onMetricsUpdate: (queueId: string, metrics: Queue["metrics"]) => void
) {
  useEffect(() => {
    const interval = setInterval(() => {
      queues.forEach((queue) => {
        if (queue.status === "active") {
          const randomVariation = (base: number, variance: number) =>
            Math.max(0, base + Math.floor(Math.random() * variance * 2 - variance));

          const updatedMetrics: Queue["metrics"] = {
            waiting: randomVariation(queue.metrics?.waiting ?? 0, 2),
            longestWaitSec: randomVariation(queue.metrics?.longestWaitSec ?? 0, 30),
            agentsReady: randomVariation(queue.metrics?.agentsReady ?? 1, 1),
            agentsOnCall: randomVariation(queue.metrics?.agentsOnCall ?? 0, 1),
            serviceLevelPct: Math.min(
              100,
              Math.max(0, (queue.metrics?.serviceLevelPct ?? 80) + (Math.random() - 0.5) * 5)
            ),
            asaSec: randomVariation(queue.metrics?.asaSec ?? 20, 5),
            abandonRatePct: Math.min(
              100,
              Math.max(0, (queue.metrics?.abandonRatePct ?? 5) + (Math.random() - 0.5) * 2)
            ),
            answeredToday: (queue.metrics?.answeredToday ?? 0) + Math.floor(Math.random() * 2),
            inboundToday: (queue.metrics?.inboundToday ?? 0) + Math.floor(Math.random() * 2),
          };

          onMetricsUpdate(queue.id, updatedMetrics);
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [queues, onMetricsUpdate]);
}
