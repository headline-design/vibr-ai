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
        "fixed bottom-6 right-6 h-14 w-14 rounded-lg shadow-md z-50 p-0 transition-all duration-300 hover:shadow-lg",
        isOpen ? "bg-background hover:bg-muted border" : "bg-background hover:bg-muted border",
        className,
      )}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? <X className="!h-5 !w-5 text-foreground flex-shrink-0" /> : <MessageSquare className="!h-5 !w-5 text-foreground flex-shrink-0" />}
    </Button>
  )
}
