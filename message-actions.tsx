"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Edit, ThumbsUp, ThumbsDown, Share, Repeat, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { ChatMessage } from "./chat-interface-type"

interface MessageActionsProps {
  message: ChatMessage
  onEdit?: () => void
  onCopy: () => void
  onShare?: () => void
  onRegenerate?: () => void
}

export function MessageActions({ message, onEdit, onCopy, onShare, onRegenerate }: MessageActionsProps) {
  const [showActions, setShowActions] = useState(false)
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null)

  const isUser = message.role === "user"
  const isAssistant = message.role === "assistant"

  return (
    <motion.div
      className="flex items-center mt-2 space-x-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {isAssistant && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 text-gray-400 hover:text-gray-600 ${reaction === "like" ? "text-green-500" : ""}`}
                  onClick={() => setReaction(reaction === "like" ? null : "like")}
                  aria-label="Like message"
                  aria-pressed={reaction === "like"}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Like</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 text-gray-400 hover:text-gray-600 ${reaction === "dislike" ? "text-red-500" : ""}`}
                  onClick={() => setReaction(reaction === "dislike" ? null : "dislike")}
                  aria-label="Dislike message"
                  aria-pressed={reaction === "dislike"}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Dislike</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {onRegenerate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-gray-600"
                    onClick={onRegenerate}
                    aria-label="Regenerate response"
                  >
                    <Repeat className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Regenerate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
              onClick={onCopy}
              aria-label="Copy message"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Copy</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isUser && onEdit && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
                onClick={onEdit}
                aria-label="Edit message"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {onShare && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
                onClick={onShare}
                aria-label="Share message"
              >
                <Share className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-gray-600"
            aria-label="More options"
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-0" align="end">
          <div className="flex flex-col py-1">
            <button className="px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800">
              Report message
            </button>
            <button className="px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800">Translate</button>
            <button className="px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800">Summarize</button>
          </div>
        </PopoverContent>
      </Popover>
    </motion.div>
  )
}
