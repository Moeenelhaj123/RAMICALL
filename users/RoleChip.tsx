import { Tag } from '@/ui'
import type { UserRole } from '@/types/users'

type RoleChipProps = {
  role: UserRole
}

export function RoleChip({ role }: RoleChipProps) {
  const variantMap = {
    Admin: 'info' as const,
    Manager: 'success' as const,
    User: 'neutral' as const,
  }
  
  return (
    <Tag variant={variantMap[role]} size="sm">
      {role}
    </Tag>
  )
}
