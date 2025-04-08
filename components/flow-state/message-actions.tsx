"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { ThumbsUp, MessageCircle, Flag, Edit, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MessageActionsProps {
  messageId: string
  role: "user" | "assistant" | "system"
  onEdit?: () => void
  onRegenerate?: () => void
}

const MessageActions: React.FC<MessageActionsProps> = ({ messageId, role, onEdit, onRegenerate }) => {
  const [reaction, setReaction] = useState<"like" | null>(null)
  const isAssistant = role === "assistant"
  const isUser = role === "user"

  return (
    <motion.div
      className="flex items-center mt-1.5 space-x-0.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-gray-400 hover:text-gray-600"
        aria-label="Reply to message"
      >
        <MessageCircle className="h-2.5 w-2.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-5 w-5 text-gray-400 hover:text-gray-600 ${reaction === "like" ? "text-green-500" : ""}`}
        onClick={() => setReaction(reaction === "like" ? null : "like")}
        aria-label="Like message"
        aria-pressed={reaction === "like"}
      >
        <ThumbsUp className="h-2.5 w-2.5" />
      </Button>
      {isUser && onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-gray-400 hover:text-gray-600"
          onClick={onEdit}
          aria-label="Edit message"
        >
          <Edit className="h-2.5 w-2.5" />
        </Button>
      )}
      {isAssistant && onRegenerate && (
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-gray-400 hover:text-gray-600"
          onClick={onRegenerate}
          aria-label="Regenerate response"
        >
          <RotateCw className="h-2.5 w-2.5" />
        </Button>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-gray-400 hover:text-gray-600"
            aria-label="More options"
          >
            <Flag className="h-2.5 w-2.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-36 p-0" align="end">
          <div className="flex flex-col py-0.5">
            <button className="px-2.5 py-1.5 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-800">
              Report message
            </button>
            <button className="px-2.5 py-1.5 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-800">
              Translate
            </button>
            <button className="px-2.5 py-1.5 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-800">
              Summarize
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </motion.div>
  )
}

export default MessageActions
