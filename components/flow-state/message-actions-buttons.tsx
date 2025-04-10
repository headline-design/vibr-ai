"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageActionButtonsProps {
  actions: Array<{
    id: string
    label: string
    variant?: "default" | "secondary"  | "outline" | "destructive"
  }>
  onAction: (actionId: string) => void
  className?: string
}

export function MessageActionButtons({ actions, onAction, className }: MessageActionButtonsProps) {
  if (!actions || actions.length === 0) return null

  // For binary choices (yes/no), use checkmark and X icons
  const isBinary =
    actions.length === 2 &&
    actions.some((a) => ["yes", "y", "confirm", "ok", "sure"].includes(a.id.toLowerCase())) &&
    actions.some((a) => ["no", "n", "cancel", "decline"].includes(a.id.toLowerCase()))

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((action) => {
        const isPositive = ["yes", "y", "confirm", "ok", "sure"].includes(action.id.toLowerCase())
        const isNegative = ["no", "n", "cancel", "decline"].includes(action.id.toLowerCase())

        return (
          <Button
            key={action.id}
            size="sm"
            variant={action.variant || (isPositive ? "default" : isNegative ? "outline" : "secondary")}
            onClick={() => onAction(action.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
              isPositive && "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 shadow-sm",
              isNegative && "hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600",
            )}
          >
            {isBinary && isPositive && <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />}
            {isBinary && isNegative && <XCircle className="h-3.5 w-3.5 mr-1.5" />}
            {action.label}
          </Button>
        )
      })}
    </div>
  )
}
