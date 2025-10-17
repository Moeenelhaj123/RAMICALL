import { createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { muiTheme } from '@/theme/muiTheme'

type Theme = 'light' | 'dark'

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Custom localStorage hook to replace Spark's useKV
function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setStoredValue = (value: T) => {
    try {
      setValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      console.error('Failed to save to localStorage')
    }
  }

  return [value, setStoredValue]
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>('theme-preference', 'light')

  const currentTheme = theme ?? 'light'

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(currentTheme)
  }, [currentTheme])

  const value = {
    theme: currentTheme,
    setTheme,
  }

  return (
    <MUIThemeProvider theme={muiTheme}>
      <ThemeProviderContext.Provider value={value}>
        {children}
      </ThemeProviderContext.Provider>
    </MUIThemeProvider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
