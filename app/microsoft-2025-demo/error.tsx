'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Assessment page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Something went wrong!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            An error occurred while loading the assessment. This might be due to a browser extension conflict.
          </p>
          <p className="text-xs text-muted-foreground">
            Error: {error.message || 'Unknown error'}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => reset()}
              variant="default"
              size="sm"
            >
              Try again
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              size="sm"
            >
              Go home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}