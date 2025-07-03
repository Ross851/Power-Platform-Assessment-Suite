"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function StorageResetButton() {
  const handleReset = () => {
    try {
      // Clear all localStorage data
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
        
        // Force reload to reinitialize
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to clear storage:', error)
      alert('Failed to clear storage. Please try clearing your browser data manually.')
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset Storage
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Reset Application Storage?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will clear all saved assessment data and reset the application to its initial state. 
            This action cannot be undone. Make sure to export your data first if you want to keep it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
            Reset Storage
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}