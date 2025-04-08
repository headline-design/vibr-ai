"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface EnhancedTypingIndicatorProps {
  className?: string
  variant?: "default" | "minimal" | "bubble"
}

export function EnhancedTypingIndicator({ className, variant = "default" }: EnhancedTypingIndicatorProps) {
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
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

  if (variant === "bubble") {
    return (
      <div className={cn("inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg", className)}>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">Typing</span>
        <div className="flex space-x-1">
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
          />
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
          />
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.4 }}
          />
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 mr-2">
        <div className="relative h-3 w-3">
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500 dark:bg-blue-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
            style={{ opacity: 0.3 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500 dark:bg-blue-400"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
            style={{ opacity: 0.2 }}
          />
          <div className="absolute inset-0 rounded-full bg-blue-500 dark:bg-blue-400" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">AI is typing</span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400">This may take a moment</span>
      </div>
    </div>
  )
}
