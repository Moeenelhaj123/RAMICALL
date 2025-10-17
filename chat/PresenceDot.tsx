import type { UserSummary } from '@/types/chat'

interface PresenceDotProps {
  presence?: UserSummary['presence']
  className?: string
}

export function PresenceDot({ presence = 'offline', className = '' }: PresenceDotProps) {
  const colorMap = {
    online: 'bg-green-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-400',
  }

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${colorMap[presence]} ${className}`}
      aria-label={`${presence} status`}
    />
  )
}
