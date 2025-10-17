import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PresenceDot } from './PresenceDot'
import type { Conversation, UserSummary } from '@/types/chat'
import { DotsThree, ArrowLeft } from '@phosphor-icons/react'

interface ConversationHeaderProps {
  conversation: Conversation
  me: UserSummary
  onBack?: () => void
  onRenameGroup?: (title: string) => void
  onMute?: (muted: boolean) => void
  onAddMembers?: () => void
  onLeaveGroup?: () => void
}

export function ConversationHeader({
  conversation,
  me,
  onBack,
  onRenameGroup,
  onMute,
  onAddMembers,
  onLeaveGroup,
}: ConversationHeaderProps) {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState(conversation.title || '')

  const otherParticipant =
    conversation.type === 'dm'
      ? conversation.members.find((m) => m.id !== me.id)
      : null

  const displayName =
    conversation.type === 'dm'
      ? otherParticipant?.name || 'Unknown User'
      : conversation.title ||
        conversation.members
          .slice(0, 3)
          .map((m) => m.name)
          .join(', ')

  const subtitle =
    conversation.type === 'dm'
      ? otherParticipant?.presence || 'offline'
      : `${conversation.members.length} members`

  const displayMembers = conversation.members.slice(0, 3)
  const remainingCount = Math.max(0, conversation.members.length - 3)

  const handleRename = () => {
    if (!newTitle.trim()) return
    onRenameGroup?.(newTitle.trim())
    setRenameDialogOpen(false)
  }

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white shrink-0">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 md:hidden focus:ring-2 focus:ring-blue-300"
            aria-label="Back to conversations"
          >
            <ArrowLeft size={20} weight="bold" />
          </Button>
        )}

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex -space-x-2">
            {displayMembers.map((member) => {
              const isOther = conversation.type === 'dm' && member.id !== me.id
              return (
                <div key={member.id} className="relative">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold text-sm">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {isOther && member.presence && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-white flex items-center justify-center">
                      <PresenceDot presence={member.presence} />
                    </div>
                  )}
                </div>
              )
            })}
            {remainingCount > 0 && (
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold text-sm">
                  +{remainingCount}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm truncate whitespace-nowrap overflow-hidden text-ellipsis">
              {displayName}
            </h3>
            <p className="text-xs text-slate-500 truncate whitespace-nowrap overflow-hidden text-ellipsis capitalize">{subtitle}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-700 hover:bg-slate-100 focus:ring-2 focus:ring-blue-300"
              aria-label="Conversation options"
            >
              <DotsThree size={24} weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => onMute?.(!conversation.muted)}
              className="cursor-pointer focus:ring-2 focus:ring-blue-300"
            >
              {conversation.muted ? 'Unmute' : 'Mute'} conversation
            </DropdownMenuItem>

            {conversation.type === 'group' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setRenameDialogOpen(true)}
                  className="cursor-pointer focus:ring-2 focus:ring-blue-300"
                >
                  Rename group
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAddMembers} className="cursor-pointer focus:ring-2 focus:ring-blue-300">
                  Add members
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLeaveGroup}
                  className="cursor-pointer text-red-600 focus:ring-2 focus:ring-blue-300"
                >
                  Leave group
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-[400px]" aria-describedby="rename-description">
          <DialogHeader>
            <DialogTitle>Rename Group</DialogTitle>
          </DialogHeader>
          <p id="rename-description" className="sr-only">
            Enter a new name for this group conversation
          </p>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="group-title">Group Name</Label>
              <Input
                id="group-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter group name"
                className="mt-1.5 focus:ring-2 focus:ring-blue-300"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRenameDialogOpen(false)} className="focus:ring-2 focus:ring-blue-300">
                Cancel
              </Button>
              <Button onClick={handleRename} disabled={!newTitle.trim()} className="focus:ring-2 focus:ring-blue-300">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
