'use client'

import { useEffect } from 'react'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Global error handler to catch and suppress browser extension errors
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('moz-extension://') || 
          event.message.includes('chrome-extension://') ||
          event.message.includes('detectStore') ||
          event.filename?.includes('extension://')) {
        // Prevent browser extension errors from breaking the app
        event.preventDefault()
        console.log('Browser extension error suppressed:', event.message)
        return false
      }
    }

    // Handle unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('extension://') ||
          event.reason?.message?.includes('detectStore')) {
        event.preventDefault()
        console.log('Browser extension promise rejection suppressed')
        return false
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  return <>{children}</>
}