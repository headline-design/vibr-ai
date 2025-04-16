"use client"


import { motion } from "framer-motion"
import { Check, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFlowState } from "@/components/flow-state/providers/flow-state-provider"
import Link from "next/link"
import React from "react"

interface MessageActionsProps {
  content: string
  actions?: Array<{
    type?: "local" | "response"
    id: string
    label: string
    variant?: "default" | "outline" | "secondary" | "destructive"
    route?: string
  }>
  className?: string
  position?: "top" | "bottom" | "inline"
}

const MessageActions: React.FC<MessageActionsProps> = ({ actions, content, className, position = "inline" }) => {
  const { handleSendMessage } = useFlowState()
  const [copied, setCopied] = React.useState(false)

  const handleLocalAction = (action: { id: string; label: string; variant?: string }) => {
    // Handle local action here
    switch (action.id) {
      case "copy":
        navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 2000)
        break
    }
  }

  // For binary choices (yes/no), use checkmark and X icons
  const isBinary =
    actions &&
    actions.length === 2 &&
    actions.some((a) => ["yes", "y", "confirm", "ok", "sure"].includes(a.id.toLowerCase())) &&
    actions.some((a) => ["no", "n", "cancel", "decline"].includes(a.id.toLowerCase()))

  // Check if the action is a copy action
  const isCopyAction = actions?.some((action) => action.id === "copy")

  // Position classes
  const positionClasses = {
    top: "-top-3 right-0",
    bottom: "-bottom-3 right-0",
    inline: "relative top-0 right-0 mt-2",
  }

  return (
    <>
      <motion.div
        className={cn(
          "absolute flex flex-wrap gap-2 rounded-md p-0.5 z-10",
          positionClasses[position],
          className,
        )}
        initial={{ opacity: 0, y: 5, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 5, scale: 0.95 }}
        transition={{ duration: 0.15, type: "spring", stiffness: 500, damping: 25 }}
      >
        {actions &&
          actions.map((action) => {
            const isPositive = ["yes", "y", "confirm", "ok", "sure"].includes(action.id.toLowerCase())
            const isNegative = ["no", "n", "cancel", "decline"].includes(action.id.toLowerCase())

            return action.route ? (
              <Link href={action.route} key={action.id}>
                <Button
                  size="sm"
                  variant={action.variant || (isPositive ? "default" : isNegative ? "outline" : "secondary")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
                    isPositive && "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 shadow-sm",
                    isNegative && "hover:bg-gray-100 border-gray-300 dark:border-gray-600",
                  )}
                >
                  {isBinary && isPositive && <Check className="h-3.5 w-3.5 mr-1.5" />}
                  {isBinary && isNegative && <XCircle className="h-3.5 w-3.5 mr-1.5" />}
                  {action.label}
                </Button>
              </Link>
            ) : (



              <Button
                size="sm"
                key={action.id}
                variant={action.variant || (isPositive ? "default" : isNegative ? "outline" : "secondary")}
                onClick={() => {
                  if (action.type !== "local") {
                    handleSendMessage(action.label)
                  }
                  else {
                    handleLocalAction(action)
                  }
                }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
                  isPositive &&
                  "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 shadow-sm",
                  isNegative && "hover:bg-gray-100 border-gray-300 dark:border-gray-600",
                )}
              >
                {isBinary && isPositive && <Check className="h-3.5 w-3.5 mr-1.5" />}
                {isBinary && isNegative && <XCircle className="h-3.5 w-3.5 mr-1.5" />}
                {isCopyAction && copied ? (
                  <span className="text-green-600">Copied!</span>
                ) : (
                  action.label
                )}
              </Button>
            )
          })}
      </motion.div>
    </>
  )
}

export default MessageActions
