"use client"

import type { RAGStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RAGIndicatorProps {
  status?: RAGStatus
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function RAGIndicator({ status, size = "md", showText = false }: RAGIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  const colorClasses = {
    red: "bg-red-500",
    amber: "bg-yellow-500",
    green: "bg-green-500",
    grey: "bg-gray-400",
  }

  if (!status) return null

  return (
    <div className="flex items-center space-x-2">
      <span
        className={cn("inline-block rounded-full", sizeClasses[size], colorClasses[status] || "bg-gray-300")}
        title={`Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
      />
      {showText && <span className="text-sm capitalize">{status}</span>}
    </div>
  )
}
