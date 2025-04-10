"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, X, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useFlowState } from "@/components/flow-state/flow-state-context"
import { ChatSettings } from "./chat-settings"
import ReactMarkdown from "react-markdown"
import MessageActions from "@/components/flow-state/message-actions"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MessageInput } from "./message-input"
import { useToast } from "@/components/ui/use-toast"
import dynamic from "next/dynamic"

const FluxAvatar = dynamic(() => import("./flux-avatar-enhanced"), { ssr: false })

export type ChatRole = "user" | "assistant" | "system"

export interface ChatMessage {
  parentId?: string
  id: string
  role: ChatRole
  content: string
  isThinking?: boolean
  timestamp?: string
  actions?: Array<{
    id: string
    label: string
    variant?: "default" | "secondary" | "default" | "outline" | "destructive"
  }>
}

export interface ChatInterfaceProps {
  className?: string
  title?: string
  hideHeader?: boolean
  currentView?: "chat" | "settings"
  onOpenSettings?: () => void
  onCloseSettings?: () => void
  setEmbeddedChatView?: (view: "chat" | "settings") => void
}

const suggestionExamples = [
  "Explain quantum physics.",
  "Write a poem about the ocean.",
  "Translate 'hello' into Spanish.",
]

interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ suggestions, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <Button key={index} variant="outline" size="sm" onClick={() => onSelect(suggestion)}>
          {suggestion}
        </Button>
      ))}
    </div>
  )
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  className,
  title = "Flux AI Assistant",
  hideHeader = false,
  currentView: externalView,
  onOpenSettings,
  onCloseSettings,
  setEmbeddedChatView,
}) => {
  const { messages, handleSendMessage, isWaitingForResponse, clearMessages, setMessages } = useFlowState()
  const { toast } = useToast()

  // State for user input
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [draftMessages, setDraftMessages] = useState<Record<string, string>>({})
  const [inputValue, setInputValue] = useState<string>("")

  // UI states
  const [internalView, setInternalView] = useState<"chat" | "settings">("chat")
  const [showGreeting, setShowGreeting] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [inputPlaceholder, setInputPlaceholder] = useState("Ask a question...")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  // Use external view state if provided, otherwise use internal
  const currentView = externalView || internalView

  // Handle settings navigation based on whether we're using external or internal state
  const openSettings = () => {
    if (onOpenSettings) {
      onOpenSettings()
    } else {
      setInternalView("settings")
    }
  }

  const closeSettings = () => {
    if (onCloseSettings) {
      onCloseSettings()
    } else {
      setInternalView("chat")
    }
  }

  // Refs for scroll & focusing
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Media query for responsive design
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Group messages by sender for visual continuity
  const groupedMessages = messages.reduce((acc: ChatMessage[][], message, index) => {
    const prevMessage = messages[index - 1]

    // Start a new group if:
    // 1. This is the first message
    // 2. The sender changed
    // 3. More than 2 minutes passed between messages
    const shouldStartNewGroup =
      !prevMessage ||
      prevMessage.role !== message.role ||
      (message.timestamp &&
        prevMessage.timestamp &&
        new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 120000)

    if (shouldStartNewGroup) {
      acc.push([message])
    } else {
      acc[acc.length - 1].push(message)
    }

    return acc
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    const scrollToBottom = () => {
      if (!isScrolled && chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      }
    }
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [messages, isScrolled])

  // Start editing a user message
  const startEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setDraftMessages({ ...draftMessages, [messageId]: content })
  }

  // Save edited user message
  const saveEditedMessage = (messageId: string) => {
    const editedContent = draftMessages[messageId]
    if (editedContent?.trim()) {
      // Clear the thread under the message
      const messageIndex = messages.findIndex((msg) => msg.id === messageId)
      if (messageIndex !== -1) {
        const threadMessages = messages.slice(messageIndex + 1).filter((msg) => msg.parentId === messageId)
        const threadMessageIds = threadMessages.map((msg) => msg.id)
        setMessages((prevMessages) => prevMessages.filter((msg) => !threadMessageIds.includes(msg.id)))
      }
      handleSendMessage(editedContent, messageId)
      cancelEdit()
      toast({
        title: "Message updated",
        description: "Your message has been updated successfully.",
      })
    }
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingMessageId(null)
    setInputValue("")
  }

  // Handle regenerate
  const handleRegenerate = useCallback(
    (messageId: string) => {
      // Find the original user message associated with this assistant message
      const assistantMessageIndex = messages.findIndex((msg) => msg.id === messageId)
      if (assistantMessageIndex === -1) {
        console.log("Assistant message not found")
        return
      }

      const assistantMessage = messages[assistantMessageIndex]
      console.log("Assistant message:", assistantMessage)

      // Find the user message that prompted this assistant message
      const userMessage = messages
        .slice(0, assistantMessageIndex)
        .reverse()
        .find((msg) => msg.role === "user")

      if (userMessage) {
        console.log("User message:", userMessage)
        console.log("Regenerating with content:", userMessage.content)

        // Collect all message IDs to be deleted, starting with the assistant message
        const messageIdsToDelete = [assistantMessage.id]

        // Recursively collect all child message IDs
        const collectChildIds = (parentId: string) => {
          messages.forEach((msg) => {
            if (msg.parentId === parentId) {
              messageIdsToDelete.push(msg.id)
              collectChildIds(msg.id) // Recursively collect children
            }
          })
        }

        collectChildIds(assistantMessage.id)

        // Add the user message id to the list of messages to be deleted
        messageIdsToDelete.push(userMessage.id)

        setMessages((prevMessages) => prevMessages.filter((msg) => !messageIdsToDelete.includes(msg.id)))

        // Resend the original user message, but do NOT add it again
        handleSendMessage(userMessage.content)
      } else {
        console.log("No user message found")
      }
    },
    [handleSendMessage, messages, setMessages, toast],
  )

  // Copy message to clipboard
  const copyMessageToClipboard = (content: string, messageId: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopiedMessageId(messageId)
        setTimeout(() => setCopiedMessageId(null), 2000)
        toast({
          title: "Message copied",
          description: "Message copied to clipboard.",
        })
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy message to clipboard.",
          variant: "destructive",
        })
      })
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    // setInputValue(suggestion)
    // if (inputRef.current) {
    //   inputRef.current.focus()
    // }
  }

  // Basic "mood" detection for avatar
  const getAvatarMood = (message: ChatMessage) => {
    if (message.isThinking) return "thinking"

    const text = message.content?.toLowerCase() || ""
    if (text.includes("great") || text.includes("excellent") || text.includes("awesome")) return "happy"
    if (text.includes("think") || text.includes("interesting") || text.includes("consider")) return "focused"
    if (text.includes("wow") || text.includes("amazing") || text.includes("exciting")) return "excited"
    if (text.includes("bad") || text.includes("sad") || text.includes("disappointed")) return "sad"

    return "neutral"
  }

  // Format timestamp for display
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return ""

    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return (
        date.toLocaleDateString([], { month: "short", day: "numeric" }) +
        " at " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      )
    }
  }

  // Detect code blocks in messages
  const hasCodeBlock = (content: string) => {
    return content.includes("```") || content.includes("`")
  }

  const hasMarkdown = false // Or determine this dynamically
  const MarkdownRenderer = ({ content }: { content: string }) => {
    return (
      <div className="prose prose-sm dark:prose-invert prose-ul:my-2 prose-ol:my-2 prose-headings:font-medium prose-headings:text-foreground">
        <ReactMarkdown >
          {content}
        </ReactMarkdown>
      </div>
    )
  }

  useEffect(() => {
    if (setEmbeddedChatView) {
      setEmbeddedChatView(currentView || "chat")
    }
  }, [currentView, setEmbeddedChatView])

  return (
    <div className={cn("flex flex-col h-full relative", className)}>
      {/* Optional Header - only shown if hideHeader is false */}
      {!hideHeader && (
        <header className="flex items-center justify-between px-4 py-3.5 border-b border-muted bg-background">
          <div className="flex items-center">
            {currentView === "settings" && (
              <Button variant="ghost" size="icon" onClick={closeSettings} className="mr-2">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-base font-medium">{currentView === "chat" ? title : "Settings"}</h1>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Chat View */}
        <AnimatePresence mode="wait">
          {currentView === "chat" ? (
            <motion.div
              key="chat-view"
              className="h-full flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Scrollable container for messages */}
              <div
                ref={chatContainerRef}
                className={cn(
                  "relative flex-1 overflow-y-auto px-4 py-4",
                  "bg-background bg-[url('/subtle-pattern.png')] bg-repeat bg-opacity-5",
                  "scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-transparent scrollbar-thumb-neutral-300/80 dark:scrollbar-thumb-neutral-700/80", // Refined scrollbars
                )}
                role="log"
                aria-live="polite"
                aria-label="Chat messages"
              >
                {/* Welcome message */}
                {messages.length === 0 && (
                  <div className="mb-6">
                    <div className="text-sm text-muted-foreground mb-3">
                      <h2 className="font-medium mb-1">Welcome to the AI Assistant</h2>
                      <p>Ask questions, request information, or get help with tasks.</p>
                    </div>

                    {/* Suggestion chips */}
                    {showGreeting && (
                      <div className="mb-4">
                        <SuggestionChips suggestions={suggestionExamples} onSelect={handleSuggestionSelect} />
                      </div>
                    )}
                  </div>
                )}

                {/* Message groups */}
                {groupedMessages.map((group, groupIndex) => (
                  <motion.div
                    key={`group-${groupIndex}`}
                    className="space-y-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: groupIndex * 0.05, ease: "easeOut" }}
                  >
                    {group.map((message, messageIndex) => {
                      const isUser = message.role === "user"
                      const isAssistant = message.role === "assistant"
                      const isSystem = message.role === "system"
                      const isFirstInGroup = messageIndex === 0
                      const hasCode = hasCodeBlock(message.content)

                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={cn("flex w-full space-y-1.5", {
                            "justify-end": isUser,
                            "justify-start": !isUser,
                            "mb-3": messageIndex === group.length - 1, // Add more space after last message in group
                          })}
                        >
                          {/* Assistant avatar - only show for first message in group */}
                          {isAssistant && isFirstInGroup && (
                            <motion.div
                              layout
                              className="mr-2.5 mt-0.5 flex-shrink-0 ring-1 ring-border/30"
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                            >
                              <FluxAvatar
                                size="xs"
                                mood={getAvatarMood(message)}
                                animate={!isWaitingForResponse}
                                aria-hidden="true"
                              />
                            </motion.div>
                          )}

                          {/* Empty space to align messages when no avatar */}
                          {isAssistant && !isFirstInGroup && <div className="w-8 flex-shrink-0" aria-hidden="true" />}

                          {/* Chat bubble container with increased border radius */}
                          <div
                            className={cn(
                              "relative leading-relaxed break-words p-2.5 sm:p-3.5 shadow-sm flex flex-col transition-all duration-200",
                              "rounded-2xl hover:shadow-md transition-shadow duration-200",
                              "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
                              {
                                "max-w-[85%] sm:max-w-[75%] md:max-w-[70%]": isUser || isAssistant,
                                "max-w-full": isSystem,
                                "bg-gradient-to-br from-primary/10 to-primary/15 text-foreground border border-primary/20":
                                  isUser,
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
                                      value={draftMessages[message.id] || ""}
                                      onChange={(e) =>
                                        setDraftMessages({
                                          ...draftMessages,
                                          [message.id]: e.target.value,
                                        })
                                      }
                                      className="bg-transparent border border-muted outline-none shadow-none resize-none min-h-[50px] overflow-hidden text-sm p-0 focus:ring-1 focus:ring-blue-500/50 rounded"
                                      autoFocus
                                    />
                                    <div className="absolute top-0 right-0 flex space-x-1 p-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={cancelEdit}
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
                                    {hasCode && isAssistant ? (
                                      <MarkdownRenderer content={message.content} />
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

                                {/* Message actions - only visible on hover or when selected */}
                                {(selectedMessageId === message.id || isMobile) && (
                                  <MessageActions
                                    messageId={message.id}
                                    role={message.role}
                                    onEdit={isUser ? () => startEditMessage(message.id, message.content) : undefined}
                                    onRegenerate={isAssistant ? () => handleRegenerate(message.id) : undefined}
                                    onCopy={
                                      isAssistant
                                        ? () => copyMessageToClipboard(message.content, message.id)
                                        : undefined
                                    }
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
                              </>
                            )}
                          </div>

                          {/* If user bubble, add an avatar for first message in group */}
                          {isUser && isFirstInGroup && (
                            <div className="flex-shrink-0 ml-2 mt-1 group relative">
                              <div
                                className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-medium text-white"
                                aria-hidden="true"
                              >
                                You
                              </div>
                            </div>
                          )}

                          {/* Empty space to align messages when no avatar */}
                          {isUser && !isFirstInGroup && <div className="w-9 flex-shrink-0" aria-hidden="true" />}
                        </motion.div>
                      )
                    })}
                  </motion.div>
                ))}

                {/* Bottom anchor for scrolling */}
                <div ref={messagesEndRef} />
              </div>

              {/* Footer */}
              <MessageInput
                onSendMessage={handleSendMessage}
                isWaitingForResponse={isWaitingForResponse}
                onSettingsClick={openSettings}
                onCommandPaletteOpen={() => {
                  /* Implement command palette open */
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="settings-view"
              className="h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChatSettings isOpen={true} onClose={closeSettings} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ChatInterface
