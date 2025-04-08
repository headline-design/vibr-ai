"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FluxTypingIndicatorProps {
  className?: string
}

export function FluxTypingIndicator({ className }: FluxTypingIndicatorProps) {
  return (
    <div className={cn("flex items-center space-x-1.5", className)}>
      <motion.div
        className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-600"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
      />
      <motion.div
        className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-600"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          delay: 0.2,
        }}
      />
      <motion.div
        className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-600"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          delay: 0.4,
        }}
      />
    </div>
  )
}
