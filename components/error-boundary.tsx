"use client"

import React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert className="max-w-2xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              <p className="mb-4">
                An error occurred while rendering this page. This might be due to corrupted data or a temporary issue.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    this.setState({ hasError: false, error: null })
                    window.location.reload()
                  }}
                >
                  Reload Page
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.clear()
                    window.location.reload()
                  }}
                >
                  Clear Data & Reload
                </Button>
              </div>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <pre className="mt-4 p-4 bg-muted rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return this.props.children
  }
} 