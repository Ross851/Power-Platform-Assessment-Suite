"use client"

import type { RAGStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RAGIndicatorProps {
  status?: RAGStatus
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function RAGIndicator({ status = "grey", size = "md", showLabel = false }: RAGIndicatorProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const statusClasses = {
    red: "bg-red-500 border-red-600",
    amber: "bg-amber-500 border-amber-600",
    green: "bg-green-500 border-green-600",
    grey: "bg-gray-300 border-gray-400",
    "not-applicable": "bg-blue-300 border-blue-400",
  }

  const statusLabels = {
    red: "High Risk",
    amber: "Medium Risk",
    green: "Low Risk",
    grey: "Not Assessed",
    "not-applicable": "Not Applicable",
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "rounded-full border-2",
          sizeClasses[size],
          statusClasses[status],
          "transition-colors duration-200"
        )}
        title={statusLabels[status]}
      />
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground">{statusLabels[status]}</span>
      )}
    </div>
  )
}
