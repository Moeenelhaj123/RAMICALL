import type { Conversation, Message } from '@/types/chat'

export type ListConversationsQuery = {
  search?: string
  filter?: 'all' | 'unread' | 'groups' | 'dms'
  page?: number
  pageSize?: number
  sort?: 'recent' | 'unreadFirst'
}

export async function listConversations(
  q: ListConversationsQuery
): Promise<{ rows: Conversation[]; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { rows: [], total: 0 }
}

export async function getConversation(id: string): Promise<Conversation> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  throw new Error('Not implemented')
}

export async function listMessages(
  conversationId: string,
  opts: { beforeId?: string; pageSize?: number }
): Promise<{ rows: Message[]; reachedTop: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { rows: [], reachedTop: true }
}

export async function sendMessage(
  conversationId: string,
  payload: { body?: string; attachments?: File[]; replyToId?: string }
): Promise<Message> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  throw new Error('Not implemented')
}

export async function editMessage(
  conversationId: string,
  messageId: string,
  body: string
): Promise<Message> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  throw new Error('Not implemented')
}

export async function deleteMessage(
  conversationId: string,
  messageId: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))
}

export async function markRead(conversationId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100))
}

export async function startDM(userId: string): Promise<Conversation> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  throw new Error('Not implemented')
}

export async function createGroup(payload: {
  title: string
  memberIds: string[]
}): Promise<Conversation> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  throw new Error('Not implemented')
}

export async function addMembers(
  conversationId: string,
  userIds: string[]
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))
}

export async function removeMember(
  conversationId: string,
  userId: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))
}

export async function renameGroup(
  conversationId: string,
  title: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))
}

export async function muteConversation(
  conversationId: string,
  muted: boolean
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200))
}

export async function typing(conversationId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 50))
}
