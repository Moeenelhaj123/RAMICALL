import type { Conversation, Message, UserSummary } from '@/types/chat'

export function generateMockChatData(users: UserSummary[], currentUserId: string) {
  const otherUsers = users.filter((u) => u.id !== currentUserId)

  const conversations: Conversation[] = [
    {
      id: 'conv-1',
      type: 'dm',
      members: [
        users.find((u) => u.id === currentUserId)!,
        { ...otherUsers[0], presence: 'online' },
      ],
      lastMessageAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      lastMessagePreview: 'Sure, I can help with that.',
      unreadCount: 2,
      pinned: false,
      muted: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 'conv-2',
      type: 'group',
      title: 'Project Team',
      members: [
        users.find((u) => u.id === currentUserId)!,
        { ...otherUsers[1], presence: 'away' },
        { ...otherUsers[2], presence: 'online' },
        { ...otherUsers[3], presence: 'offline' },
      ],
      lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      lastMessagePreview: 'Meeting starts in 10 minutes',
      unreadCount: 0,
      pinned: true,
      muted: false,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'conv-3',
      type: 'dm',
      members: [
        users.find((u) => u.id === currentUserId)!,
        { ...otherUsers[4], presence: 'online' },
      ],
      lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      lastMessagePreview: 'Thanks for the update!',
      unreadCount: 0,
      pinned: false,
      muted: false,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'conv-4',
      type: 'group',
      title: 'Support Team',
      members: [
        users.find((u) => u.id === currentUserId)!,
        { ...otherUsers[0], presence: 'online' },
        { ...otherUsers[1], presence: 'away' },
      ],
      lastMessageAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastMessagePreview: 'Customer issue resolved',
      unreadCount: 5,
      pinned: false,
      muted: true,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const messagesByConv: Record<string, Message[]> = {
    'conv-1': [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        sender: users.find((u) => u.id === currentUserId)!,
        body: 'Hey, can you help me with the deployment?',
        createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        status: 'read',
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        sender: otherUsers[0],
        body: 'Sure, I can help with that.',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: 'delivered',
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        sender: otherUsers[0],
        body: 'Let me check the logs first.',
        createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
        status: 'delivered',
      },
    ],
    'conv-2': [
      {
        id: 'msg-4',
        conversationId: 'conv-2',
        sender: otherUsers[1],
        body: 'Good morning everyone!',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
      {
        id: 'msg-5',
        conversationId: 'conv-2',
        sender: users.find((u) => u.id === currentUserId)!,
        body: 'Morning! Ready for today\'s standup?',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
      {
        id: 'msg-6',
        conversationId: 'conv-2',
        sender: otherUsers[2],
        body: 'Meeting starts in 10 minutes',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
    ],
    'conv-3': [
      {
        id: 'msg-7',
        conversationId: 'conv-3',
        sender: users.find((u) => u.id === currentUserId)!,
        body: 'Here is the status update you requested.',
        createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        status: 'read',
        attachments: [
          {
            id: 'att-1',
            name: 'status-report.pdf',
            size: 245678,
            mime: 'application/pdf',
          },
        ],
      },
      {
        id: 'msg-8',
        conversationId: 'conv-3',
        sender: otherUsers[4],
        body: 'Thanks for the update!',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
    ],
    'conv-4': [
      {
        id: 'msg-9',
        conversationId: 'conv-4',
        sender: otherUsers[0],
        body: 'We have a new support ticket that needs attention.',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
      {
        id: 'msg-10',
        conversationId: 'conv-4',
        sender: otherUsers[1],
        body: 'I\'m on it. Will update in 30 minutes.',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
        status: 'read',
      },
      {
        id: 'msg-11',
        conversationId: 'conv-4',
        sender: otherUsers[1],
        body: 'Customer issue resolved',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
    ],
  }

  return { conversations, messagesByConv }
}
