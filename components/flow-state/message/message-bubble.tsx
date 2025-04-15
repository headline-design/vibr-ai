"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { X, Check } from "lucide-react"
import { MarkdownRenderer } from "@/components/flow-state/markdown-renderer"
import type { ChatMessage } from "@/components/flow-state/chat-interface"
import { motion } from "framer-motion"
import React from "react"
import MessageActions from "./message-actions"
import BubbleActions from "./bubble-actions"

interface MessageBubbleEnhancedProps {
  message: ChatMessage
  isFirstInGroup: boolean
  hasCode?: boolean
  setSelectedMessageId: (id: string | null) => void
  selectedMessageId: string | null
  draftContent: string
  onEditChange: (content: string) => void
  onSaveEdit: (messageId: string) => void
  onCancelEdit: () => void
  handleRegenerate: (messageId: string) => void
  copiedMessageId: string | null
  copyMessageToClipboard: (content: string, messageId: string) => void
  formatTimestamp: (timestamp?: string) => string
  isMobile: boolean
  messageIndex: number
  group: ChatMessage[]
}

// Declare editingMessageId, you might want to manage this state in a parent component and pass it down
const editingMessageId: string | null = null

export function MessageBubble({
  message,
  isFirstInGroup,
  messageIndex,
  group,
  hasCode = false,
  selectedMessageId,
  setSelectedMessageId,
  draftContent,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  handleRegenerate,
  copiedMessageId,
  copyMessageToClipboard,
  formatTimestamp,
  isMobile,
}: MessageBubbleEnhancedProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null)
  const [showFullContent, setShowFullContent] = useState(false)

  const isUser = message.role === "user"
  const isAssistant = message.role === "assistant"
  const isSystem = message.role === "system"
  const hasMarkdown =
    isAssistant &&
    (message.content.includes("```") ||
      message.content.includes("`") ||
      message.content.includes("#") ||
      message.content.includes("*") ||
      message.content.includes("[") ||
      message.content.includes("|") ||
      message.content.includes("- "))

  // Check if message is long and should be truncated
  const isLongMessage = message.content.length > 500 && !showFullContent && !hasMarkdown
  const truncatedContent = isLongMessage ? message.content.substring(0, 500) + "..." : message.content

  // Check if message has citations
  const hasCitations =
    message.content.includes("[1]") || message.content.includes("[2]") || message.content.includes("[source]")

  // Check if message has a URL
  const hasUrl = message.content.match(/https?:\/\/[^\s]+/)
  const extractedUrl = hasUrl ? hasUrl[0] : null

  const saveEditedMessage = (messageId: string) => {
    onSaveEdit(messageId)
  }

  const startEditMessage = (messageId: string, content: string) => {
    setSelectedMessageId(messageId)
    onEditChange(content)
  }

  return (
    <div
      className={cn(
        "relative leading-relaxed break-words p-2.5 sm:p-3.5 shadow-sm flex flex-col transition-all duration-200",
        "rounded-2xl hover:shadow-md transition-shadow duration-200",
        "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
        {
          "max-w-[85%] sm:max-w-[75%] md:max-w-[70%]": isUser || isAssistant,
          "max-w-full": isSystem,
          "bg-gradient-to-br from-primary/10 to-primary/15 text-foreground border border-primary/20": isUser,
          "bg-muted text-foreground border border-border": isAssistant,
          "bg-muted/50 text-muted-foreground italic border-transparent": isSystem,
          "rounded-tr-sm": isUser && !isFirstInGroup, // Connected bubble effect for consecutive messages
          "rounded-tl-sm": isAssistant && !isFirstInGroup,
          "dark:bg-muted dark:text-foreground dark:border-neutral-700": isAssistant, // Dark mode support
          "dark:bg-primary/30 dark:text-foreground dark:border-primary/30": isUser,
          "dark:bg-muted/50 dark:text-foreground/70 dark:border-transparent": isSystem,
        },
      )}
      tabIndex={0}
      aria-label={`${isUser ? "Your message" : "Assistant's response"}: ${message.content.substring(0, 50)}...`}
      onMouseEnter={() => setSelectedMessageId(message.id)}
      onMouseLeave={() => setSelectedMessageId(null)}
    >
      {message.isThinking ? (
        <div className="flex items-center space-x-1.5">
          <span className="font-medium text-xs">Processing your request</span>
          <div className="flex space-x-1 items-center">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-gray-400"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-gray-400"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.15 }}
            />
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-gray-400"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Editable user text */}
          {editingMessageId === message.id ? (
            <div className="relative">
              <Textarea
                value={draftContent || ""}
                onChange={(e) => onEditChange(e.target.value)}
                className="bg-transparent border border-muted outline-none shadow-none resize-none min-h-[50px] overflow-hidden text-sm p-0 focus:ring-1 focus:ring-blue-500/50 rounded"
                autoFocus
              />
              <div className="absolute top-0 right-0 flex space-x-1 p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCancelEdit}
                  className="h-6 w-6 rounded-full bg-muted/50 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => saveEditedMessage(message.id)}
                  className="h-6 w-6 rounded-full bg-blue-500/10 hover:bg-blue-500/20"
                >
                  <Check className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={cn("whitespace-pre-wrap", {
                "prose prose-sm max-w-none dark:prose-invert": hasCode && isAssistant,
                "prose-code:bg-background prose-code:border prose-code:border-border/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:font-medium prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg":
                  hasCode && isAssistant,
              })}
            >
              {/* Inside the message content rendering */}
              {message.isThinking ? (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-600"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-600"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-600"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">Thinking...</span>
                </div>
              ) : hasCode && isAssistant ? (
                <MarkdownRenderer content={message.content} />
              ) : message.component ? (
                <div className="my-2">{React.createElement(message.component, message.componentProps)}</div>
              ) : (
                <div className="text-sm leading-relaxed">{message.content}</div>
              )}
            </div>
          )}

          {/* Timestamp, if present */}
          {message.timestamp && messageIndex === group.length - 1 && (
            <motion.div
              className={cn("mt-1 text-[11px]", {
                "text-foreground/60": isAssistant || isSystem || isUser,
              })}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatTimestamp(message.timestamp)}
            </motion.div>
          )}

          {/* Bubble actions - General actions for all messages and only visible on hover or when selected */}
          {(selectedMessageId === message.id || isMobile) && (
            <BubbleActions
              messageId={message.id}
              role={message.role}
              onEdit={isUser ? () => startEditMessage(message.id, message.content) : undefined}
              onRegenerate={isAssistant ? () => handleRegenerate(message.id) : undefined}
              onCopy={isAssistant ? () => copyMessageToClipboard(message.content, message.id) : undefined}
            />
          )}
          {copiedMessageId === message.id && (
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0, 1, 0] }}
              className="absolute -top-8 right-0 bg-foreground text-background text-xs py-1 px-2 rounded"
            >
              Copied!
            </motion.div>
          )}

          {/* Message actions - In-message or message-specific actions */}
          {message.actions && <MessageActions actions={message.actions} content={message.content}/>}
        </>
      )}
    </div>
  )
}
