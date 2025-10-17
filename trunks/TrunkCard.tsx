import { IconButton } from '@mui/material'
import { PencilSimple } from '@phosphor-icons/react'
import type { Trunk } from '@/types/trunks'

type TrunkCardProps = {
  trunk: Trunk
  onEdit: (id: string) => void
}

export default function TrunkCard({ trunk, onEdit }: TrunkCardProps) {
  const ring =
    trunk.status === 'up' ? 'ring-green-200' :
    trunk.status === 'down' ? 'ring-rose-200' : 'ring-slate-200'

  const led =
    trunk.status === 'up' ? 'bg-emerald-500' :
    trunk.status === 'down' ? 'bg-rose-500' : 'bg-slate-300'

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md ring-1 ${ring} transition-shadow`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-slate-900 font-semibold truncate">{trunk.name}</h3>
              <span className="text-xs text-slate-500 uppercase font-medium">{trunk.protocol}</span>
            </div>
            <div className="text-sm text-slate-600">
              {trunk.status === 'up' ? (
                <span>
                  <span className="text-emerald-600 font-medium">UP</span>
                  {' — '}
                  {trunk.host}
                  {trunk.port ? ` Port ${trunk.port}` : ''}
                </span>
              ) : trunk.status === 'down' ? (
                <span className="text-slate-500">Down</span>
              ) : (
                <span className="text-slate-500">Unavailable</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div 
              className={`w-3.5 h-3.5 rounded-full ${led} shadow-[inset_0_-1px_2px_rgba(0,0,0,0.2)]`}
              aria-label={`status ${trunk.status}`}
              role="status"
            />
            <IconButton 
              aria-label="edit trunk" 
              size="small" 
              onClick={() => onEdit(trunk.id)}
              className="text-slate-600 hover:text-slate-900"
            >
              <PencilSimple size={18} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  )
}
