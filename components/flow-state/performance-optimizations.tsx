"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import { useInView } from "react-intersection-observer"

interface VirtualizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  overscan?: number
  className?: string
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  overscan = 3,
  className,
}: VirtualizedListProps<T>) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate total height of all items
  const totalHeight = items.length * itemHeight

  // Update visible range based on scroll position
  const updateVisibleRange = useCallback(() => {
    if (!containerRef.current) return

    const { scrollTop, clientHeight } = containerRef.current
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const end = Math.min(items.length - 1, Math.ceil((scrollTop + clientHeight) / itemHeight) + overscan)

    setVisibleRange({ start, end })
  }, [itemHeight, items.length, overscan])

  // Set up scroll event listener
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    updateVisibleRange()
    container.addEventListener("scroll", updateVisibleRange)

    return () => {
      container.removeEventListener("scroll", updateVisibleRange)
    }
  }, [updateVisibleRange])

  // Render only visible items
  const visibleItems = items.slice(visibleRange.start, visibleRange.end + 1)

  return (
    <div ref={containerRef} className={className} style={{ height: "100%", overflow: "auto" }}>
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((item, index) => {
          const actualIndex = visibleRange.start + index
          return (
            <div
              key={actualIndex}
              style={{
                position: "absolute",
                top: actualIndex * itemHeight,
                height: itemHeight,
                width: "100%",
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Lazy loading image component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholder?: string
  fallback?: string
}

export function LazyImage({
  src,
  alt,
  placeholder = "/placeholder.svg",
  fallback = "/image-error.svg",
  className,
  ...props
}: LazyImageProps) {
  const [imgSrc, setImgSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (!inView || !src) return

    const img = new Image()
    img.src = src
    img.onload = () => {
      setImgSrc(src)
      setIsLoaded(true)
    }
    img.onerror = () => {
      setImgSrc(fallback)
      setError(true)
    }
  }, [inView, src, fallback])

  return (
    <div ref={ref} className="relative">
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        className={className}
        style={{
          transition: "opacity 0.3s ease",
          opacity: isLoaded ? 1 : 0.5,
        }}
        {...props}
      />
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
}

// Debounce hook for performance optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttle hook for performance optimization
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRan = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRan.current >= limit) {
          setThrottledValue(value)
          lastRan.current = Date.now()
        }
      },
      limit - (Date.now() - lastRan.current),
    )

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}
