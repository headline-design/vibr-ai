"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FluxFloatingButtonProps {
  onClick: () => void
  isOpen: boolean
  className?: string
}

export function FluxFloatingButton({ onClick, isOpen, className }: FluxFloatingButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 p-0 transition-all duration-300 hover:shadow-xl transform hover:scale-105",
        isOpen ? "bg-gray-700 hover:bg-gray-800" : "bg-blue-600 hover:bg-blue-700",
        className,
      )}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
    </Button>
  )
}
