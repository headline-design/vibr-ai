"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  X,
  Copy,
  Edit,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Share,
  MoreHorizontal,
  Check,
  ExternalLink,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MarkdownRenderer } from "./markdown-renderer"
import type { ChatMessage } from "./chat-interface"
import { MessageActionButtons } from "./message-actions-buttons"
import { Badge } from "@/components/ui/badge"

interface MessageBubbleEnhancedProps {
  message: ChatMessage
  isFirstInGroup: boolean
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
  isLastInGroup: boolean
  isMobile: boolean
}

// Declare editingMessageId, you might want to manage this state in a parent component and pass it down
const editingMessageId: string | null = null

export function MessageBubbleEnhanced({
  message,
  isFirstInGroup,
  isEditing,
  draftContent,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onCopy,
  onEdit,
  onRegenerate,
  onShare,
  onAction,
  formatTimestamp,
  isLastInGroup,
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

  return (
    <div
      className={cn(
        "relative leading-relaxed break-words p-3 flex flex-col text-sm transition-all duration-200",
        "rounded-lg shadow-sm",
        {
          "max-w-[85%] sm:max-w-[75%]": isUser || isAssistant,
          "max-w-full": isSystem,
          "bg-blue-50/90 text-gray-800 border border-blue-100/80 hover:border-blue-200/90": isUser,
          "bg-gray-50/90 text-gray-800 border border-gray-200/80 hover:border-gray-300/90": isAssistant,
          "bg-gray-100/60 text-gray-600 italic": isSystem,
          "dark:bg-gray-800/95 dark:text-white dark:border-gray-700/80 dark:hover:border-gray-600/90": isAssistant,
          "dark:bg-blue-900/30 dark:text-white dark:border-blue-900/50 dark:hover:border-blue-800/60": isUser,
          "ring-2 ring-blue-500/70 ring-offset-2 ring-offset-white dark:ring-offset-gray-900":
            editingMessageId === message.id,
        },
      )}
      tabIndex={0}
      aria-label={`${isUser ? "You" : "AI Assistant"}: ${message.content}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {message.isThinking ? (
        <div className="flex items-center space-x-2">
          <span className="font-medium text-xs">Processing your request</span>
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-gray-300 animate-spin" />
        </div>
      ) : (
        <>
          {/* Message header - for special messages */}
          {(hasCitations || hasUrl) && (
            <div className="flex items-center mb-2 -mt-1 -ml-1">
              {hasCitations && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/60"
                >
                  <ExternalLink className="h-2.5 w-2.5 mr-1" />
                  Sources
                </Badge>
              )}
              {hasUrl && !hasCitations && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-4 bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700/60"
                >
                  <ExternalLink className="h-2.5 w-2.5 mr-1" />
                  Link
                </Badge>
              )}
            </div>
          )}

          {/* Editable user text */}
          {isEditing ? (
            <div className="relative">
              <Textarea
                value={draftContent}
                onChange={(e) => onEditChange(e.target.value)}
                className="bg-transparent border border-blue-200 dark:border-blue-800/50 outline-none shadow-none resize-none min-h-[50px] overflow-hidden text-sm p-2 focus:ring-1 focus:ring-blue-500/50 rounded"
                autoFocus
              />
              <div className="absolute top-1 right-1 flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCancelEdit}
                  className="h-6 w-6 rounded-full bg-gray-200/70 hover:bg-gray-300/80 dark:bg-gray-700/70 dark:hover:bg-gray-600/80"
                >
                  <X className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSaveEdit}
                  className="h-6 w-6 rounded-full bg-blue-500/10 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:hover:bg-blue-500/30"
                >
                  <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              {hasMarkdown ? (
                <MarkdownRenderer content={message.content} />
              ) : (
                <div className="whitespace-pre-wrap w-full text-gray-800 dark:text-gray-100 leading-relaxed">
                  {isLongMessage ? truncatedContent : message.content}
                </div>
              )}

              {/* Show more button for long messages */}
              {isLongMessage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullContent(true)}
                  className="mt-2 h-7 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0 self-start"
                >
                  Show more
                </Button>
              )}
            </>
          )}

          {/* Action buttons */}
          {!isEditing && message.actions && message.actions.length > 0 && (
            <MessageActionButtons
              actions={message.actions}
              onAction={(action) => onAction?.(action, message.id)}
              className="mt-3"
            />
          )}

          {/* Timestamp, if present */}
          {message.timestamp && isLastInGroup && (
            <div
              className={cn("mt-1.5 text-[10px] font-medium", {
                "text-gray-400 dark:text-gray-500": isAssistant || isSystem,
                "text-blue-400/80 dark:text-blue-400/70": isUser,
              })}
            >
              {formatTimestamp(message.timestamp)}
            </div>
          )}

          {/* Message actions - only visible on hover */}
          {(isHovered || isMobile) && (
            <div className="flex items-center mt-2 space-x-1">
              {isAssistant && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100/90 dark:hover:bg-gray-800/90 rounded-full transition-colors duration-200",
                            reaction === "like" && "text-green-500 bg-green-50 dark:bg-green-900/20",
                          )}
                          onClick={() => setReaction(reaction === "like" ? null : "like")}
                          aria-label="Helpful response"
                          aria-pressed={reaction === "like"}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs py-1.5 px-2.5 font-medium">
                        <p>Helpful</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-5 w-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-full transition-colors duration-200",
                            reaction === "dislike" && "text-red-500 bg-red-50 dark:bg-red-900/20",
                          )}
                          onClick={() => setReaction(reaction === "dislike" ? null : "dislike")}
                          aria-label="Unhelpful response"
                          aria-pressed={reaction === "dislike"}
                        >
                          <ThumbsDown className="h-2.5 w-2.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Not helpful</p>
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
                            className="h-5 w-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-full transition-colors duration-200"
                            onClick={onRegenerate}
                            aria-label="Regenerate response"
                          >
                            <RotateCcw className="h-2.5 w-2.5" />
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
                      className="h-5 w-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-full transition-colors duration-200"
                      onClick={onCopy}
                      aria-label="Copy message"
                    >
                      <Copy className="h-2.5 w-2.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Edit button */}
              {isUser && onEdit && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-full transition-colors duration-200"
                        onClick={onEdit}
                        aria-label="Edit message"
                      >
                        <Edit className="h-2.5 w-2.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs py-1 px-2">
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
                        className="h-5 w-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-full transition-colors duration-200"
                        onClick={onShare}
                        aria-label="Share message"
                      >
                        <Share className="h-2.5 w-2.5" />
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
                    className="h-5 w-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-full transition-colors duration-200"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="h-2.5 w-2.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-0" align="end">
                  <div className="flex flex-col py-1">
                    <button className="px-3 py-2 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                      Report message
                    </button>
                    <button className="px-3 py-2 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                      Translate
                    </button>
                    <button className="px-3 py-2 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                      Summarize
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </>
      )}
    </div>
  )
}
