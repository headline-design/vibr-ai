"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { X, Copy, Edit, ThumbsUp, ThumbsDown, RotateCcw, Share, MoreHorizontal, Check } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MarkdownRenderer } from "./markdown-renderer"
import type { ChatMessage } from "./chat-interface"
import { MessageActionButtons } from "./message-actions-buttons"

interface MessageBubbleProps {
  message: ChatMessage
  isFirstInGroup: boolean
  isEditing: boolean
  draftContent: string
  onEditChange: (content: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onCopy: (content: string) => void
  onEdit?: () => void
  onRegenerate?: () => void
  onShare?: () => void
  onAction?: (action: string, messageId: string) => void
  formatTimestamp: (timestamp?: string) => string
  isLastInGroup: boolean
  isMobile: boolean
}

export function MessageBubble({
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
}: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null)
  const [hasCopied, setHasCopied] = useState(false)

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

  // Copy message to clipboard with visual feedback
  const copyMessageToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setHasCopied(true)
      onCopy(content)

      // Reset copy state after 2 seconds
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    })
  }

  return (
    <div
      className={cn(
        "group relative leading-relaxed break-words p-4 flex flex-col text-sm transition-all duration-200",
        "rounded-lg shadow-sm border",
        "bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        {
          "max-w-[85%] sm:max-w-[75%] md:max-w-[65%]": isUser || isAssistant,
          "max-w-full": isSystem,
          "bg-primary/10 text-primary-foreground border-primary/20": isUser,
          "bg-card text-card-foreground border-border/60": isAssistant,
          "bg-muted/50 text-muted-foreground italic border-transparent text-xs": isSystem,
          "dark:bg-card dark:text-card-foreground dark:border-border/40": isAssistant,
          "dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30": isUser,
          "dark:bg-muted/30 dark:text-muted-foreground dark:border-transparent": isSystem,
        },
      )}
      tabIndex={0}
      aria-label={`${isUser ? "You" : isAssistant ? "AI Assistant" : "System"}: ${message.content}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {message.isThinking ? (
        <div className="flex items-center space-x-2">
          <span className="font-medium text-xs">Processing your request</span>
          <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-primary/30 animate-spin" />
        </div>
      ) : (
        <>
          {/* Editable user text */}
          {isEditing ? (
            <div className="relative">
              <Textarea
                value={draftContent}
                onChange={(e) => onEditChange(e.target.value)}
                className="bg-background border border-input outline-none shadow-none resize-none min-h-[50px] overflow-hidden text-sm p-2 focus-visible:ring-1 focus-visible:ring-ring rounded"
                autoFocus
              />
              <div className="absolute top-1 right-1 flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCancelEdit}
                  className="h-6 w-6 rounded-full bg-muted/70 hover:bg-muted text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Cancel edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSaveEdit}
                  className="h-6 w-6 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
                >
                  <Check className="h-3 w-3" />
                  <span className="sr-only">Save edit</span>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {hasMarkdown ? (
                <MarkdownRenderer content={message.content} />
              ) : (
                <div className="whitespace-pre-wrap w-full text-foreground leading-relaxed">{message.content}</div>
              )}
            </>
          )}

          {/* Message actions */}
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
              className={cn("mt-2 text-[10px] font-medium", {
                "text-muted-foreground/60": true,
              })}
            >
              {formatTimestamp(message.timestamp)}
            </div>
          )}

          {/* Message actions - only visible on hover or when selected */}
          <div
            className={cn(
              "flex items-center mt-3 space-x-1 transition-opacity duration-200",
              isHovered || isMobile ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={!isHovered && !isMobile}
          >
            {isAssistant && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors duration-200",
                          reaction === "like" && "text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary",
                        )}
                        onClick={() => setReaction(reaction === "like" ? null : "like")}
                        aria-label="Helpful response"
                        aria-pressed={reaction === "like"}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs py-1 px-2">
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
                          "h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors duration-200",
                          reaction === "dislike" &&
                            "text-destructive bg-destructive/10 hover:bg-destructive/20 hover:text-destructive",
                        )}
                        onClick={() => setReaction(reaction === "dislike" ? null : "dislike")}
                        aria-label="Unhelpful response"
                        aria-pressed={reaction === "dislike"}
                      >
                        <ThumbsDown className="h-3 w-3" />
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
                          className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors duration-200"
                          onClick={onRegenerate}
                          aria-label="Regenerate response"
                        >
                          <RotateCcw className="h-3 w-3" />
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
                    className={cn(
                      "h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors duration-200",
                      hasCopied && "text-primary bg-primary/10",
                    )}
                    onClick={() => copyMessageToClipboard(message.content)}
                    aria-label="Copy message"
                  >
                    {hasCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{hasCopied ? "Copied!" : "Copy"}</p>
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
                      className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors duration-200"
                      onClick={onEdit}
                      aria-label="Edit message"
                    >
                      <Edit className="h-3 w-3" />
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
                      className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors duration-200"
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
                  className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors duration-200"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-1" align="end">
                <div className="flex flex-col">
                  <Button variant="ghost" size="sm" className="justify-start text-xs h-8 px-2 rounded-sm">
                    Report message
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start text-xs h-8 px-2 rounded-sm">
                    Translate
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start text-xs h-8 px-2 rounded-sm">
                    Summarize
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}
    </div>
  )
}
