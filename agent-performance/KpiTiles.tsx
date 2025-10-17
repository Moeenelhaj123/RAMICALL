import type { AggregateTotals } from '@/types/performance'
import { formatDuration, fmtInt } from '@/lib/formatters'

type KpiTilesProps = {
  totals?: AggregateTotals & {
    outboundAnswered?: number
    uniqueContacts?: number
    avgRingSec?: number
    breaksDurationSec?: number
  }
  loading?: boolean
}

type KpiTile = {
  label: string
  value: string
}

export function KpiTiles({ totals, loading }: KpiTilesProps) {
  if (loading) {
    return (
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3 animate-pulse"
          >
            <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
            <div className="h-6 bg-slate-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  const tiles: KpiTile[] = [
    {
      label: 'Total Answered',
      value: fmtInt(totals?.answeredCount)
    },
    {
      label: 'Outbound',
      value: fmtInt(totals?.outboundCount)
    },
    {
      label: 'Outbound Answered',
      value: fmtInt(totals?.outboundAnswered)
    },
    {
      label: 'Unique Contacts',
      value: fmtInt(totals?.uniqueContacts)
    },
    {
      label: 'Total Talking',
      value: formatDuration(totals?.totalTalkingSec)
    },
    {
      label: 'Avg Ring',
      value: formatDuration(totals?.avgRingSec)
    },
    {
      label: 'Breaks Duration',
      value: formatDuration(totals?.breaksDurationSec)
    }
  ]

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {tiles.map((tile, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3"
        >
          <div className="text-xs text-slate-500 mb-1">{tile.label}</div>
          <div className="text-xl font-semibold text-slate-900 font-tabular-nums">
            {tile.value}
          </div>
        </div>
      ))}
    </div>
  )
}
