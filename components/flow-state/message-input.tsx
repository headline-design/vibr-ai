"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Smile, Settings, Command, Mic, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SpeechRecognitionService } from "@/utils/speech-recognition"
import { FileAttachmentHandler } from "./file-attachment-handler"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  isWaitingForResponse?: boolean
  onSettingsClick?: () => void
  onCommandPaletteOpen?: () => void
  className?: string
  placeholder?: string
  showAttachButton?: boolean
  showEmojiButton?: boolean
  showSettingsButton?: boolean
  showCommandButton?: boolean
  showVoiceButton?: boolean
  maxRows?: number
  autoFocus?: boolean
}

export function MessageInput({
  onSendMessage,
  isWaitingForResponse = false,
  onSettingsClick,
  onCommandPaletteOpen,
  className,
  placeholder = "Type a message...",
  showAttachButton = true,
  showEmojiButton = false,
  showSettingsButton = true,
  showCommandButton = true,
  showVoiceButton = true,
  maxRows = 5,
  autoFocus = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [rows, setRows] = useState(1)
  const [isFocused, setIsFocused] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [inputPlaceholder, setInputPlaceholder] = useState(placeholder)
  const [isFileAttachmentOpen, setIsFileAttachmentOpen] = useState(false)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionService | null>(null)
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Update character count when message changes
  useEffect(() => {
    setCharCount(message.length)
  }, [message])

  // Initialize speech recognition
  useEffect(() => {
    recognitionRef.current = new SpeechRecognitionService({
      continuous: true,
      interimResults: true,
      onResult: (text, isFinal) => {
        setMessage(text)
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


  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto"

      // Calculate line height (assuming 24px line height)
      const lineHeight = 24

      // Calculate new rows based on scrollHeight
      const newRows = Math.min(maxRows, Math.max(1, Math.ceil(textareaRef.current.scrollHeight / lineHeight)))

      setRows(newRows)

      // Set the new height
      textareaRef.current.style.height = `${newRows * lineHeight}px`
    }
  }, [message, maxRows])

  // Auto-focus on mount if specified
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isWaitingForResponse && !isComposing) {
      onSendMessage(message.trim())
      setMessage("")
      setRows(1)
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Handle IME composition events (for languages like Chinese, Japanese, etc.)
  const handleCompositionStart = () => setIsComposing(true)
  const handleCompositionEnd = () => setIsComposing(false)

  return (
    <div
      className={cn(
        "border-t border-border/60 bg-background p-3 sm:p-4 transition-all duration-200",
        "shadow-sm dark:shadow-none",
        isFocused && "shadow-md dark:shadow-none",
        className,
      )}
      aria-label="Message input area"
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={cn(
          "flex items-end gap-2 rounded-xl border border-border/60 bg-muted/50 p-1.5 sm:p-2 transition-all duration-200",
          isFocused && "border-primary/30 bg-background shadow-sm ring-1 ring-primary/5",
          isWaitingForResponse && "opacity-80",
        )}
      >
        {/* Left side buttons */}
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center gap-1">
            {showAttachButton && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                      "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
                      "disabled:opacity-50",
                    )}
                    aria-label="Attach file"
                    disabled={isWaitingForResponse}
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={10}>
                  Attach file
                </TooltipContent>
              </Tooltip>
            )}

            {showEmojiButton && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                      "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
                      "disabled:opacity-50",
                    )}
                    aria-label="Insert emoji"
                    disabled={isWaitingForResponse}
                  >
                    <Smile className="h-4 w-4" />
                    <span className="sr-only">Insert emoji</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={10}>
                  Insert emoji
                </TooltipContent>
              </Tooltip>
            )}

            {showVoiceButton && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                      "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
                      "disabled:opacity-50",
                      isRecording ? "text-red-500 animate-pulse" : "text-gray-400",
                    )}
                    onClick={toggleRecording}
                    aria-label={isRecording ? "Stop recording" : "Start voice recording"}
                    aria-pressed={isRecording}
                    disabled={isWaitingForResponse}
                  >
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Voice input</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={10}>
                  {isRecording ? "Stop Recording" : "Voice message"}
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Textarea */}
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={placeholder}
              rows={rows}
              disabled={isWaitingForResponse}
              className={cn(
                "flex-1 resize-none border-0 bg-transparent py-2.5 px-2 focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground/70",
                "text-sm leading-relaxed",
                "scrollbar-thin scrollbar-thumb-rounded scrollbar-track-transparent scrollbar-thumb-muted-foreground/20",
                "disabled:opacity-70",
              )}
              aria-label="Message input"
              aria-multiline="true"
              aria-required="true"
            />

            {/* Character counter */}
            <AnimatePresence>
              {charCount > 0 && (
                <motion.div
                  className="absolute right-2 bottom-1 text-[10px] text-muted-foreground/60"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  {charCount} {charCount === 1 ? "character" : "characters"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-1">
            {showCommandButton && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onCommandPaletteOpen}
                    className={cn(
                      "h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                      "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
                      "disabled:opacity-50",
                    )}
                    aria-label="Open command palette"
                    disabled={isWaitingForResponse}
                  >
                    <Command className="h-4 w-4" />
                    <span className="sr-only">Command palette</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={10}>
                  Command palette (⌘K)
                </TooltipContent>
              </Tooltip>
            )}

            {showSettingsButton && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onSettingsClick}
                    className={cn(
                      "h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                      "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
                      "disabled:opacity-50",
                    )}
                    aria-label="Open settings"
                    disabled={isWaitingForResponse}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={10}>
                  Settings
                </TooltipContent>
              </Tooltip>
            )}

            {/* Send button with animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isWaitingForResponse ? "waiting" : "ready"}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 25 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      disabled={!message.trim() || isWaitingForResponse}
                      size="icon"
                      className={cn(
                        "h-9 w-9 rounded-full transition-all duration-200",
                        message.trim() && !isWaitingForResponse
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                          : "bg-muted text-muted-foreground cursor-not-allowed",
                        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      )}
                      aria-label={isWaitingForResponse ? "Processing message" : "Send message"}
                    >
                      {isWaitingForResponse ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span className="sr-only">{isWaitingForResponse ? "Processing..." : "Send message"}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={10}>
                    {isWaitingForResponse ? "Processing..." : "Send message (Enter)"}
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </AnimatePresence>
          </div>
        </TooltipProvider>
      </form>

      {/* Keyboard shortcuts hint */}
      <div className="mt-2 px-2 text-[11px] text-muted-foreground/60 text-center select-none">
        <span>
          Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono">Enter</kbd>{" "}
          to send,{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono">Shift+Enter</kbd>{" "}
          for new line
        </span>
      </div>
    </div>
  )
}
