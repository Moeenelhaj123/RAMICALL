import type { AgentPerformanceRow } from '@/types/performance';
import type { DonutMetric } from './constants';

export function getTopAgentsForMetric(
  rows: AgentPerformanceRow[],
  metric: DonutMetric,
  top = 5
) {
  const access = {
    talking: (r: AgentPerformanceRow) => r.totalTalkingSec,
    outbounds: (r: AgentPerformanceRow) => r.outboundCount,
    unique: (r: AgentPerformanceRow) => r.uniqueContactsCount,
  }[metric];

  return [...rows]
    .sort((a, b) => access(b) - access(a))
    .slice(0, top)
    .map((r) => ({
      id: r.agent.id,
      name: r.agent.name,
      value: access(r),
    }));
}