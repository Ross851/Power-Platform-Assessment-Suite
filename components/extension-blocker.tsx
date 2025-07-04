'use client'

import { useEffect } from 'react'

export function ExtensionBlocker() {
  useEffect(() => {
    // Override console methods to filter out extension errors
    const originalError = console.error
    const originalWarn = console.warn
    const originalLog = console.log

    console.error = (...args) => {
      const message = args[0]?.toString() || ''
      if (
        message.includes('moz-extension://') ||
        message.includes('chrome-extension://') ||
        message.includes('detectStore') ||
        message.includes('h1-check.js')
      ) {
        return // Suppress extension errors
      }
      originalError.apply(console, args)
    }

    console.warn = (...args) => {
      const message = args[0]?.toString() || ''
      if (message.includes('extension://')) {
        return // Suppress extension warnings
      }
      originalWarn.apply(console, args)
    }

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      if (
        event.message.includes('moz-extension://') ||
        event.message.includes('chrome-extension://') ||
        event.message.includes('detectStore') ||
        event.message.includes('h1-check.js') ||
        event.filename?.includes('extension://')
      ) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }

    // Promise rejection handler
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.toString() || ''
      if (
        reason.includes('extension://') ||
        reason.includes('detectStore') ||
        reason.includes('h1-check')
      ) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }

    // Add listeners
    window.addEventListener('error', handleError, true)
    window.addEventListener('unhandledrejection', handleRejection, true)

    // Block extension scripts from modifying our app
    if (typeof window !== 'undefined') {
      // Freeze critical objects
      try {
        Object.freeze(window.React)
        Object.freeze(window.ReactDOM)
      } catch (e) {
        // Ignore if objects don't exist
      }
    }

    // Cleanup
    return () => {
      console.error = originalError
      console.warn = originalWarn
      console.log = originalLog
      window.removeEventListener('error', handleError, true)
      window.removeEventListener('unhandledrejection', handleRejection, true)
    }
  }, [])

  return null
}