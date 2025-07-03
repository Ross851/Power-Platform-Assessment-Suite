"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ResponsiveWrapperProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  sidebarTitle?: string
  className?: string
}

export function ResponsiveWrapper({
  children,
  sidebar,
  sidebarTitle = "Navigation",
  className,
}: ResponsiveWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (!isTablet) {
      setSidebarOpen(false)
    }
  }, [isTablet])

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    const handleRouteChange = () => {
      if (isMobile) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("popstate", handleRouteChange)
    return () => window.removeEventListener("popstate", handleRouteChange)
  }, [isMobile])

  return (
    <div className={cn("flex h-full relative", className)}>
      {/* Mobile Menu Button */}
      {isTablet && sidebar && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={sidebarOpen}
          aria-controls="mobile-sidebar"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Sidebar */}
      {sidebar && (
        <>
          {/* Mobile Overlay */}
          {isTablet && sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Sidebar Content */}
          <aside
            id="mobile-sidebar"
            className={cn(
              "w-64 sm:w-72 lg:w-80 flex-shrink-0 bg-background border-r h-full overflow-y-auto",
              isTablet && "fixed left-0 top-0 z-40 transition-transform duration-300",
              isTablet && !sidebarOpen && "-translate-x-full"
            )}
            aria-label={sidebarTitle}
          >
            <div className="sticky top-0 bg-background z-10 p-4 border-b">
              <h2 className="text-lg font-semibold">{sidebarTitle}</h2>
            </div>
            <div className="p-4">{sidebar}</div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 overflow-y-auto",
          isTablet && sidebar && "w-full",
          !isTablet && sidebar && "ml-0"
        )}
      >
        <div className={cn("h-full", isTablet && sidebar && "pt-16")}>{children}</div>
      </main>
    </div>
  )
}

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  className?: string
}

export function ResponsiveGrid({
  children,
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className,
}: ResponsiveGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  }

  return (
    <div
      className={cn(
        "grid",
        gridCols[cols.default || 1],
        cols.sm && `sm:${gridCols[cols.sm]}`,
        cols.md && `md:${gridCols[cols.md]}`,
        cols.lg && `lg:${gridCols[cols.lg]}`,
        cols.xl && `xl:${gridCols[cols.xl]}`,
        `gap-${gap}`,
        className
      )}
    >
      {children}
    </div>
  )
}