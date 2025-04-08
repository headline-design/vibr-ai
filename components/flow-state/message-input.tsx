"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Code, Smile, Mic, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  isWaitingForResponse: boolean
  onSettingsClick?: () => void
}

export function MessageInput({ onSendMessage, isWaitingForResponse, onSettingsClick }: MessageInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [isComposing, setIsComposing] = useState(false)

  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea as user types
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`
    }
  }, [inputValue])

  // Send message
  const handleSubmit = () => {
    if (inputValue.trim() && !isWaitingForResponse) {
      onSendMessage(inputValue)
      setInputValue("")

      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = "auto"
      }
    }
  }

  // Keydown handler for sending vs. newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Handle IME composition (for languages like Chinese, Japanese)
  const handleCompositionStart = () => setIsComposing(true)
  const handleCompositionEnd = () => setIsComposing(false)

  // Add emoji to input
  const handleEmojiSelect = (emoji: string) => {
    setInputValue((prev) => prev + emoji)
    setIsEmojiPickerOpen(false)
    inputRef.current?.focus()
  }

  // Toggle voice recording
  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  return (
    <div className="p-3 border-t border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="rounded-md p-2 flex flex-col items-center gap-1 border border-gray-200 focus-within:border-blue-500 transition-colors duration-200 dark:border-gray-700 dark:focus-within:border-blue-400">
        <Textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={isRecording ? "Listening..." : "Ask a question..."}
          disabled={isWaitingForResponse || isRecording}
          className="flex-1 bg-transparent border-none outline-none shadow-none resize-none min-h-[24px] max-h-[150px] overflow-y-auto px-2 py-2 w-full text-sm"
          aria-label="Message input"
        />
        <div className="flex w-full px-1 pb-1 items-center justify-between">
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Attach file"
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Insert code snippet"
                  >
                    <Code className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Insert code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Insert emoji"
                >
                  <Smile className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start">
                <div className="p-2">
                  <div className="grid grid-cols-7 gap-1">
                    {["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😊", "😇", "🥰", "😍", "🤩", "😘"].map(
                      (emoji, index) => (
                        <button
                          key={index}
                          className="h-8 w-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded"
                          onClick={() => handleEmojiSelect(emoji)}
                        >
                          {emoji}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-7 w-7 hover:text-gray-600 dark:hover:text-gray-300",
                      isRecording ? "text-red-500" : "text-gray-400",
                    )}
                    onClick={toggleRecording}
                    aria-label={isRecording ? "Stop recording" : "Start voice recording"}
                    aria-pressed={isRecording}
                  >
                    <Mic className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{isRecording ? "Stop recording" : "Voice message"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={onSettingsClick}
                    aria-label="Settings"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isWaitingForResponse}
              className={cn("h-8 px-3 text-sm transition-all", inputValue.trim() ? "opacity-100" : "opacity-80")}
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Character count and typing indicators */}
      <div className="flex justify-between items-center px-3 mt-1 text-xs text-gray-400">
        <div>{inputValue.length > 0 && <span>{inputValue.length} characters</span>}</div>
        <div aria-live="polite">{isWaitingForResponse && <span>Processing your request...</span>}</div>
      </div>
    </div>
  )
}
