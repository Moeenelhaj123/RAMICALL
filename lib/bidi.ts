/**
 * Utilities for bidirectional text support and Arabic language detection
 */

/**
 * Detects if a text string contains Arabic characters
 * Arabic Unicode block ranges: \u0600-\u06FF (Arabic), \u0750-\u077F (Arabic Supplement)
 */
export const looksArabic = (text: string): boolean => {
  if (!text || typeof text !== 'string') return false
  return /[\u0600-\u06FF\u0750-\u077F]/.test(text)
}

/**
 * Gets the primary text direction for a string
 * Returns 'rtl' for Arabic text, 'ltr' for other text
 */
export const getTextDirection = (text: string): 'ltr' | 'rtl' => {
  return looksArabic(text) ? 'rtl' : 'ltr'
}

/**
 * Gets the appropriate language attribute for a text string
 */
export const getLanguageAttribute = (text: string): string | undefined => {
  return looksArabic(text) ? 'ar' : undefined
}

/**
 * Gets the appropriate font family class for text content
 */
export const getFontClass = (text: string): string => {
  return looksArabic(text) ? 'font-arabic' : 'font-sans'
}

/**
 * Detects if text contains mixed LTR/RTL content
 */
export const hasMixedDirection = (text: string): boolean => {
  if (!text || typeof text !== 'string') return false
  
  const hasArabic = /[\u0600-\u06FF\u0750-\u077F]/.test(text)
  const hasLatin = /[A-Za-z]/.test(text)
  
  return hasArabic && hasLatin
}

/**
 * Utility to combine CSS classes conditionally
 */
export const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(' ')
}