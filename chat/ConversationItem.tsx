import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { PresenceDot } from './PresenceDot'
import type { Conversation, UserSummary } from '@/types/chat'
import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { looksArabic, getLanguageAttribute, getFontClass, cn } from '@/lib/bidi'

interface ConversationItemProps {
  conversation: Conversation
  me: UserSummary
  isSelected?: boolean
  onClick: () => void
}

export function ConversationItem({
  conversation,
  me,
  isSelected,
  onClick,
}: ConversationItemProps) {
  const otherParticipant =
    conversation.type === 'dm'
      ? conversation.members.find((m) => m.id !== me.id)
      : null

  const displayName =
    conversation.type === 'dm'
      ? otherParticipant?.name || 'Unknown User'
      : conversation.title || conversation.members.map((m) => m.name).slice(0, 3).join(', ')

  const avatarUrl = conversation.type === 'dm' ? otherParticipant?.avatarUrl : undefined
  const presence = conversation.type === 'dm' ? otherParticipant?.presence : undefined

  const initials =
    conversation.type === 'dm'
      ? otherParticipant?.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'U'
      : conversation.title
          ?.split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'G'

  const formatTime = (isoString?: string) => {
    if (!isoString) return ''
    const date = parseISO(isoString)
    if (isToday(date)) return format(date, 'HH:mm')
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'dd/MM/yy')
  }

  // Detect Arabic text in preview for proper font and direction
  const previewLang = getLanguageAttribute(conversation.lastMessagePreview ?? '')
  const previewFontClass = getFontClass(conversation.lastMessagePreview ?? '')
  const nameLang = getLanguageAttribute(displayName)
  const nameFontClass = getFontClass(displayName)

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300 transition-colors ${
        isSelected ? 'bg-slate-100' : ''
      }`}
      aria-label={`Open conversation with ${displayName}`}
    >
      <div className="relative shrink-0">
        <Avatar className="h-12 w-12 border border-slate-200">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        {conversation.type === 'dm' && presence && (
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-white flex items-center justify-center">
            <PresenceDot presence={presence} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
        <div className="w-full flex items-center justify-between gap-2">
          <span 
            dir="auto"
            lang={nameLang}
            className={cn(
              "font-semibold text-slate-900 text-sm truncate whitespace-nowrap overflow-hidden text-ellipsis",
              nameFontClass
            )}
          >
            {displayName}
          </span>
          {conversation.lastMessageAt && (
            <span className="text-xs text-slate-500 shrink-0 tabular ms-auto">
              {formatTime(conversation.lastMessageAt)}
            </span>
          )}
        </div>
        {conversation.lastMessagePreview && (
          <p 
            dir="auto"
            lang={previewLang}
            className={cn(
              "text-sm text-slate-600 truncate whitespace-nowrap overflow-hidden text-ellipsis w-full text-left",
              previewFontClass
            )}
          >
            {conversation.lastMessagePreview}
          </p>
        )}
      </div>

      {(conversation.unreadCount ?? 0) > 0 && (
        <Badge
          variant="default"
          className="shrink-0 bg-blue-600 text-white hover:bg-blue-700 h-5 min-w-[20px] px-1.5 text-xs font-semibold tabular"
        >
          {conversation.unreadCount! > 99 ? '99+' : conversation.unreadCount}
        </Badge>
      )}
    </button>
  )
}
