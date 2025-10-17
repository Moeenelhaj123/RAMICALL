import { ConversationHeader } from './ConversationHeader'
import { MessagesList } from './MessagesList'
import { Composer } from './Composer'
import { TypingIndicator } from './TypingIndicator'
import type { Conversation, Message, UserSummary } from '@/types/chat'

interface ChatPanelProps {
  conversation: Conversation
  messages: Message[]
  me: UserSummary
  typingUsers?: UserSummary[]
  loading?: boolean
  hasMore?: boolean
  onBack?: () => void
  onLoadMore?: () => void
  onSend: (body: string, attachments?: File[]) => void
  onTyping?: () => void
  onRenameGroup?: (title: string) => void
  onMute?: (muted: boolean) => void
  onAddMembers?: () => void
  onLeaveGroup?: () => void
}

export function ChatPanel({
  conversation,
  messages,
  me,
  typingUsers = [],
  loading,
  hasMore,
  onBack,
  onLoadMore,
  onSend,
  onTyping,
  onRenameGroup,
  onMute,
  onAddMembers,
  onLeaveGroup,
}: ChatPanelProps) {
  return (
    <div className="bg-white h-full flex flex-col overflow-hidden">
      <ConversationHeader
        conversation={conversation}
        me={me}
        onBack={onBack}
        onRenameGroup={onRenameGroup}
        onMute={onMute}
        onAddMembers={onAddMembers}
        onLeaveGroup={onLeaveGroup}
      />

      <MessagesList
        messages={messages}
        me={me}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
      />

      {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}

      <Composer onSend={onSend} onTyping={onTyping} />
    </div>
  )
}
