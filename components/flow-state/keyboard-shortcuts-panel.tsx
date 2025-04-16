"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Keyboard, ArrowUp, ArrowDown, DoorOpenIcon as Enter, Slash, Command } from "lucide-react"

interface KeyboardShortcutsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcutsPanel({ isOpen, onClose }: KeyboardShortcutsPanelProps) {
  const shortcuts = {
    navigation: [
      { keys: ["↑", "↓"], description: "Navigate through messages" },
      { keys: ["Page Up", "Page Down"], description: "Scroll chat history" },
      { keys: ["Home"], description: "Scroll to top" },
      { keys: ["End"], description: "Scroll to bottom" },
      { keys: ["Tab"], description: "Navigate between interactive elements" },
    ],
    composition: [
      { keys: ["Enter"], description: "Send message" },
      { keys: ["Shift", "Enter"], description: "Insert new line" },
      { keys: ["Esc"], description: "Cancel current action" },
      { keys: ["↑"], description: "Edit last message (when input is empty)" },
      { keys: ["/"], description: "Open slash commands" },
    ],
    actions: [
      { keys: ["Ctrl/⌘", "K"], description: "Open command palette" },
      { keys: ["Ctrl/⌘", "F"], description: "Search in conversation" },
      { keys: ["Ctrl/⌘", "Shift", "C"], description: "Copy last message" },
      { keys: ["Ctrl/⌘", "Shift", "S"], description: "Save conversation" },
      { keys: ["Ctrl/⌘", "N"], description: "New conversation" },
    ],
    accessibility: [
      { keys: ["Alt", "1"], description: "Focus message input" },
      { keys: ["Alt", "2"], description: "Focus message list" },
      { keys: ["Alt", "A"], description: "Toggle accessibility panel" },
      { keys: ["Ctrl/⌘", "/"], description: "Show keyboard shortcuts" },
    ],
  }

  // Render a keyboard key
  const renderKey = (key: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "↑": <ArrowUp className="h-3 w-3" />,
      "↓": <ArrowDown className="h-3 w-3" />,
      Enter: <Enter className="h-3 w-3" />,
      "/": <Slash className="h-3 w-3" />,
      K: <Command className="h-3 w-3" />,
    }

    return (
      <kbd className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded border border-gray-200 bg-gray-100 text-xs font-medium text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
        {iconMap[key] || key}
      </kbd>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Keyboard className="h-5 w-5 mr-2" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="navigation">
          <TabsList className="grid grid-cols-4 mb-4">
            {Object.keys(shortcuts).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(shortcuts).map(([category, shortcutList]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="space-y-2">
                {shortcutList.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="flex items-center">
                          {keyIndex > 0 && <span className="mx-1 text-gray-400 dark:text-gray-600">+</span>}
                          {renderKey(key)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm text-gray-600 dark:text-gray-400">
          <p>
            Press{" "}
            <span className="inline-flex items-center">
              {renderKey("Ctrl/⌘")} + {renderKey("/")}
            </span>{" "}
            at any time to show this dialog.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
