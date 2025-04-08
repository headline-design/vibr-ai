"use client"

import { useState, useEffect } from "react"
import { Keyboard, Command, ArrowUp, ArrowDown, DoorOpenIcon as Enter, Search, Slash, Mic } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ShortcutCategory {
  name: string
  shortcuts: {
    keys: string[]
    description: string
  }[]
}

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  const [isMac, setIsMac] = useState(false)

  // Detect OS
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0)
  }, [])

  // Shortcut categories
  const categories: ShortcutCategory[] = [
    {
      name: "Navigation",
      shortcuts: [
        {
          keys: ["↑", "↓"],
          description: "Navigate through messages",
        },
        {
          keys: ["Page Up", "Page Down"],
          description: "Scroll chat history",
        },
        {
          keys: ["Home"],
          description: "Scroll to top",
        },
        {
          keys: ["End"],
          description: "Scroll to bottom",
        },
        {
          keys: ["Tab"],
          description: "Navigate between interactive elements",
        },
      ],
    },
    {
      name: "Composition",
      shortcuts: [
        {
          keys: ["Enter"],
          description: "Send message",
        },
        {
          keys: ["Shift", "Enter"],
          description: "Insert new line",
        },
        {
          keys: ["/"],
          description: "Open slash commands",
        },
        {
          keys: ["Esc"],
          description: "Cancel current action",
        },
        {
          keys: ["Alt", "M"],
          description: "Toggle voice recording",
        },
      ],
    },
    {
      name: "Actions",
      shortcuts: [
        {
          keys: [isMac ? "⌘" : "Ctrl", "K"],
          description: "Open command palette",
        },
        {
          keys: [isMac ? "⌘" : "Ctrl", "F"],
          description: "Search messages",
        },
        {
          keys: [isMac ? "⌘" : "Ctrl", "Shift", "C"],
          description: "Copy last message",
        },
        {
          keys: [isMac ? "⌘" : "Ctrl", "Shift", "S"],
          description: "Save conversation",
        },
        {
          keys: [isMac ? "⌘" : "Ctrl", "N"],
          description: "New conversation",
        },
      ],
    },
    {
      name: "Accessibility",
      shortcuts: [
        {
          keys: ["Alt", "1"],
          description: "Focus message input",
        },
        {
          keys: ["Alt", "2"],
          description: "Focus message list",
        },
        {
          keys: ["Alt", "3"],
          description: "Focus toolbar",
        },
        {
          keys: [isMac ? "⌘" : "Ctrl", "/"],
          description: "Show keyboard shortcuts",
        },
        {
          keys: ["Alt", "A"],
          description: "Toggle accessibility panel",
        },
      ],
    },
  ]

  // Render a keyboard key
  const renderKey = (key: string) => {
    return (
      <kbd className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded border border-gray-200 bg-gray-100 text-xs font-medium text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
        {key === "↑" ? (
          <ArrowUp className="h-3 w-3" />
        ) : key === "↓" ? (
          <ArrowDown className="h-3 w-3" />
        ) : key === "Enter" ? (
          <Enter className="h-3 w-3" />
        ) : key === "/" ? (
          <Slash className="h-3 w-3" />
        ) : key === "M" ? (
          <Mic className="h-3 w-3" />
        ) : key === "F" ? (
          <Search className="h-3 w-3" />
        ) : key === "K" ? (
          <Command className="h-3 w-3" />
        ) : (
          key
        )}
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
            {categories.map((category) => (
              <TabsTrigger key={category.name} value={category.name.toLowerCase()}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.name} value={category.name.toLowerCase()} className="space-y-4">
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, index) => (
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

        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-600 dark:text-gray-400">
          <p>
            Press{" "}
            <span className="inline-flex items-center">
              {renderKey(isMac ? "⌘" : "Ctrl")} + {renderKey("/")}
            </span>{" "}
            at any time to show this dialog.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
