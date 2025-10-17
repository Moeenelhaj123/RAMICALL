import { useState, useEffect, useCallback, useMemo } from 'react'
import { ConversationsList } from '@/components/chat/ConversationsList'
import { ChatPanel } from '@/components/chat/ChatPanel'
import type { Conversation, Message, UserSummary, TypingEvent } from '@/types/chat'
import type { ListConversationsQuery } from '@/api/chat'
import { useChatRealtime } from '@/hooks/useChatRealtime'

interface ChatPageProps {
  me: UserSummary
  conversations: Conversation[]
  totalConversations: number
  messagesByConv: Record<string, Message[]>
  allUsers: UserSummary[]
  loading?: boolean
  onQueryConversations?: (q: ListConversationsQuery) => Promise<void>
  onOpenConversation?: (id: string) => Promise<void>
  onListMessages?: (
    id: string,
    opts: { beforeId?: string; pageSize?: number }
  ) => Promise<void>
  onSend?: (
    id: string,
    payload: { body?: string; attachments?: File[]; replyToId?: string }
  ) => Promise<void>
  onMarkRead?: (id: string) => Promise<void>
  onStartDM?: (userId: string) => Promise<void>
  onCreateGroup?: (title: string, members: string[]) => Promise<void>
  onRenameGroup?: (id: string, title: string) => Promise<void>
  onMute?: (id: string, muted: boolean) => Promise<void>
  onAddMembers?: (id: string, members: string[]) => Promise<void>
  onLeaveGroup?: (id: string) => Promise<void>
  onTyping?: (id: string) => Promise<void>
}

const SELECTED_CONVERSATION_KEY = 'chat.selected.v1'

export function ChatPage({
  me,
  conversations,
  messagesByConv,
  allUsers,
  loading,
  onQueryConversations,
  onOpenConversation,
  onListMessages,
  onSend,
  onMarkRead,
  onStartDM,
  onCreateGroup,
  onRenameGroup,
  onMute,
  onAddMembers,
  onLeaveGroup,
  onTyping,
}: ChatPageProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(
    () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(SELECTED_CONVERSATION_KEY) || undefined
      }
      return undefined
    }
  )
  const [typingEvents, setTypingEvents] = useState<TypingEvent[]>([])

  const handleConversationUpdated = useCallback((conversation: Conversation) => {
    console.log('Conversation updated:', conversation)
  }, [])

  const handleMessageCreated = useCallback(
    (message: Message) => {
      console.log('Message created:', message)
      if (message.conversationId !== selectedConversationId) {
      }
    },
    [selectedConversationId]
  )

  const handleMessageUpdated = useCallback((message: Message) => {
    console.log('Message updated:', message)
  }, [])

  const handleTypingEvent = useCallback((event: TypingEvent) => {
    setTypingEvents((prev) => {
      const filtered = prev.filter(
        (e) => e.conversationId !== event.conversationId || e.userId !== event.userId
      )
      return [...filtered, event]
    })

    setTimeout(() => {
      setTypingEvents((prev) =>
        prev.filter(
          (e) =>
            e.conversationId !== event.conversationId || e.userId !== event.userId
        )
      )
    }, 5000)
  }, [])

  useChatRealtime({
    onConversationUpdated: handleConversationUpdated,
    onMessageCreated: handleMessageCreated,
    onMessageUpdated: handleMessageUpdated,
    onTyping: handleTypingEvent,
  })

  useEffect(() => {
    if (selectedConversationId) {
      localStorage.setItem(SELECTED_CONVERSATION_KEY, selectedConversationId)
    }
  }, [selectedConversationId])

  const handleSelectConversation = useCallback(
    async (id: string) => {
      setSelectedConversationId(id)
      await onOpenConversation?.(id)
      await onMarkRead?.(id)
    },
    [onOpenConversation, onMarkRead]
  )

  const handleSend = useCallback(
    async (body: string, attachments?: File[]) => {
      if (!selectedConversationId) return
      await onSend?.(selectedConversationId, { body, attachments })
    },
    [selectedConversationId, onSend]
  )

  const handleTyping = useCallback(async () => {
    if (!selectedConversationId) return
    await onTyping?.(selectedConversationId)
  }, [selectedConversationId, onTyping])

  const handleRenameGroup = useCallback(
    async (title: string) => {
      if (!selectedConversationId) return
      await onRenameGroup?.(selectedConversationId, title)
    },
    [selectedConversationId, onRenameGroup]
  )

  const handleMute = useCallback(
    async (muted: boolean) => {
      if (!selectedConversationId) return
      await onMute?.(selectedConversationId, muted)
    },
    [selectedConversationId, onMute]
  )

  const handleAddMembers = useCallback(() => {
    console.log('Add members to conversation:', selectedConversationId)
  }, [selectedConversationId])

  const handleLeaveGroup = useCallback(async () => {
    if (!selectedConversationId) return
    await onLeaveGroup?.(selectedConversationId)
    setSelectedConversationId(undefined)
  }, [selectedConversationId, onLeaveGroup])

  const handleStartDM = useCallback(
    async (userId: string) => {
      await onStartDM?.(userId)
    },
    [onStartDM]
  )

  const handleCreateGroup = useCallback(
    async (title: string, memberIds: string[]) => {
      await onCreateGroup?.(title, memberIds)
    },
    [onCreateGroup]
  )

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId]
  )

  const selectedMessages = useMemo(
    () => (selectedConversationId ? messagesByConv[selectedConversationId] || [] : []),
    [selectedConversationId, messagesByConv]
  )

  const typingUsersInActiveConv = useMemo(() => {
    if (!selectedConversationId) return []
    return typingEvents
      .filter((e) => e.conversationId === selectedConversationId && e.userId !== me.id)
      .map((e) => allUsers.find((u) => u.id === e.userId))
      .filter((u): u is UserSummary => !!u)
  }, [typingEvents, selectedConversationId, allUsers, me.id])

  return (
    <div className="h-full bg-slate-50">
      <div className="flex h-full">
        <aside
          className="w-96 flex-shrink-0"
          aria-label="Conversations"
        >
          <ConversationsList
            conversations={conversations}
            me={me}
            allUsers={allUsers}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            onQueryChange={onQueryConversations}
            onStartDM={handleStartDM}
            onCreateGroup={handleCreateGroup}
          />
        </aside>

        <section
          className="flex-1"
          aria-label="Chat"
        >
          {selectedConversation ? (
            <ChatPanel
              conversation={selectedConversation}
              messages={selectedMessages}
              me={me}
              typingUsers={typingUsersInActiveConv}
              loading={loading}
              onBack={() => setSelectedConversationId(undefined)}
              onSend={handleSend}
              onTyping={handleTyping}
              onRenameGroup={handleRenameGroup}
              onMute={handleMute}
              onAddMembers={handleAddMembers}
              onLeaveGroup={handleLeaveGroup}
            />
          ) : (
            <div className="bg-white flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-slate-500 text-lg font-medium">
                  Select a conversation
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Choose from your existing conversations or start a new one
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
