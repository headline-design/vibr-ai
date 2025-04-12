"use client"

import { cn } from "@/lib/utils"
import { MessageBubble } from "./message-bubble"
import type { ChatMessage } from "./chat-interface"
import dynamic from "next/dynamic"

const FluxAvatar = dynamic(() => import("./flux-avatar-enhanced"), { ssr: false })

interface MessageBubbleContainerProps {
  message: ChatMessage
  isFirstInGroup: boolean
  isLastInGroup: boolean
  isEditing: boolean
  draftContent: string
  onEditChange: (content: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onCopy: () => void
  onEdit?: () => void
  onRegenerate?: () => void
  onShare?: () => void
  onAction?: (action: string, messageId: string) => void
  formatTimestamp: (timestamp?: string) => string
  isMobile: boolean
}

export function MessageBubbleContainer({
  message,
  isFirstInGroup,
  isLastInGroup,
  isEditing,
  draftContent,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onCopy,
  onEdit,
  onRegenerate,
  onShare,
  formatTimestamp,
  isMobile,
}: MessageBubbleContainerProps) {
  const isUser = message.role === "user"
  const isAssistant = message.role === "assistant"
  const isSystem = message.role === "system"

  // Determine mood based on message content
  const getMood = () => {
    if (message.isThinking) return "thinking"
    if (message.content.includes("error") || message.content.includes("sorry")) return "sad"
    if (message.content.includes("great") || message.content.includes("success")) return "happy"
    if (message.content.includes("interesting") || message.content.includes("consider")) return "focused"
    return "neutral"
  }

  return (
    <div
      className={cn("flex w-full mb-2", {
        "justify-end": isUser,
        "justify-start": !isUser,
        "mb-4": isLastInGroup, // Add more space after last message in group
      })}
    >
      {/* Assistant indicator - only show for first message in group */}
      {isAssistant && isFirstInGroup && (
        <div className="mr-3 mt-1 flex-shrink-0">
          <FluxAvatar size="sm" mood={getMood()} animate={message.isThinking} />
        </div>
      )}

      {/* Empty space to align messages when no avatar */}
      {isAssistant && !isFirstInGroup && <div className="w-9 flex-shrink-0" aria-hidden="true" />}

      {/* Chat bubble */}
      <MessageBubble
        message={message}
        isFirstInGroup={isFirstInGroup}
        isEditing={isEditing}
        draftContent={draftContent}
        onEditChange={onEditChange}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onCopy={onCopy}
        onEdit={onEdit}
        onRegenerate={onRegenerate}
        onShare={onShare}
        formatTimestamp={formatTimestamp}
        isLastInGroup={isLastInGroup}
        isMobile={isMobile}
      />

      {/* If user bubble, add a simple indicator for first message in group */}
      {isUser && isFirstInGroup && (
        <div className="flex-shrink-0 ml-3 mt-1">
          <div
            className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            aria-hidden="true"
          >
            You
          </div>
        </div>
      )}

      {/* Empty space to align messages when no avatar */}
      {isUser && !isFirstInGroup && <div className="w-9 flex-shrink-0" aria-hidden="true" />}
    </div>
  )
}
