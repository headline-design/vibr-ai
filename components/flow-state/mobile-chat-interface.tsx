"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, MoreVertical, Send, Paperclip, Mic, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { useFlowState } from "./flow-state-context"
import { MessageBubbleEnhanced } from "./message-bubble-enhanced"
import { EnhancedTypingIndicator } from "./enhanced-typing-indicator"
import { SettingsPanel } from "./settings-panel"
import { ChatSearch } from "./chat-search"

interface MobileChatInterfaceProps {
  onBack?: () => void
  title?: string
  className?: string
}

export function MobileChatInterface({ onBack, title = "AI Assistant", className }: MobileChatInterfaceProps) {
  const { messages, handleSendMessage, isWaitingForResponse } = useFlowState()

  // State
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [draftMessages, setDraftMessages] = useState<Record<string, string>>({})

  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea as user types
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 100)}px`
    }
  }, [inputValue])

  // Send message
  const handleSubmit = () => {
    if (inputValue.trim() && !isWaitingForResponse) {
      handleSendMessage(inputValue)
      setInputValue("")

      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = "auto"
      }
    }
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
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  // Start editing a message
  const handleStartEdit = (messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setDraftMessages({ ...draftMessages, [messageId]: content })
  }

  // Save edited message
  const handleSaveEdit = (messageId: string) => {
    const editedContent = draftMessages[messageId]
    if (editedContent?.trim()) {
      handleSendMessage(editedContent, messageId)
      setEditingMessageId(null)
    }
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingMessageId(null)
  }

  // Copy message to clipboard
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  // Handle message selection for search
  const handleMessageSelection = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      // Highlight the message temporarily
      element.classList.add("ring-2", "ring-blue-500", "ring-offset-2")
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-blue-500", "ring-offset-2")
      }, 2000)
    }
    setIsSearchOpen(false)
  }

  return (
    <div className={cn("flex flex-col h-full bg-white dark:bg-gray-900", className)}>
      {/* Header */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="flex items-center">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-base font-medium truncate">{title}</h1>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-4">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Options</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center h-20 space-y-1"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="text-xs">Settings</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                    <Search className="h-5 w-5" />
                    <span className="text-xs">Search</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                    <Paperclip className="h-5 w-5" />
                    <span className="text-xs">Attachments</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                    <Mic className="h-5 w-5" />
                    <span className="text-xs">Voice</span>
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </header>

      {/* Chat messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            id={`message-${message.id}`}
            className={cn(
              "transition-all duration-300",
              message.role === "user" ? "flex justify-end" : "flex justify-start",
            )}
          >
            <MessageBubbleEnhanced
              message={message}
              isFirstInGroup={true}
              isEditing={editingMessageId === message.id}
              draftContent={draftMessages[message.id] || message.content}
              onEditChange={(content) => setDraftMessages({ ...draftMessages, [message.id]: content })}
              onSaveEdit={() => handleSaveEdit(message.id)}
              onCancelEdit={handleCancelEdit}
              onCopy={() => handleCopyMessage(message.content)}
              onEdit={message.role === "user" ? () => handleStartEdit(message.id, message.content) : undefined}
              formatTimestamp={formatTimestamp}
              isLastInGroup={true}
              isMobile={true}
            />
          </div>
        ))}

        {/* Typing indicator */}
        {isWaitingForResponse && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
              <EnhancedTypingIndicator variant="minimal" />
            </div>
          </div>
        )}

        {/* Bottom anchor for scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-2 bg-white dark:bg-gray-900">
        <div className="flex items-end space-x-2">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="resize-none min-h-[40px] max-h-[120px] pr-10 py-2.5 rounded-full border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 bottom-1 h-8 w-8"
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className={cn("h-5 w-5", isRecording ? "text-red-500 animate-pulse" : "text-gray-500")} />
            </Button>
          </div>

          <Button
            size="icon"
            className="flex-shrink-0 h-10 w-10 rounded-full"
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isWaitingForResponse}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Settings panel */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Search panel */}
      <ChatSearch
        messages={messages}
        onResultSelect={handleMessageSelection}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  )
}
