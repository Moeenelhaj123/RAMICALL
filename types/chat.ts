export type UserSummary = {
  id: string
  name: string
  email?: string
  avatarUrl?: string
  presence?: 'online' | 'away' | 'offline'
}

export type ConversationType = 'dm' | 'group'

export type Conversation = {
  id: string
  type: ConversationType
  title?: string
  members: UserSummary[]
  lastMessageAt?: string
  lastMessagePreview?: string
  unreadCount?: number
  muted?: boolean
  pinned?: boolean
  createdAt: string
  updatedAt: string
}

export type Message = {
  id: string
  conversationId: string
  sender: UserSummary
  body?: string
  attachments?: Array<{
    id: string
    name: string
    size: number
    mime: string
    url?: string
  }>
  createdAt: string
  editedAt?: string
  deleted?: boolean
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error'
  replyToId?: string
  reactions?: Array<{ emoji: string; userId: string }>
}

export type TypingEvent = {
  conversationId: string
  userId: string
  at: string
}
