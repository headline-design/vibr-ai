"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ThumbsUp, ThumbsDown, SmilePlus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageReactionsProps {
  messageId: string
  existingReactions?: { emoji: string; count: number; userReacted: boolean }[]
  onReact: (messageId: string, emoji: string) => void
  className?: string
}

export function MessageReactions({ messageId, existingReactions = [], onReact, className }: MessageReactionsProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Common reaction emojis
  const quickReactions = ["👍", "👎", "❤️", "😂", "😮", "🎉", "🤔"]

  // Handle reaction click
  const handleReaction = (emoji: string) => {
    onReact(messageId, emoji)
    setShowEmojiPicker(false)
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {/* Display existing reactions */}
      {existingReactions.map((reaction) => (
        <Button
          key={reaction.emoji}
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 px-1.5 rounded-full text-xs",
            reaction.userReacted
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
          )}
          onClick={() => handleReaction(reaction.emoji)}
        >
          <span className="mr-1">{reaction.emoji}</span>
          <span>{reaction.count}</span>
        </Button>
      ))}

      {/* Quick reactions */}
      <div className="flex items-center space-x-1">
        {existingReactions.length === 0 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => handleReaction("👍")}
              aria-label="Like"
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => handleReaction("👎")}
              aria-label="Dislike"
            >
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </>
        )}

        {/* Add reaction button */}
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Add reaction"
            >
              <SmilePlus className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="grid grid-cols-7 gap-1">
              {quickReactions.map((emoji) => (
                <button
                  key={emoji}
                  className="h-8 w-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  onClick={() => handleReaction(emoji)}
                  aria-label={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
