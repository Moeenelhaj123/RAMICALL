import { useState, useRef, KeyboardEvent, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PaperPlaneRight, Paperclip, X } from '@phosphor-icons/react'
import { looksArabic, getLanguageAttribute, getFontClass, cn } from '@/lib/bidi'

interface ComposerProps {
  onSend: (body: string, attachments?: File[]) => void
  onTyping?: () => void
  disabled?: boolean
}

export function Composer({ onSend, onTyping, disabled }: ComposerProps) {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<number | null>(null)

  // Detect Arabic text for proper font and direction
  const lang = getLanguageAttribute(message)
  const fontClass = getFontClass(message)

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    onTyping?.()

    typingTimeoutRef.current = window.setTimeout(() => {
      typingTimeoutRef.current = null
    }, 3000)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if ((!message.trim() && attachments.length === 0) || disabled) return

    onSend(message.trim(), attachments.length > 0 ? attachments : undefined)
    setMessage('')
    setAttachments([])

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="border-t border-slate-200 p-4 space-y-3 bg-white shrink-0">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            >
              <span className="text-slate-900 font-medium truncate max-w-[150px]">
                {file.name}
              </span>
              <span className="text-slate-500 text-xs tabular-nums">{formatFileSize(file.size)}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                aria-label={`Remove ${file.name}`}
              >
                <X size={16} weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
          aria-label="Attach files"
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="h-10 w-10 shrink-0 focus:ring-2 focus:ring-blue-300"
          aria-label="Attach file"
        >
          <Paperclip size={20} weight="bold" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Shift+Enter for new line)"
          disabled={disabled}
          dir="auto"
          lang={lang}
          className={cn(
            "resize-none min-h-[40px] max-h-[120px] focus:ring-2 focus:ring-blue-300 tabular",
            fontClass
          )}
          rows={1}
          id="message-input"
          aria-label="Message input"
        />

        <Button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          className="h-10 w-10 shrink-0 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
          size="icon"
          aria-label="Send message"
        >
          <PaperPlaneRight size={20} weight="bold" />
        </Button>
      </div>
    </div>
  )
}
