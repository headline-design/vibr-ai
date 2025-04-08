"use client"

import { useState } from "react"
import { CornerDownRight, ChevronDown, ChevronUp, MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "./chat-interface"
import { MessageBubbleEnhanced } from "./message-bubble-enhanced"

interface ThreadViewProps {
  parentMessage: ChatMessage
  threadMessages: ChatMessage[]
  onReply: (parentId: string) => void
  onClose: () => void
  onEdit?: (messageId: string, content: string) => void
  onCopy: (content: string) => void
  formatTimestamp: (timestamp?: string) => string
  isMobile: boolean
  className?: string
}

export function ThreadView({
  parentMessage,
  threadMessages,
  onReply,
  onClose,
  onEdit,
  onCopy,
  formatTimestamp,
  isMobile,
  className,
}: ThreadViewProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [draftMessages, setDraftMessages] = useState<Record<string, string>>({})

  // Start editing a message
  const handleStartEdit = (messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setDraftMessages({ ...draftMessages, [messageId]: content })
  }

  // Save edited message
  const handleSaveEdit = (messageId: string) => {
    const editedContent = draftMessages[messageId]
    if (editedContent?.trim() && onEdit) {
      onEdit(messageId, editedContent)
      setEditingMessageId(null)
    }
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingMessageId(null)
  }

  // Toggle thread expansion
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={cn("bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700", className)}
    >
      {/* Thread header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <MessageSquare className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Thread</span>
          <span className="text-gray-400 dark:text-gray-500 ml-2">
            {threadMessages.length} {threadMessages.length === 1 ? "reply" : "replies"}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleExpanded}
            aria-label={isExpanded ? "Collapse thread" : "Expand thread"}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose} aria-label="Close thread">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Parent message */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center mb-2 text-xs text-gray-500 dark:text-gray-400">
          <CornerDownRight className="h-3.5 w-3.5 mr-1.5" />
          <span>Original message</span>
        </div>
        <MessageBubbleEnhanced
          message={parentMessage}
          isFirstInGroup={true}
          isEditing={editingMessageId === parentMessage.id}
          draftContent={draftMessages[parentMessage.id] || parentMessage.content}
          onEditChange={(content) => setDraftMessages({ ...draftMessages, [parentMessage.id]: content })}
          onSaveEdit={() => handleSaveEdit(parentMessage.id)}
          onCancelEdit={handleCancelEdit}
          onCopy={() => onCopy(parentMessage.content)}
          onEdit={
            parentMessage.role === "user" && onEdit
              ? () => handleStartEdit(parentMessage.id, parentMessage.content)
              : undefined
          }
          formatTimestamp={formatTimestamp}
          isLastInGroup={true}
          isMobile={isMobile}
        />
      </div>

      {/* Thread messages */}
      {isExpanded && (
        <div className="p-3 space-y-3">
          {threadMessages.length > 0 ? (
            threadMessages.map((message) => (
              <MessageBubbleEnhanced
                key={message.id}
                message={message}
                isFirstInGroup={true}
                isEditing={editingMessageId === message.id}
                draftContent={draftMessages[message.id] || message.content}
                onEditChange={(content) => setDraftMessages({ ...draftMessages, [message.id]: content })}
                onSaveEdit={() => handleSaveEdit(message.id)}
                onCancelEdit={handleCancelEdit}
                onCopy={() => onCopy(message.content)}
                onEdit={
                  message.role === "user" && onEdit ? () => handleStartEdit(message.id, message.content) : undefined
                }
                formatTimestamp={formatTimestamp}
                isLastInGroup={true}
                isMobile={isMobile}
              />
            ))
          ) : (
            <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
              No replies in this thread yet
            </div>
          )}

          {/* Reply button */}
          <div className="mt-3 flex justify-center">
            <Button variant="outline" size="sm" onClick={() => onReply(parentMessage.id)} className="text-xs">
              <CornerDownRight className="h-3.5 w-3.5 mr-1.5" />
              Reply to thread
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
