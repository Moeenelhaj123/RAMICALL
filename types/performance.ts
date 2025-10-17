export type ID = string

export type PerformanceQuery = {
  dateFrom: string
  dateTo: string
  agents?: ID[]
  groups?: ID[]
  queues?: ID[]
  tz?: string
  page?: number
  pageSize?: number
  sortBy?: keyof AgentPerformanceRow
  sortDir?: 'asc' | 'desc'
}

export type AgentRef = {
  id: ID
  name: string
  extension?: string
  avatarUrl?: string
  email?: string
}

export type AgentPerformanceRow = {
  agent: AgentRef
  extension?: string
  answeredCount: number
  busyCount: number
  hungupCount: number
  noAnswerCount: number
  missedCount: number
  avgRingSec: number
  outboundCount: number
  outboundAnsweredCount: number
  outboundClientsCount: number
  uniqueContactsCount: number
  outboundTalkingSec: number
  totalTalkingSec: number
  breaksCount: number
  breaksDurationSec: number
  dailyBuckets?: Array<{ date: string; calls: number; talkSec: number }>
}

// Alias for backward compatibility
export type AgentPerformanceData = AgentPerformanceRow

export type AggregateTotals = {
  agents: number
  answeredCount: number
  outboundCount: number
  totalTalkingSec: number
}
