"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, RefreshCw, Copy, ThumbsUp, ThumbsDown, MoreHorizontal, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { ChatRole } from "@/components/flow-state/chat-interface"

interface BubbleActionsProps {
  messageId: string
  role: ChatRole
  onEdit?: () => void
  onRegenerate?: () => void
  onCopy?: () => void
  onLike?: () => void
  onDislike?: () => void
  onMore?: () => void
  className?: string
  position?: "top" | "bottom" | "inline"
  showLabels?: boolean
  isLiked?: boolean
  isDisliked?: boolean
  isCopied?: boolean
}

const BubbleActions: React.FC<BubbleActionsProps> = ({
  messageId,
  role,
  onEdit,
  onRegenerate,
  onCopy,
  onLike,
  onDislike,
  onMore,
  className,
  position = "top",
  showLabels = false,
  isLiked = false,
  isDisliked = false,
  isCopied = false,
}) => {
  const isUser = role === "user"
  const isAssistant = role === "assistant"
  const [localCopied, setLocalCopied] = useState(false)

  // Handle copy with visual feedback
  const handleCopy = () => {
    if (onCopy) {
      onCopy()
      setLocalCopied(true)
      setTimeout(() => setLocalCopied(false), 2000)
    }
  }

  // Position classes
  const positionClasses = {
    top: "-top-3 right-0",
    bottom: "-bottom-3 right-0",
    inline: "relative top-0 right-0 mt-2",
  }

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        className={cn(
          "absolute flex items-center gap-0.5 bg-background rounded-md shadow-sm border border-border p-0.5 z-10",
          positionClasses[position],
          className,
        )}
        initial={{ opacity: 0, y: 5, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 5, scale: 0.95 }}
        transition={{ duration: 0.15, type: "spring", stiffness: 500, damping: 25 }}
      >
        {isUser && onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className={cn(
                  "h-7 w-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted",
                  "transition-colors duration-150",
                  "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
                )}
                aria-label="Edit message"
              >
                <Edit className="h-3.5 w-3.5" />
                {showLabels && <span className="ml-1.5 text-xs">Edit</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={5} className="text-xs">
              Edit message
            </TooltipContent>
          </Tooltip>
        )}

        {isAssistant && onRegenerate && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRegenerate}
                className={cn(
                  "h-7 w-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted",
                  "transition-colors duration-150",
                  "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
                )}
                aria-label="Regenerate response"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {showLabels && <span className="ml-1.5 text-xs">Regenerate</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={5} className="text-xs">
              Regenerate response
            </TooltipContent>
          </Tooltip>
        )}

        {isAssistant && onCopy && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className={cn(
                  "h-7 w-7 rounded-sm hover:bg-muted transition-colors duration-150",
                  "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
                  localCopied || isCopied
                    ? "text-success hover:text-success"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-label="Copy to clipboard"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={localCopied || isCopied ? "check" : "copy"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {localCopied || isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </motion.div>
                </AnimatePresence>
                {showLabels && <span className="ml-1.5 text-xs">{localCopied || isCopied ? "Copied" : "Copy"}</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={5} className="text-xs">
              {localCopied || isCopied ? "Copied!" : "Copy to clipboard"}
            </TooltipContent>
          </Tooltip>
        )}

        {isAssistant && onLike && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLike}
                className={cn(
                  "h-7 w-7 rounded-sm hover:bg-muted transition-colors duration-150",
                  "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
                  isLiked ? "text-success hover:text-success" : "text-muted-foreground hover:text-foreground",
                )}
                aria-label="Like response"
                aria-pressed={isLiked}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                {showLabels && <span className="ml-1.5 text-xs">Like</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={5} className="text-xs">
              {isLiked ? "Liked" : "Like response"}
            </TooltipContent>
          </Tooltip>
        )}

        {isAssistant && onDislike && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDislike}
                className={cn(
                  "h-7 w-7 rounded-sm hover:bg-muted transition-colors duration-150",
                  "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
                  isDisliked
                    ? "text-destructive hover:text-destructive"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-label="Dislike response"
                aria-pressed={isDisliked}
              >
                <ThumbsDown className="h-3.5 w-3.5" />
                {showLabels && <span className="ml-1.5 text-xs">Dislike</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={5} className="text-xs">
              {isDisliked ? "Disliked" : "Dislike response"}
            </TooltipContent>
          </Tooltip>
        )}

        {onMore && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onMore}
                className={cn(
                  "h-7 w-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted",
                  "transition-colors duration-150",
                  "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
                )}
                aria-label="More options"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
                {showLabels && <span className="ml-1.5 text-xs">More</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={5} className="text-xs">
              More options
            </TooltipContent>
          </Tooltip>
        )}
      </motion.div>
    </TooltipProvider>
  )
}

export default BubbleActions
