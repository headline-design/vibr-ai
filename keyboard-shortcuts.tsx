"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  const shortcuts = [
    { key: "Enter", description: "Send message" },
    { key: "Shift + Enter", description: "Add new line" },
    { key: "Esc", description: "Cancel editing / Close dialogs" },
    { key: "↑", description: "Edit last message" },
    { key: "Ctrl/Cmd + K", description: "Open command palette" },
    { key: "Ctrl/Cmd + /", description: "Show keyboard shortcuts" },
    { key: "Ctrl/Cmd + F", description: "Search in conversation" },
    { key: "Ctrl/Cmd + Shift + C", description: "Copy last message" },
    { key: "Alt + M", description: "Toggle microphone" },
    { key: "Alt + F", description: "Toggle fullscreen" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">{shortcut.description}</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
