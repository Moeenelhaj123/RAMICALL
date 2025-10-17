import TrunkCard from './TrunkCard'
import type { Trunk } from '@/types/trunks'

type TrunksGridProps = {
  trunks: Trunk[]
  onEdit: (id: string) => void
}

export default function TrunksGrid({ trunks, onEdit }: TrunksGridProps) {
  if (trunks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <p className="text-slate-500 mb-4">No trunks configured yet</p>
        <p className="text-sm text-slate-400">Add your first trunk to get started</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {trunks.map(trunk => (
        <TrunkCard key={trunk.id} trunk={trunk} onEdit={onEdit} />
      ))}
    </div>
  )
}
