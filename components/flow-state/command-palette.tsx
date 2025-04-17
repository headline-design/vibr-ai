"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Command } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommandOption {
  id: string
  name: string
  description: string
  keywords: string[]
  icon?: React.ReactNode
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (command: string) => void
}

export function CommandPalette({ isOpen, onClose, onSelect }: CommandPaletteProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sample commands
  const commands: CommandOption[] = [
    {
      id: "help",
      name: "Help",
      description: "Show help information",
      keywords: ["help", "info", "documentation", "guide"],
      icon: <span className="text-blue-500">?</span>,
    },
    {
      id: "clear",
      name: "Clear Conversation",
      description: "Clear the current conversation",
      keywords: ["clear", "reset", "delete", "empty", "conversation"],
      icon: <span className="text-red-500">×</span>,
    },
    {
      id: "voice",
      name: "Voice Input",
      description: "Start voice input",
      keywords: ["voice", "speak", "talk", "microphone", "audio"],
      icon: <span className="text-green-500">🎤</span>,
    },
    {
      id: "file",
      name: "Attach File",
      description: "Attach a file to the conversation",
      keywords: ["file", "attach", "upload", "document", "image"],
      icon: <span className="text-yellow-500">📎</span>,
    },
    {
      id: "keyboard",
      name: "Keyboard Shortcuts",
      description: "Show keyboard shortcuts",
      keywords: ["keyboard", "shortcuts", "keys", "hotkeys"],
      icon: <span className="text-purple-500">⌨️</span>,
    },
    {
      id: "accessibility",
      name: "Accessibility Options",
      description: "Configure accessibility settings",
      keywords: ["accessibility", "a11y", "screen reader", "contrast"],
      icon: <span className="text-teal-500">♿</span>,
    },
    {
      id: "settings",
      name: "Settings",
      description: "Open settings panel",
      keywords: ["settings", "preferences", "options", "configure"],
      icon: <span className="text-muted-foreground">⚙️</span>,
    },
  ]

  // Filter commands based on search term
  const filteredCommands = commands.filter((command) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      command.name.toLowerCase().includes(searchLower) ||
      command.description.toLowerCase().includes(searchLower) ||
      command.keywords.some((keyword) => keyword.toLowerCase().includes(searchLower))
    )
  })

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : prev))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          onSelect(filteredCommands[selectedIndex].id)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filteredCommands, selectedIndex, onClose, onSelect])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[20vh]">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex items-center border-b p-3">
          <Command className="h-5 w-5 text-muted-foreground mr-2" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setSelectedIndex(0)
            }}
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No commands found</div>
          ) : (
            <ul>
              {filteredCommands.map((command, index) => (
                <li key={command.id}>
                  <button
                    className={cn(
                      "w-full text-left px-4 py-2 flex items-center",
                      selectedIndex === index ? "bg-gray-100 dark:bg-gray-700" : "",
                    )}
                    onClick={() => onSelect(command.id)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="mr-3 w-6 h-6 flex items-center justify-center">{command.icon}</div>
                    <div>
                      <div className="font-medium">{command.name}</div>
                      <div className="text-sm text-muted-foreground">{command.description}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
