"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Smile, Mic, Settings, Command } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SpeechRecognitionService } from "@/utils/speech-recognition"
import { FileAttachmentHandler } from "./file-attachment-handler"

interface MessageInputRefinedProps {
  onSendMessage: (message: string) => void
  onSendAudio?: (audioBlob: Blob) => void
  isWaitingForResponse: boolean
  onSettingsClick?: () => void
  onCommandPaletteOpen?: () => void
  className?: string
  placeholder?: string
  showAiSuggestions?: boolean
}

export function MessageInputRefined({
  onSendMessage,
  isWaitingForResponse,
  onSettingsClick,
  onCommandPaletteOpen,
  className,
  placeholder = "Type your message...",
  showAiSuggestions = true,
}: MessageInputRefinedProps) {
  const [inputValue, setInputValue] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "Tell me more about React hooks",
    "How do I optimize my website performance?",
    "Explain the difference between REST and GraphQL",
  ])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [inputPlaceholder, setInputPlaceholder] = useState(placeholder)
  const [isFileAttachmentOpen, setIsFileAttachmentOpen] = useState(false)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionService | null>(null)

  // Auto-resize textarea as user types
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`
    }
  }, [inputValue])

  // Initialize speech recognition
  useEffect(() => {
    recognitionRef.current = new SpeechRecognitionService({
      continuous: true,
      interimResults: true,
      onResult: (text, isFinal) => {
        setInputValue(text)
      },
      onError: (error) => {
        console.error("Speech recognition error:", error)
        setErrorMessage("Could not recognize speech. Please try again.")
        stopRecording()
      },
    })

    return () => {
      stopRecording()
    }
  }, [])

  // Start/stop listening
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const startRecording = () => {
    setErrorMessage(null)
    if (recognitionRef.current) {
      recognitionRef.current.start()
      setIsRecording(true)
      setInputPlaceholder("Listening...")
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
      setInputPlaceholder(placeholder)
    }
  }

  // Handle IME composition (for languages like Chinese, Japanese)
  const handleCompositionStart = () => setIsComposing(true)
  const handleCompositionEnd = () => setIsComposing(false)

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
    } else if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onCommandPaletteOpen?.()
    }
  }

  // Add emoji to input
  const handleEmojiSelect = (emoji: string) => {
    setInputValue((prev) => prev + emoji)
    setIsEmojiPickerOpen(false)
    inputRef.current?.focus()
  }

  // Handle file attachment
  const handleFileAttached = (fileInfo: any) => {
    console.log("File attached:", fileInfo)
    setIsFileAttachmentOpen(false)
  }

  return (
    <div className="p-2 border-t border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="relative">
        <div className="rounded-lg p-1.5 flex flex-col items-center gap-1.5 border border-gray-200 focus-within:border-blue-500 transition-colors duration-200 dark:border-gray-700 dark:focus-within:border-blue-400">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={isRecording ? "Listening..." : inputPlaceholder}
            disabled={isWaitingForResponse || isRecording}
            className="flex-1 bg-transparent border-none outline-none shadow-none resize-none min-h-[24px] max-h-[150px] overflow-y-auto px-2 py-1.5 w-full text-sm"
            aria-label="Message input"
          />
          <div className="flex w-full px-1 pb-0.5 items-center justify-between">
            <div className="flex items-center space-x-0.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label="Attach file"
                      onClick={() => setIsFileAttachmentOpen(true)}
                    >
                      <Paperclip className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Attach file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Insert emoji"
                  >
                    <Smile className="h-3 w-3" />
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
                        "h-6 w-6 hover:text-gray-600 dark:hover:text-gray-300",
                        isRecording ? "text-red-500 animate-pulse" : "text-gray-400",
                      )}
                      onClick={toggleRecording}
                      aria-label={isRecording ? "Stop recording" : "Start voice recording"}
                      aria-pressed={isRecording}
                    >
                      <Mic className="h-3 w-3" />
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
                      className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={onCommandPaletteOpen}
                      aria-label="Command palette"
                    >
                      <Command className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="flex items-center space-x-1">
                      <p>Command palette</p>
                      <kbd className="px-1 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">⌘K</kbd>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={onSettingsClick}
                      aria-label="Settings"
                    >
                      <Settings className="h-3 w-3" />
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
                className={cn("h-7 px-2.5 text-sm transition-all", inputValue.trim() ? "opacity-100" : "opacity-80")}
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* File Attachment Handler */}
      {isFileAttachmentOpen && (
        <FileAttachmentHandler
          onClose={() => setIsFileAttachmentOpen(false)}
          onFileAttached={(fileInfo) => {
            console.log("Attached file:", fileInfo)
            setIsFileAttachmentOpen(false)
          }}
        />
      )}
    </div>
  )
}
