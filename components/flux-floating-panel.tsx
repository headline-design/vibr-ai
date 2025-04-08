"use client"

import { useState } from "react"
import { X, ChevronLeft, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import ChatInterface from "./flow-state/chat-interface"

interface FluxFloatingPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function FluxFloatingPanel({ isOpen, onClose }: FluxFloatingPanelProps) {
  const [currentView, setCurrentView] = useState<"chat" | "settings">("chat")

  // Handle view changes
  const openSettings = () => setCurrentView("settings")
  const closeSettings = () => setCurrentView("chat")

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 w-[420px] h-[620px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden z-50 transition-all duration-300 ease-in-out",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      {/* Dynamic Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <div className="flex items-center">
          {currentView === "settings" ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeSettings}
                className="h-8 w-8 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Settings</h3>
            </>
          ) : (
            <h3 className="font-medium text-gray-800 dark:text-gray-200">AI Assistant</h3>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {currentView === "chat" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={openSettings}
              className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatInterface
          currentView={currentView}
          onOpenSettings={openSettings}
          onCloseSettings={closeSettings}
          hideHeader={true}
        />
      </div>
    </div>
  )
}
