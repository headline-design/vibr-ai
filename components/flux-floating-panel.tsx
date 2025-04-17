"use client"

import { useState } from "react"
import { X, ChevronLeft, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import RefinedChatInterface from "@/components/flow-state/chat-interface"

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
        "fixed bottom-0 w-full h-full sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[92vh] sm:max-h-[600px] bg-background sm:rounded-xl sm:shadow-2xl border flex flex-col overflow-hidden z-50 transition-all duration-300 ease-in-out",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      {/* Dynamic Header */}
      <div className="flex items-center justify-between p-3.5 border-b bg-background backdrop-blur-sm">
        <div className="flex items-center">
          {currentView === "settings" ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeSettings}
                className="h-8 w-8 mr-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-medium text-primary">Settings</h3>
            </>
          ) : (
            <h3 className="font-medium text-primary ">VIBR Assistant</h3>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {currentView === "chat" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={openSettings}
              className="h-8 w-8 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <RefinedChatInterface
          currentView={currentView}
          onOpenSettings={openSettings}
          onCloseSettings={closeSettings}
          hideHeader={true}
        />
      </div>
    </div>
  )
}
