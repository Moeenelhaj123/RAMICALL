import type { AgentPerformanceRow, AgentRef } from '@/types/performance'
import type { UserAccount } from '@/types/users'

export function generateMockPerformanceData(
  users: UserAccount[],
  dateFrom: Date,
  dateTo: Date
): AgentPerformanceRow[] {
  return users.map((user, idx) => {
    const agentRef: AgentRef = {
      id: user.id,
      name: user.name,
      extension: `100${idx + 1}`,
      avatarUrl: user.avatarUrl
    }

    const answeredCount = Math.floor(Math.random() * 150) + 50
    const outboundCount = Math.floor(Math.random() * 100) + 30
    const outboundAnsweredCount = Math.floor(outboundCount * (0.6 + Math.random() * 0.3))
    
    const breaksCount = Math.floor(Math.random() * 8) + 2
    const breaksDurationSec = breaksCount * (Math.random() * 900 + 300)
    
    const outboundTalkingSec = outboundAnsweredCount * (Math.random() * 300 + 120)
    const inboundTalkingSec = answeredCount * (Math.random() * 400 + 180)
    const ringSecTotal = answeredCount * (Math.random() * 30 + 10)
    
    const dailyBuckets: Array<{ date: string; calls: number; talkSec: number }> = []
    const dayCount = Math.floor((dateTo.getTime() - dateFrom.getTime()) / (24 * 60 * 60 * 1000)) + 1
    
    for (let i = 0; i < Math.min(dayCount, 30); i++) {
      const date = new Date(dateFrom)
      date.setDate(date.getDate() + i)
      dailyBuckets.push({
        date: date.toISOString().split('T')[0],
        calls: Math.floor(Math.random() * 30) + 10,
        talkSec: Math.floor(Math.random() * 3600) + 600
      })
    }

    return {
      agent: agentRef,
      extension: agentRef.extension,
      answeredCount,
      busyCount: Math.floor(Math.random() * 15),
      hungupCount: Math.floor(Math.random() * 25),
      noAnswerCount: Math.floor(Math.random() * 20),
      missedCount: Math.floor(Math.random() * 30),
      avgRingSec: Math.random() * 20 + 5,
      outboundCount,
      outboundAnsweredCount,
      outboundClientsCount: Math.floor(outboundCount * 0.7),
      uniqueContactsCount: Math.floor((answeredCount + outboundCount) * 0.6),
      outboundTalkingSec,
      totalTalkingSec: inboundTalkingSec + outboundTalkingSec + ringSecTotal,
      breaksCount,
      breaksDurationSec,
      dailyBuckets
    }
  })
}
