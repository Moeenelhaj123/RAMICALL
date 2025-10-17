import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Message } from '@/types/chat'
import { format, parseISO } from 'date-fns'
import { Check, Checks, File } from '@phosphor-icons/react'
import { looksArabic, getLanguageAttribute, getFontClass, cn } from '@/lib/bidi'

interface MessageBubbleProps {
  message: Message
  isMine: boolean
  showAvatar: boolean
}

export function MessageBubble({ message, isMine, showAvatar }: MessageBubbleProps) {
  const formatTime = (isoString: string) => {
    return format(parseISO(isoString), 'HH:mm')
  }

  // Detect Arabic text for proper font and direction
  const lang = getLanguageAttribute(message.body ?? '')
  const isArabic = looksArabic(message.body ?? '')
  const fontClass = getFontClass(message.body ?? '')

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const StatusIcon = () => {
    if (!isMine || !message.status) return null
    if (message.status === 'error') {
      return <span className="text-red-500 text-xs">Failed</span>
    }
    if (message.status === 'sending') {
      return <span className="text-slate-400 text-xs">Sending...</span>
    }
    if (message.status === 'read') {
      return <Checks size={16} weight="bold" className="text-blue-500" />
    }
    if (message.status === 'delivered') {
      return <Checks size={16} weight="bold" className="text-slate-400" />
    }
    if (message.status === 'sent') {
      return <Check size={16} weight="bold" className="text-slate-400" />
    }
    return null
  }

  return (
    <div
      className={cn(
        'flex gap-2',
        isMine ? 'flex-row-reverse' : 'flex-row',
        !showAvatar ? 'ms-10' : ''
      )}
    >
      {showAvatar && !isMine && (
        <Avatar className="h-8 w-8 border border-slate-200 shrink-0">
          <AvatarImage src={message.sender.avatarUrl} alt={message.sender.name} />
          <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold text-xs">
            {message.sender.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      )}

      {!showAvatar && !isMine && <div className="w-8 shrink-0" />}

      <div className={cn(
        'flex flex-col max-w-[75%] md:max-w-[68%] lg:max-w-[60%]',
        isMine ? 'items-end' : 'items-start'
      )}>
        {showAvatar && !isMine && (
          <span className="text-xs text-slate-600 font-medium mb-1 px-1">
            {message.sender.name}
          </span>
        )}

        <div
          dir="auto"
          lang={lang}
          className={cn(
            'rounded-2xl px-4 py-2 border whitespace-pre-wrap break-words',
            isMine ? 'bg-blue-50 border-blue-200 ms-auto' : 'bg-slate-50 border-slate-200 me-auto',
            fontClass
          )}
        >
          {message.deleted ? (
            <p className="text-sm text-slate-400 italic">Message deleted</p>
          ) : (
            <>
              {message.body && (
                <p className="text-sm text-slate-900">
                  {message.body}
                </p>
              )}

              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg"
                    >
                      <File size={20} weight="bold" className="text-slate-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-slate-500 tabular-nums">
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className={cn(
          'flex items-center gap-1.5 mt-1 px-1',
          isMine ? 'flex-row-reverse' : 'flex-row'
        )}>
          <span className="text-xs text-slate-500 tabular">
            {formatTime(message.createdAt)}
          </span>
          {message.editedAt && (
            <span className="text-xs text-slate-400">(edited)</span>
          )}
          <StatusIcon />
        </div>
      </div>
    </div>
  )
}
