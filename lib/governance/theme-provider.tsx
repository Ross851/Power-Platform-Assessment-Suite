'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

/**
 * Theme Provider for Power Platform Assessment Suite
 * Manages light/dark mode with browser persistence
 * Supports system preference detection
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'pp-assessment-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Load theme from localStorage on mount
    const storedTheme = localStorage.getItem(storageKey) as Theme
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [storageKey])

  useEffect(() => {
    // Apply theme to document root
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    let resolvedTheme: 'light' | 'dark'

    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    } else {
      resolvedTheme = theme
    }

    root.classList.add(resolvedTheme)
    setActualTheme(resolvedTheme)

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        resolvedTheme === 'dark' ? '#1f2937' : '#ffffff'
      )
    }
  }, [theme])

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem(storageKey, newTheme)
    
    // Governance audit: Log theme changes for compliance
    console.log(`[Governance] Theme changed to: ${newTheme} at ${new Date().toISOString()}`)
  }

  const value = {
    theme,
    setTheme: updateTheme,
    actualTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}