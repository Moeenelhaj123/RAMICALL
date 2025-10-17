import { PerformanceQuery, AgentPerformanceRow, AggregateTotals } from '@/types/performance'

export async function fetchAgentPerformance(q: PerformanceQuery): Promise<{
  rows: AgentPerformanceRow[]
  totals?: AggregateTotals
  total: number
}> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    rows: [],
    totals: {
      agents: 0,
      answeredCount: 0,
      outboundCount: 0,
      totalTalkingSec: 0
    },
    total: 0
  }
}

export async function exportAgentPerformanceCSV(q: PerformanceQuery): Promise<Blob> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return new Blob([''], { type: 'text/csv' })
}
