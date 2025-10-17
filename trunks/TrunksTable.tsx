import { IconButton } from '@mui/material'
import { PencilSimple } from '@phosphor-icons/react'
import type { Trunk } from '@/types/trunks'

type TrunksTableProps = {
  trunks: Trunk[]
  onEdit: (id: string) => void
}

export default function TrunksTable({ trunks, onEdit }: TrunksTableProps) {
  if (trunks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <p className="text-slate-500 mb-4">No trunks configured yet</p>
        <p className="text-sm text-slate-400">Add your first trunk to get started</p>
      </div>
    )
  }

  const getLedColor = (status: Trunk['status']) =>
    status === 'up' ? 'bg-emerald-500' :
    status === 'down' ? 'bg-rose-500' : 'bg-slate-300'

  const getStatusText = (status: Trunk['status']) =>
    status === 'up' ? 'text-emerald-600' :
    status === 'down' ? 'text-rose-600' : 'text-slate-500'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full">
          <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                Name
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                Protocol
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                Host
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                Port
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                Channels
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                Latency
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                Packet Loss
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                ASR
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                ACD
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                Last Heartbeat
              </th>
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {trunks.map((trunk, idx) => (
              <tr 
                key={trunk.id}
                className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'}
              >
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-3.5 h-3.5 rounded-full ${getLedColor(trunk.status)} shadow-[inset_0_-1px_2px_rgba(0,0,0,0.2)]`}
                      aria-label={`status ${trunk.status}`}
                      role="status"
                    />
                    <span className={`text-sm font-medium capitalize ${getStatusText(trunk.status)}`}>
                      {trunk.status}
                    </span>
                  </div>
                </td>
                <th scope="row" className="px-5 py-3.5 text-sm font-semibold text-slate-900 whitespace-nowrap">
                  {trunk.name}
                </th>
                <td className="px-5 py-3.5 text-sm text-slate-700 whitespace-nowrap">
                  <span className="uppercase font-medium">{trunk.protocol}</span>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-700 whitespace-nowrap font-tabular-nums">
                  {trunk.host || '—'}
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-700 whitespace-nowrap font-tabular-nums">
                  {trunk.port || '—'}
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-700 whitespace-nowrap font-tabular-nums">
                  {trunk.activeChannels !== undefined && trunk.maxChannels !== undefined
                    ? `${trunk.activeChannels} / ${trunk.maxChannels}`
                    : '—'}
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-700 whitespace-nowrap font-tabular-nums">
                  {trunk.latencyMs !== undefined ? `${trunk.latencyMs}ms` : '—'}
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-700 whitespace-nowrap font-tabular-nums">
                  {trunk.packetLossPct !== undefined ? `${trunk.packetLossPct.toFixed(1)}%` : '—'}
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-700 whitespace-nowrap font-tabular-nums">
                  {trunk.asrPct !== undefined ? `${trunk.asrPct.toFixed(1)}%` : '—'}
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-700 whitespace-nowrap font-tabular-nums">
                  {trunk.acdSec !== undefined ? `${Math.floor(trunk.acdSec / 60)}m ${trunk.acdSec % 60}s` : '—'}
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap font-tabular-nums">
                  {trunk.lastHeartbeatAt 
                    ? new Date(trunk.lastHeartbeatAt).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                    : '—'}
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <IconButton 
                    aria-label="edit trunk" 
                    size="small" 
                    onClick={() => onEdit(trunk.id)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <PencilSimple size={18} />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
