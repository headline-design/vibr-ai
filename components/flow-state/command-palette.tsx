"use client"

import { useState, useEffect, useRef } from "react"
import { Command } from "cmdk"
import { Dialog } from "@/components/ui/dialog"
import {
  Search,
  Trash2,
  Download,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Keyboard,
  MessageSquare,
  FileText,
  Share,
  Zap,
} from "lucide-react"

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onClearChat: () => void
  onExportChat: () => void
  onOpenSettings: () => void
  onToggleTheme: () => void
  onShowKeyboardShortcuts: () => void
  onNewChat: () => void
  theme: "light" | "dark" | "system"
}

export function CommandPalette({
  isOpen,
  onClose,
  onClearChat,
  onExportChat,
  onOpenSettings,
  onToggleTheme,
  onShowKeyboardShortcuts,
  onNewChat,
  theme,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      setSearch("")
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (isOpen) {
          onClose()
        } else {
          // Open command palette
          // This would be handled by the parent component
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]">
        <Command
          className="rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 overflow-hidden"
          loop
        >
          <div className="flex items-center border-b border-gray-200 px-3 dark:border-gray-700">
            <Search className="mr-2 h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
            <Command.Input
              ref={inputRef}
              value={search}
              onValueChange={setSearch}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-50"
              placeholder="Type a command or search..."
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found.
            </Command.Empty>

            <Command.Group heading="Actions">
              <Command.Item
                className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-200 dark:aria-selected:bg-gray-700"
                onSelect={onNewChat}
              >
                <MessageSquare className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>New Chat</span>
              </Command.Item>
              <Command.Item
                className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-200 dark:aria-selected:bg-gray-700"
                onSelect={onClearChat}
              >
                <Trash2 className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>Clear Chat</span>
              </Command.Item>
              <Command.Item
                className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-200 dark:aria-selected:bg-gray-700"
                onSelect={onExportChat}
              >
                <Download className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>Export Chat</span>
              </Command.Item>
              <Command.Item
                className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-200 dark:aria-selected:bg-gray-700"
                onSelect={() => {}}
              >
                <Share className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>Share Chat</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Settings">
              <Command.Item
                className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-200 dark:aria-selected:bg-gray-700"
                onSelect={onOpenSettings}
              >
                <Settings className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>Open Settings</span>
              </Command.Item>
              <Command.Item
                className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-200 dark:aria-selected:bg-gray-700"
                onSelect={onToggleTheme}
              >
                {theme === "dark" ? (
                  <Sun className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Moon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                )}
                <span>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</span>
              </Command.Item>
              <Command.Item
                className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-200 dark:aria-selected:bg-gray-700"
                onSelect={onShowKeyboardShortcuts}
              >
                <Keyboard className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>Keyboard Shortcuts</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Help">
              <Command.Item
                className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-200 dark:aria-selected:bg-gray-700"
                onSelect={() => {}}
              >
                <HelpCircle className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>Help & Documentation</span>
              </Command.Item>
              <Command.Item
                className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-200 dark:aria-selected:bg-gray-700"
                onSelect={() => {}}
              >
                <FileText className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>View Changelog</span>
              </Command.Item>
              <Command.Item
                className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-200 dark:aria-selected:bg-gray-700"
                onSelect={() => {}}
              >
                <Zap className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>Quick Tips</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </Dialog>
  )
}
