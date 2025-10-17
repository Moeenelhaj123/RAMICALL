import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { VisibleFilters } from "@/types/calls"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Default visible filters configuration
export const defaultVisibleFilters: VisibleFilters = {
  direction: true,
  startDate: true,
  endDate: true,
  callerNumber: true,
  calledNumber: true,
  result: true,
  agent: true,
  queue: true,
  duration: true,
  ringTime: true,
  talkTime: true,
  onHold: true,
  hungupBy: true
}

// Visible filters localStorage utilities
const VISIBLE_FILTERS_KEY = "callHistory.visibleFilters.v1"

export const getVisibleFilters = (): VisibleFilters => {
  try {
    const stored = localStorage.getItem(VISIBLE_FILTERS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaultVisibleFilters, ...parsed }
    }
  } catch (error) {
    console.warn("Failed to parse visible filters from localStorage:", error)
  }
  return defaultVisibleFilters
}

export const setVisibleFilters = (filters: VisibleFilters): void => {
  try {
    localStorage.setItem(VISIBLE_FILTERS_KEY, JSON.stringify(filters))
  } catch (error) {
    console.warn("Failed to save visible filters to localStorage:", error)
  }
}

export const resetVisibleFilters = (): void => {
  try {
    localStorage.removeItem(VISIBLE_FILTERS_KEY)
  } catch (error) {
    console.warn("Failed to reset visible filters in localStorage:", error)
  }
}
