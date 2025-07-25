import * as React from "react"
import { cn } from "@/lib/utils"

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative w-full rounded-md border border-destructive bg-destructive/10 py-4 text-sm text-destructive-foreground [&>svg]:h-4 [&>svg]:w-4",
          className,
        )}
        role="alert"
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  },
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p className={cn("mb-1 font-medium leading-none text-destructive-foreground", className)} {...props} ref={ref}>
        {children}
      </p>
    )
  },
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn("text-sm opacity-70 text-destructive-foreground", className)} {...props} ref={ref}>
        {children}
      </div>
    )
  },
)
AlertDescription.displayName = "AlertDescription"

import { Circle } from "lucide-react"

const AlertCircle = Circle

export { Alert, AlertTitle, AlertDescription, AlertCircle }
