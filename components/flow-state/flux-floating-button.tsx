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
        "fixed bottom-6 right-6 h-12 w-12 rounded-md shadow-md z-50 p-0 transition-all duration-300 hover:shadow-lg",
        isOpen ? "bg-neutral-800 hover:bg-neutral-900" : "bg-neutral-900 hover:bg-black",
        className,
      )}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
    </Button>
  )
}
