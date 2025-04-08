"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, RefreshCw, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface ConnectionStatusProps {
  className?: string
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowBanner(true)
      // Auto-hide the "back online" banner after 5 seconds
      setTimeout(() => setShowBanner(false), 5000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowBanner(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Attempt to reconnect
  const handleReconnect = () => {
    if (!isOnline) {
      setIsReconnecting(true)

      // Simulate reconnection attempt
      setTimeout(() => {
        setIsReconnecting(false)
        // If we're actually online now, this will be detected by the event listeners
      }, 2000)
    }
  }

  // Don't render anything if online and banner is hidden
  if (isOnline && !showBanner) return null

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-md flex items-center space-x-2",
            isOnline
              ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
              : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
            className,
          )}
        >
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">You're back online</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 ml-2 text-green-600 dark:text-green-400"
                onClick={() => setShowBanner(false)}
                aria-label="Dismiss"
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">You're offline</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-6 text-xs"
                onClick={handleReconnect}
                disabled={isReconnecting}
              >
                {isReconnecting ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    <span>Reconnecting...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    <span>Reconnect</span>
                  </>
                )}
              </Button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
