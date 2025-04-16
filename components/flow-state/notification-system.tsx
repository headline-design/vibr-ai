"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, InfoIcon, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type NotificationType = "success" | "error" | "info" | "warning"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number // in milliseconds, default is 5000
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationItemProps {
  notification: Notification
  onDismiss: (id: string) => void
}

function NotificationItem({ notification, onDismiss }: NotificationItemProps) {
  const { id, type, title, message, action, duration = 5000 } = notification

  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onDismiss])

  // Icon based on notification type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
      case "info":
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
    }
  }

  // Background color based on notification type
  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30"
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30"
      case "warning":
        return "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30"
      case "info":
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30"
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn("w-full max-w-sm rounded-lg shadow-md border p-4 mb-3", getBgColor())}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">{getIcon()}</div>
        <div className="flex-1 pt-0.5">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{message}</p>
          {action && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className="h-7 text-xs bg-background"
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 -mt-1 -mr-1"
          onClick={() => onDismiss(id)}
          aria-label="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  )
}

interface NotificationSystemProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
  className?: string
}

export function NotificationSystem({
  notifications,
  onDismiss,
  position = "top-right",
  className,
}: NotificationSystemProps) {
  // Position classes
  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4"
      case "bottom-right":
        return "bottom-4 right-4"
      case "bottom-left":
        return "bottom-4 left-4"
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2"
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2"
      case "top-right":
      default:
        return "top-4 right-4"
    }
  }

  return (
    <div
      className={cn("fixed z-50 flex flex-col items-end max-w-sm w-full", getPositionClasses(), className)}
      aria-live="polite"
    >
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setNotifications((prev) => [...prev, { ...notification, id }])
    return id
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAllNotifications,
  }
}
