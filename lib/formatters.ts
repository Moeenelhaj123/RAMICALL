export const formatDuration = (sec?: number): string => {
  if (typeof sec !== 'number' || isNaN(sec)) return '—'
  const hours = Math.floor(sec / 3600)
  const minutes = Math.floor((sec % 3600) / 60)
  const seconds = Math.floor(sec % 60)
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const fmtInt = (n?: number): string => {
  return typeof n === 'number' ? n.toLocaleString() : '—'
}

export const formatDateTime = (isoString?: string): string => {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

export const formatPhone = (phone?: string): string => {
  return phone || '—'
}

// Phone number utilities for filtering
export const looksLikePhone = (s: string): boolean => {
  return /\+?[\d\s().-]{3,}$/.test(s.trim())
}

export const normalizePhone = (s: string): string => {
  const trimmed = s.trim()
  if (trimmed.startsWith("+")) {
    return "+" + trimmed.replace(/[^\d]/g, "")
  }
  return trimmed.replace(/[^\d]/g, "")
}

// Range validation utility
export const clampRange = (min?: number, max?: number): { min?: number; max?: number } => {
  if (min && max && min > max) {
    return { min: max, max: min }
  }
  return { min, max }
}
