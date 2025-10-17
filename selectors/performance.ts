import type { AgentPerformanceRow, AggregateTotals } from '@/types/performance'

export function calculateAggregateTotals(
  rows: AgentPerformanceRow[]
): AggregateTotals & {
  outboundAnswered: number
  uniqueContacts: number
  avgRingSec: number
  breaksDurationSec: number
} {
  if (rows.length === 0) {
    return {
      agents: 0,
      answeredCount: 0,
      outboundCount: 0,
      totalTalkingSec: 0,
      outboundAnswered: 0,
      uniqueContacts: 0,
      avgRingSec: 0,
      breaksDurationSec: 0
    }
  }

  const totals = rows.reduce(
    (acc, row) => ({
      agents: acc.agents + 1,
      answeredCount: acc.answeredCount + row.answeredCount,
      outboundCount: acc.outboundCount + row.outboundCount,
      totalTalkingSec: acc.totalTalkingSec + row.totalTalkingSec,
      outboundAnswered: acc.outboundAnswered + row.outboundAnsweredCount,
      uniqueContacts: acc.uniqueContacts + row.uniqueContactsCount,
      avgRingSecSum: acc.avgRingSecSum + row.avgRingSec,
      breaksDurationSec: acc.breaksDurationSec + row.breaksDurationSec
    }),
    {
      agents: 0,
      answeredCount: 0,
      outboundCount: 0,
      totalTalkingSec: 0,
      outboundAnswered: 0,
      uniqueContacts: 0,
      avgRingSecSum: 0,
      breaksDurationSec: 0
    }
  )

  return {
    agents: totals.agents,
    answeredCount: totals.answeredCount,
    outboundCount: totals.outboundCount,
    totalTalkingSec: totals.totalTalkingSec,
    outboundAnswered: totals.outboundAnswered,
    uniqueContacts: totals.uniqueContacts,
    avgRingSec: totals.agents > 0 ? totals.avgRingSecSum / totals.agents : 0,
    breaksDurationSec: totals.breaksDurationSec
  }
}

export function filterPerformanceRows(
  rows: AgentPerformanceRow[],
  filters: {
    agents?: string[]
    groups?: string[]
    queues?: string[]
  }
): AgentPerformanceRow[] {
  let filtered = [...rows]

  if (filters.agents && filters.agents.length > 0) {
    filtered = filtered.filter((row) => filters.agents?.includes(row.agent.id))
  }

  return filtered
}
