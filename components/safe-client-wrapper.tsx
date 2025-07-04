'use client'

import { Component, ReactNode, ErrorInfo } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class SafeClientWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4">
            <Alert className="max-w-md mx-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-2">Something went wrong</p>
                <p className="text-sm mb-3">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined })
                    window.location.reload()
                  }}
                >
                  Reload Page
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )
      )
    }

    return this.props.children
  }
}