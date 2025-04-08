"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Code, Smile, Mic, Settings, Command } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { VoiceRecorder } from "./voice-recorder"

interface SlashCommand {
  name: string
  description: string
  icon: React.ReactNode
  action: (input: string) => string
}

interface MessageInputEnhancedProps {
  onSendMessage: (message: string) => void
  onSendAudio?: (audioBlob: Blob) => void
  isWaitingForResponse: boolean
  onSettingsClick?: () => void
  onCommandPaletteOpen?: () => void
}

export function MessageInputEnhanced({
  onSendMessage,
  onSendAudio,
  isWaitingForResponse,
  onSettingsClick,
  onCommandPaletteOpen,
}: MessageInputEnhancedProps) {
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const [showSlashCommands, setShowSlashCommands] = useState(false)
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)

  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Slash commands
  const slashCommands: SlashCommand[] = [
    {
      name: "code",
      description: "Insert a code block",
      icon: <Code className="h-4 w-4" />,
      action: () => "```\n\n```",
    },
    {
      name: "table",
      description: "Insert a markdown table",
      icon: <div className="h-4 w-4 flex items-center justify-center text-xs">T</div>,
      action: () => "| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |",
    },
    {
      name: "help",
      description: "Show available commands",
      icon: <Command className="h-4 w-4" />,
      action: () => "",
    },
    {
      name: "clear",
      description: "Clear the input",
      icon: <div className="h-4 w-4 flex items-center justify-center text-xs">C</div>,
      action: () => "",
    },
  ]

  // Auto-resize textarea as user types
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`
    }
  }, [inputValue])

  // Handle slash commands
  useEffect(() => {
    if (inputValue.startsWith("/") && inputValue.length <= 10 && !inputValue.includes(" ")) {
      setShowSlashCommands(true)
      setSelectedCommandIndex(0)
    } else {
      setShowSlashCommands(false)
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
    if (showSlashCommands) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedCommandIndex((prev) => (prev + 1) % slashCommands.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedCommandIndex((prev) => (prev - 1 + slashCommands.length) % slashCommands.length)
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault()
        executeSlashCommand(slashCommands[selectedCommandIndex].name)
      } else if (e.key === "Escape") {
        e.preventDefault()
        setShowSlashCommands(false)
      }
    } else if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onCommandPaletteOpen?.()
    }
  }

  // Execute slash command
  const executeSlashCommand = (commandName: string) => {
    const command = slashCommands.find((cmd) => cmd.name === commandName)
    if (command) {
      if (commandName === "clear") {
        setInputValue("")
      } else if (commandName === "help") {
        // Show help dialog or tooltip
      } else {
        const result = command.action(inputValue)
        setInputValue(result)

        // Position cursor inside code block
        if (commandName === "code") {
          setTimeout(() => {
            if (inputRef.current) {
              const cursorPosition = inputRef.current.value.indexOf("\n\n") + 1
              inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
              inputRef.current.focus()
            }
          }, 0)
        }
      }
      setShowSlashCommands(false)
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

  // Handle voice recording complete
  const handleRecordingComplete = (transcript: string) => {
    if (transcript) {
      onSendMessage(transcript)
    }
    setIsRecording(false)
  }

  return (
    <div className="p-2 border-t border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800">
      {isRecording ? (
        <VoiceRecorder
          onRecordingComplete={handleRecordingComplete}
          onCancel={() => setIsRecording(false)}
          className="mb-1.5"
        />
      ) : (
        <div className="relative">
          <div className="rounded-lg p-1.5 flex flex-col items-center gap-1 border border-gray-200 focus-within:border-blue-500 transition-colors duration-200 dark:border-gray-700 dark:focus-within:border-blue-400">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder="Type a message or use / for commands..."
              disabled={isWaitingForResponse}
              className="flex-1 bg-transparent border-none outline-none shadow-none resize-none min-h-[24px] max-h-[120px] overflow-y-auto px-2 py-1.5 w-full text-sm"
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
                      >
                        <Paperclip className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs py-1 px-2">
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
                        className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        onClick={() => executeSlashCommand("code")}
                        aria-label="Insert code snippet"
                      >
                        <Code className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs py-1 px-2">
                      <p>Insert code</p>
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
                        className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        onClick={toggleRecording}
                        aria-label="Voice message"
                      >
                        <Mic className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs py-1 px-2">
                      <p>Voice message</p>
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
                    <TooltipContent side="top" className="text-xs py-1 px-2">
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
                    <TooltipContent side="top" className="text-xs py-1 px-2">
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || isWaitingForResponse}
                  className={cn("h-7 px-2.5 text-xs transition-all", inputValue.trim() ? "opacity-100" : "opacity-80")}
                  aria-label="Send message"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </div>

          {/* Slash commands dropdown */}
          {showSlashCommands && (
            <div className="absolute bottom-full left-0 w-60 mb-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
              <div className="p-1.5">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5 px-2">Commands</div>
                <div className="max-h-40 overflow-y-auto">
                  {slashCommands.map((command, index) => (
                    <button
                      key={command.name}
                      className={cn(
                        "flex items-center w-full px-2 py-1 text-xs text-left rounded",
                        index === selectedCommandIndex
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700",
                      )}
                      onClick={() => executeSlashCommand(command.name)}
                    >
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-1.5 text-gray-500 dark:text-gray-400">
                        {command.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">/{command.name}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{command.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between px-2 py-0.5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[10px] text-gray-500">
                <div className="flex items-center space-x-1.5">
                  <span>Navigate</span>
                  <div className="flex space-x-0.5">
                    <kbd className="px-0.5 py-px bg-gray-100 dark:bg-gray-700 rounded">↑</kbd>
                    <kbd className="px-0.5 py-px bg-gray-100 dark:bg-gray-700 rounded">↓</kbd>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span>Select</span>
                  <kbd className="px-0.5 py-px bg-gray-100 dark:bg-gray-700 rounded">Enter</kbd>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Character count and typing indicators */}
      <div className="flex justify-between items-center px-2 mt-0.5 text-[10px] text-gray-400">
        <div>{inputValue.length > 0 && <span>{inputValue.length} characters</span>}</div>
        <div aria-live="polite">{isWaitingForResponse && <span>Processing your request...</span>}</div>
      </div>
    </div>
  )
}
