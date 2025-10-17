import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import type { Message, UserSummary } from '@/types/chat'
import { format, parseISO, isSameDay } from 'date-fns'

interface MessagesListProps {
  messages: Message[]
  me: UserSummary
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
}

export function MessagesList({
  messages,
  me,
  loading,
  hasMore,
  onLoadMore,
}: MessagesListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore?.()
        }
      },
      { threshold: 1.0 }
    )

    observer.observe(loadMoreRef.current)

    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore])

  const groupedMessages: Array<{
    date: string
    messages: Array<{ message: Message; showAvatar: boolean }>
  }> = []

  messages.forEach((message, index) => {
    const messageDate = parseISO(message.createdAt)
    const dateKey = format(messageDate, 'yyyy-MM-dd')

    let group = groupedMessages.find((g) => g.date === dateKey)
    if (!group) {
      group = { date: dateKey, messages: [] }
      groupedMessages.push(group)
    }

    const prevMessage = index > 0 ? messages[index - 1] : null
    const showAvatar =
      !prevMessage ||
      prevMessage.sender.id !== message.sender.id ||
      !isSameDay(parseISO(prevMessage.createdAt), messageDate)

    group.messages.push({ message, showAvatar })
  })

  const formatDayHeader = (dateStr: string) => {
    const date = parseISO(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (isSameDay(date, today)) return 'Today'
    if (isSameDay(date, yesterday)) return 'Yesterday'
    return format(date, 'EEEE, MMMM d, yyyy')
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {hasMore && (
        <div ref={loadMoreRef} className="text-center py-2">
          {loading ? (
            <span className="text-sm text-slate-500">Loading...</span>
          ) : (
            <span className="text-sm text-slate-400">Scroll up to load more</span>
          )}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500">No messages yet</p>
        </div>
      ) : (
        groupedMessages.map((group) => (
          <div key={group.date} className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="px-3 py-1 bg-slate-100 rounded-full">
                <span className="text-xs text-slate-500 tabular-nums">
                  {formatDayHeader(group.date)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {group.messages.map(({ message, showAvatar }) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isMine={message.sender.id === me.id}
                  showAvatar={showAvatar}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
