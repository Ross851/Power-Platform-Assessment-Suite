"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RAGIndicatorProps {
  status: "red" | "amber" | "green" | "grey" | undefined
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function RAGIndicator({ status, size = "md", showText = false, className }: RAGIndicatorProps) {
  const getStatusConfig = (status: string | undefined) => {
    switch (status) {
      case "red":
        return {
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          text: "HIGH RISK",
        }
      case "amber":
        return {
          color: "bg-amber-500",
          textColor: "text-amber-700",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          text: "MEDIUM RISK",
        }
      case "green":
        return {
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          text: "LOW RISK",
        }
      default:
        return {
          color: "bg-gray-400",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          text: "NOT ASSESSED",
        }
    }
  }

  const config = getStatusConfig(status)

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6",
  }

  if (showText) {
    return (
      <Badge
        variant="outline"
        className={cn(config.bgColor, config.borderColor, config.textColor, "font-semibold", className)}
      >
        <div className={cn("rounded-full mr-2", config.color, sizeClasses[size])} />
        {config.text}
      </Badge>
    )
  }

  return <div className={cn("rounded-full", config.color, sizeClasses[size], className)} title={config.text} />
}
