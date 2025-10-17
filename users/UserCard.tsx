import { useState } from 'react'
import {
  DotsThree,
  PencilSimple,
  LockKey,
  CheckCircle,
  XCircle,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RoleChip } from './RoleChip'
import type { UserAccount } from '@/types/users'
import { formatDistanceToNow } from 'date-fns'

type UserCardProps = {
  user: UserAccount
  onEdit: (user: UserAccount) => void
  onDisable?: (id: string) => Promise<void>
  onEnable?: (id: string) => Promise<void>
  onResetPassword?: (id: string) => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div 
      className="group cursor-pointer transition-all duration-200 hover:scale-105"
      onClick={() => onEdit(user)}
    >
      <div className="flex flex-col items-center p-4">
        <Avatar className="h-20 w-20 mb-3 ring-2 ring-gray-200 group-hover:ring-blue-400 transition-colors">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-xl">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <div className="font-medium text-gray-900 text-sm mb-1">
            {user.name}
          </div>
          <div className="text-xs text-gray-500">
            {user.email}
          </div>
        </div>
      </div>
    </div>
  )
}
