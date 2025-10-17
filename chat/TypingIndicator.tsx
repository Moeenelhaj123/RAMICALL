import type { UserSummary } from '@/types/chat'

interface TypingIndicatorProps {
  users: UserSummary[]
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null

  const names =
    users.length === 1
      ? users[0].name
      : users.length === 2
      ? `${users[0].name} and ${users[1].name}`
      : `${users[0].name} and ${users.length - 1} others`

  return (
    <div className="px-4 py-2 text-sm text-slate-500">
      <span>{names} {users.length === 1 ? 'is' : 'are'} typing…</span>
    </div>
  )
}
