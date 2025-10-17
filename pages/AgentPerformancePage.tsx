import { useState, useCallback, useEffect, useMemo } from 'react'
import { AgentPerformanceToolbar } from '@/components/agent-performance/AgentPerformanceToolbar'
import { AgentPerformanceTable } from '@/components/agent-performance/AgentPerformanceTable'
import { KpiTiles } from '@/components/agent-performance/KpiTiles'
import { AgentBestDonut, TalkingOverTimeCard } from '@/features/agent-kpi'
import type { PerformanceQuery, AgentPerformanceRow, AggregateTotals } from '@/types/performance'
import type { UserAccount } from '@/types/users'
import { generateMockPerformanceData } from '@/lib/mockPerformanceData'
import { toast } from 'sonner'

type AgentPerformancePageProps = {
  users: UserAccount[]
  groupOptions?: Array<{ id: string; name: string }>
  queueOptions?: Array<{ id: string; name: string }>
}

function calculateTotals(rows: AgentPerformanceRow[]): AggregateTotals & {
  outboundAnswered: number
  uniqueContacts: number
  avgRingSec: number
  breaksDurationSec: number
} {
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

export function AgentPerformancePage({
  users,
  groupOptions = [],
  queueOptions = []
}: AgentPerformancePageProps) {
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<AgentPerformanceRow[]>([])
  const [page, setPage] = useState(0) // 0-based for shadcn table
  const [pageSize, setPageSize] = useState(25)
  const [sortBy, setSortBy] = useState('agent')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  const initialQuery: PerformanceQuery = useMemo(() => {
    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 6)
    
    return {
      dateFrom: weekAgo.toISOString(),
      dateTo: now.toISOString()
    }
  }, [])

  const [query, setQuery] = useState<PerformanceQuery>(initialQuery)

  const agentOptions = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        extension: `100${users.indexOf(user) + 1}`,
        email: user.email
      })),
    [users]
  )

  const totals = useMemo(() => calculateTotals(rows), [rows])

  const loadData = useCallback(async (q: PerformanceQuery) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      let filteredUsers = users
      if (q.agents && q.agents.length > 0) {
        filteredUsers = users.filter((u) => q.agents?.includes(u.id))
      }

      const dateFrom = new Date(q.dateFrom)
      const dateTo = new Date(q.dateTo)
      const mockData = generateMockPerformanceData(filteredUsers, dateFrom, dateTo)
      
      setRows(mockData)
    } catch (error) {
      console.error('Failed to load performance data', error)
      toast.error('Failed to load performance data')
    } finally {
      setLoading(false)
    }
  }, [users])

  const handleSort = useCallback((field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }, [sortBy, sortOrder])

  useEffect(() => {
    loadData(initialQuery)
  }, [loadData, initialQuery])

  const handleQueryChange = useCallback(
    async (newQuery: PerformanceQuery) => {
      setQuery(newQuery)
      await loadData(newQuery)
    },
    [loadData]
  )

  const handleExport = useCallback(async () => {
    try {
      toast.info('Exporting CSV...')
      
      const headers = [
        'Agent',
        'Extension',
        '#Answered',
        '#Busy',
        '#HungUp',
        '#No Answer',
        '#Missed',
        'Avg Ring (sec)',
        'Outbound',
        'Outbound Answered',
        'Outbound Clients',
        'Unique',
        'Outbound Talking (sec)',
        'Total Talking (sec)',
        '#Breaks',
        'Breaks Duration (sec)'
      ]
      
      const csvRows = [
        headers.join(','),
        ...rows.map((row) =>
          [
            `"${row.agent.name}"`,
            row.extension || '',
            row.answeredCount,
            row.busyCount,
            row.hungupCount,
            row.noAnswerCount,
            row.missedCount,
            row.avgRingSec.toFixed(2),
            row.outboundCount,
            row.outboundAnsweredCount,
            row.outboundClientsCount,
            row.uniqueContactsCount,
            row.outboundTalkingSec.toFixed(2),
            row.totalTalkingSec.toFixed(2),
            row.breaksCount,
            row.breaksDurationSec.toFixed(2)
          ].join(',')
        )
      ]
      
      const csv = csvRows.join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `agent-performance-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('CSV exported successfully')
    } catch (error) {
      console.error('Export failed', error)
      toast.error('Failed to export CSV')
    }
  }, [rows])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(0) // Reset to first page when page size changes
  }, [])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar with built-in sticky */}
      <AgentPerformanceToolbar 
        query={query}
        agentOptions={agentOptions}
        groupOptions={groupOptions}
        queueOptions={queueOptions}
        onQueryChange={handleQueryChange}
        onExport={handleExport}
        loading={loading}
      />

      {/* KPI Tiles */}
      <div className="px-6 py-4 border-b border-slate-200">
        <KpiTiles totals={totals} loading={loading} />
      </div>

      {/* Charts row: Top agents and talking trend */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AgentBestDonut rows={rows} className="order-1" />
          <TalkingOverTimeCard 
            fromISO={query.dateFrom}
            toISO={query.dateTo}
            timezone={query.tz}
            loading={loading}
            className="order-2"
          />
        </div>
      </div>

      {/* Full Width Table */}
      <div className="flex-1 overflow-hidden">
        <AgentPerformanceTable 
          data={rows} 
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          page={page}
          pageSize={pageSize}
          total={rows.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showPagination={true}
        />
      </div>
    </div>
  )
}
