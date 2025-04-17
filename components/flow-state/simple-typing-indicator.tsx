"use client"

import { cn } from "@/lib/utils"

interface SimpleTypingIndicatorProps {
  className?: string
}

export function SimpleTypingIndicator({ className }: SimpleTypingIndicatorProps) {
  // Add a style tag for the custom animation
  const fadeInOutStyle = `
    @keyframes fadeInOut {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
  `

  return (
    <>
      <style>{fadeInOutStyle}</style>
      <div className={cn("inline-flex items-center", className)}>
        <span className="text-xs text-muted-foreground mr-2 font-medium">Typing</span>
        <div className="flex space-x-1.5">
          <div
            className="h-1.5 w-1.5 bg-gray-400 dark:bg-gray-500 rounded-full opacity-40"
            style={{ animation: "fadeInOut 1.5s infinite", animationDelay: "0ms" }}
          />
          <div
            className="h-1.5 w-1.5 bg-gray-400 dark:bg-gray-500 rounded-full opacity-40"
            style={{ animation: "fadeInOut 1.5s infinite", animationDelay: "300ms" }}
          />
          <div
            className="h-1.5 w-1.5 bg-gray-400 dark:bg-gray-500 rounded-full opacity-40"
            style={{ animation: "fadeInOut 1.5s infinite", animationDelay: "600ms" }}
          />
        </div>
      </div>
    </>
  )
}
