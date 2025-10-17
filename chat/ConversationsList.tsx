import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConversationItem } from './ConversationItem'
import { StartConversationDialog } from './StartConversationDialog'
import type { Conversation, UserSummary } from '@/types/chat'
import type { ListConversationsQuery } from '@/api/chat'
import { MagnifyingGlass, Plus } from '@phosphor-icons/react'

interface ConversationsListProps {
  conversations: Conversation[]
  me: UserSummary
  allUsers: UserSummary[]
  selectedConversationId?: string
  onSelectConversation: (id: string) => void
  onQueryChange?: (query: ListConversationsQuery) => void
  onStartDM: (userId: string) => void
  onCreateGroup: (title: string, memberIds: string[]) => void
}

export function ConversationsList({
  conversations,
  me,
  allUsers,
  selectedConversationId,
  onSelectConversation,
  onQueryChange,
  onStartDM,
  onCreateGroup,
}: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value)
      onQueryChange?.({ search: value, filter: 'all', page: 0 })
    },
    [onQueryChange]
  )

  return (
    <>
      <div className="bg-white border-r border-slate-200 overflow-hidden flex flex-col h-full">
        <div className="px-4 py-3 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
            <Button
              size="icon"
              onClick={() => setDialogOpen(true)}
              className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-300"
              aria-label="Start new conversation"
            >
              <Plus size={20} weight="bold" />
            </Button>
          </div>

          <div className="relative">
            <MagnifyingGlass
              size={18}
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              type="search"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-9 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-300"
              id="conversation-search"
              aria-label="Search conversations"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-500">No conversations yet</p>
              <p className="text-sm text-slate-400 mt-1">
                Start a new conversation to get started
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                me={me}
                isSelected={conversation.id === selectedConversationId}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))
          )}
        </div>
      </div>

      <StartConversationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        allUsers={allUsers}
        me={me}
        onStartDM={onStartDM}
        onCreateGroup={onCreateGroup}
      />
    </>
  )
}
