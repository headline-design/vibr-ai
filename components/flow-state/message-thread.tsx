"use client"

import { useState } from "react"
import { MessageBubble } from "./message-bubble"
import { Button } from "@/components/ui/button"
import { CornerDownRight, ChevronDown, ChevronUp } from "lucide-react"
import type { ChatMessage } from "./chat-interface"

interface MessageThreadProps {
  messages: ChatMessage[]
  parentMessage?: ChatMessage
  onReply: (parentId: string) => void
  onEdit: (messageId: string, content: string) => void
  onCopy: (content: string) => void
  formatTimestamp: (timestamp?: string) => string
  isMobile: boolean
}

export function MessageThread({
  messages,
  parentMessage,
  onReply,
  onEdit,
  onCopy,
  formatTimestamp,
  isMobile,
}: MessageThreadProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [draftMessages, setDraftMessages] = useState<Record<string, string>>({})

  // Filter thread messages
  const threadMessages = parentMessage ? messages.filter((msg) => msg.parentId === parentMessage.id) : []

  // Start editing a message
  const handleStartEdit = (messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setDraftMessages({ ...draftMessages, [messageId]: content })
  }

  // Save edited message
  const handleSaveEdit = (messageId: string) => {
    const editedContent = draftMessages[messageId]
    if (editedContent?.trim()) {
      onEdit(messageId, editedContent)
      setEditingMessageId(null)
    }
    onEdit(messageId, editedContent)
    setEditingMessageId(null)
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingMessageId(null)
  }

  // Toggle thread expansion
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  if (!parentMessage) return null

  return (
    <div className="ml-8 pl-4 border-l-2 border-gray-200 dark:border-gray-700 my-2">
      {/* Parent message reference */}
      <div className="flex items-center mb-2 text-xs text-gray-500 dark:text-gray-400">
        <CornerDownRight className="h-3 w-3 mr-1" />
        <span>
          Thread with {threadMessages.length} {threadMessages.length === 1 ? "reply" : "replies"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 ml-1"
          onClick={toggleExpanded}
          aria-label={isExpanded ? "Collapse thread" : "Expand thread"}
        >
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      </div>

      {/* Thread messages */}
      {isExpanded && (
        <div className="space-y-2">
          {threadMessages.map((message, index) => {
            const isUser = message.role === "user"
            const isAssistant = message.role === "assistant"
            const isEditing = editingMessageId === message.id

            return (
              <div key={message.id} className="flex">
                <MessageBubble
                  message={message}
                  isFirstInGroup={true}
                  isEditing={isEditing}
                  draftContent={draftMessages[message.id] || message.content}
                  onEditChange={(content) => setDraftMessages({ ...draftMessages, [message.id]: content })}
                  onSaveEdit={() => handleSaveEdit(message.id)}
                  onCancelEdit={handleCancelEdit}
                  onCopy={() => onCopy(message.content)}
                  onEdit={isUser ? () => handleStartEdit(message.id, message.content) : undefined}
                  formatTimestamp={formatTimestamp}
                  isLastInGroup={true}
                  isMobile={isMobile}
                />
              </div>
            )
          })}

          {/* Reply button */}
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => onReply(parentMessage.id)}
            >
              <CornerDownRight className="h-3 w-3 mr-1" />
              Reply to thread
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
