import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Debounce hook for input handlers
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Throttle hook for scroll/resize handlers
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef(0)
  const timeout = useRef<NodeJS.Timeout>()

  return useCallback(
    ((...args) => {
      const now = Date.now()
      const timeSinceLastCall = now - lastCall.current

      if (timeSinceLastCall >= delay) {
        lastCall.current = now
        callback(...args)
      } else {
        clearTimeout(timeout.current)
        timeout.current = setTimeout(() => {
          lastCall.current = Date.now()
          callback(...args)
        }, delay - timeSinceLastCall)
      }
    }) as T,
    [callback, delay]
  )
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return isIntersecting
}

/**
 * Virtual scrolling hook for large lists
 */
interface VirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function useVirtualScroll<T>(
  items: T[],
  options: VirtualScrollOptions
) {
  const { itemHeight, containerHeight, overscan = 5 } = options
  const [scrollTop, setScrollTop] = useState(0)

  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight)

  const displayStart = Math.max(0, visibleStart - overscan)
  const displayEnd = Math.min(items.length, visibleEnd + overscan)

  const visibleItems = items.slice(displayStart, displayEnd)
  const offsetY = displayStart * itemHeight
  const totalHeight = items.length * itemHeight

  return {
    visibleItems,
    offsetY,
    totalHeight,
    onScroll: (e: React.UIEvent<HTMLElement>) => {
      setScrollTop(e.currentTarget.scrollTop)
    },
  }
}

/**
 * Prefetch component data
 */
export function usePrefetch(url: string) {
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "prefetch"
    link.href = url
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [url])
}

/**
 * Performance metrics tracking
 */
export function usePerformanceMetrics(componentName: string) {
  const renderStart = useRef(performance.now())
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    interactionTime: 0,
  })

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current
    setMetrics((prev) => ({ ...prev, renderTime }))

    // Report to analytics if available
    if (typeof window !== "undefined" && "gtag" in window) {
      ;(window as any).gtag("event", "component_render", {
        component_name: componentName,
        render_time: renderTime,
      })
    }
  }, [componentName])

  const trackInteraction = useCallback((interactionName: string) => {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      setMetrics((prev) => ({ ...prev, interactionTime: duration }))

      // Report to analytics
      if (typeof window !== "undefined" && "gtag" in window) {
        ;(window as any).gtag("event", "component_interaction", {
          component_name: componentName,
          interaction_name: interactionName,
          duration,
        })
      }
    }
  }, [componentName])

  return { metrics, trackInteraction }
}

/**
 * Optimized image loading with blur placeholder
 */
export function useProgressiveImage(src: string, placeholder?: string) {
  const [imgSrc, setImgSrc] = useState(placeholder || src)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImgSrc(src)
      setLoading(false)
    }
  }, [src])

  return { src: imgSrc, loading }
}

/**
 * Memory-efficient state management
 */
export function useMemoryEfficientState<T>(
  initialState: T,
  maxHistorySize = 10
) {
  const [state, setState] = useState(initialState)
  const history = useRef<T[]>([initialState])
  const currentIndex = useRef(0)

  const updateState = useCallback((newState: T | ((prev: T) => T)) => {
    setState((prev) => {
      const nextState = typeof newState === "function" 
        ? (newState as (prev: T) => T)(prev) 
        : newState

      // Trim history if we're not at the end
      if (currentIndex.current < history.current.length - 1) {
        history.current = history.current.slice(0, currentIndex.current + 1)
      }

      // Add new state to history
      history.current.push(nextState)

      // Maintain max history size
      if (history.current.length > maxHistorySize) {
        history.current.shift()
      } else {
        currentIndex.current++
      }

      return nextState
    })
  }, [maxHistorySize])

  const undo = useCallback(() => {
    if (currentIndex.current > 0) {
      currentIndex.current--
      setState(history.current[currentIndex.current])
    }
  }, [])

  const redo = useCallback(() => {
    if (currentIndex.current < history.current.length - 1) {
      currentIndex.current++
      setState(history.current[currentIndex.current])
    }
  }, [])

  return {
    state,
    setState: updateState,
    undo,
    redo,
    canUndo: currentIndex.current > 0,
    canRedo: currentIndex.current < history.current.length - 1,
  }
}