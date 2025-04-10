"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface FluxTypingIndicatorProps {
  isTyping?: boolean
  className?: string
  variant?: "default" | "minimal" | "bubble" | "pulse"
  label?: string
  showLabel?: boolean
  duration?: number
  delay?: number
}

export function FluxTypingIndicator({
  isTyping = false,
  className,
  variant = "default",
  label = "Flux is typing",
  showLabel = true,
  duration = 1.2,
  delay = 0.1,
}: FluxTypingIndicatorProps) {
  const [visible, setVisible] = useState(false)

  // Add a slight delay before showing the typing indicator to avoid flashing
  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isTyping) {
      timeout = setTimeout(() => setVisible(true), 300)
    } else {
      setVisible(false)
    }

    return () => clearTimeout(timeout)
  }, [isTyping])

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex items-center gap-2 text-sm text-muted-foreground",
            variant === "bubble" && "p-2 rounded-lg bg-muted/50 dark:bg-muted/20 backdrop-blur-sm",
            className,
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          {variant === "default" && (
            <div className="flex items-center gap-1 px-2 py-1">
              <motion.span
                className="h-2 w-2 rounded-full bg-primary/60 dark:bg-primary/40"
                animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
                transition={{ duration, repeat: Number.POSITIVE_INFINITY, delay: delay * 0 }}
              />
              <motion.span
                className="h-2 w-2 rounded-full bg-primary/70 dark:bg-primary/50"
                animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
                transition={{ duration, repeat: Number.POSITIVE_INFINITY, delay: delay * 1 }}
              />
              <motion.span
                className="h-2 w-2 rounded-full bg-primary/80 dark:bg-primary/60"
                animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
                transition={{ duration, repeat: Number.POSITIVE_INFINITY, delay: delay * 2 }}
              />
            </div>
          )}

          {variant === "minimal" && (
            <div className="flex items-center gap-1">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: duration * 0.8, repeat: Number.POSITIVE_INFINITY, delay: delay * 0 }}
              />
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: duration * 0.8, repeat: Number.POSITIVE_INFINITY, delay: delay * 1 }}
              />
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: duration * 0.8, repeat: Number.POSITIVE_INFINITY, delay: delay * 2 }}
              />
            </div>
          )}

          {variant === "bubble" && (
            <div className="flex items-end gap-1 h-5">
              <motion.span
                className="h-3 w-3 rounded-full bg-primary/70 dark:bg-primary/50"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: duration * 0.8, repeat: Number.POSITIVE_INFINITY, delay: delay * 0 }}
              />
              <motion.span
                className="h-3 w-3 rounded-full bg-primary/80 dark:bg-primary/60"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: duration * 0.8, repeat: Number.POSITIVE_INFINITY, delay: delay * 1 }}
              />
              <motion.span
                className="h-3 w-3 rounded-full bg-primary/90 dark:bg-primary/70"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: duration * 0.8, repeat: Number.POSITIVE_INFINITY, delay: delay * 2 }}
              />
            </div>
          )}

          {variant === "pulse" && (
            <div className="relative h-6 w-6 flex items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/10"
                animate={{ scale: [0.5, 1.5, 0.5], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: duration * 1.2, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.span
                className="h-3 w-3 rounded-full bg-primary/80 dark:bg-primary/60"
                animate={{ scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: duration * 0.8, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
          )}

          {showLabel && (
            <motion.span
              className="text-xs font-medium text-muted-foreground/80 select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {label}
            </motion.span>
          )}

          {/* Screen reader text */}
          <span className="sr-only">{label || "Assistant is typing a response"}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
