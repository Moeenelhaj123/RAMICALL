import { useEffect, useRef, useCallback } from 'react'
import type { Message, Conversation, TypingEvent } from '@/types/chat'

type RealtimeEventHandlers = {
  onConversationUpdated?: (conversation: Conversation) => void
  onMessageCreated?: (message: Message) => void
  onMessageUpdated?: (message: Message) => void
  onTyping?: (event: TypingEvent) => void
}

export function useChatRealtime(handlers: RealtimeEventHandlers) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/ws/chat`

      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        reconnectAttempts.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          switch (data.type) {
            case 'conversation.updated':
              handlers.onConversationUpdated?.(data.payload)
              break
            case 'message.created':
              handlers.onMessageCreated?.(data.payload)
              break
            case 'message.updated':
              handlers.onMessageUpdated?.(data.payload)
              break
            case 'typing':
              handlers.onTyping?.(data.payload)
              break
          }
        } catch (err) {
          console.error('Failed to parse WS message:', err)
        }
      }

      ws.onerror = () => {
        console.error('WebSocket error')
      }

      ws.onclose = () => {
        wsRef.current = null

        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000)
          reconnectAttempts.current += 1

          reconnectTimeoutRef.current = window.setTimeout(() => {
            connect()
          }, delay)
        } else {
          console.error('Max WebSocket reconnection attempts reached')
        }
      }

      wsRef.current = ws
    } catch (err) {
      console.error('Failed to create WebSocket:', err)
    }
  }, [handlers])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [connect])

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
  }
}
