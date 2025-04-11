"use client"

import { useState } from "react"
import ChatInterface from "./chat-interface"
import { ChatHeader } from "./chat-header"

export function ChatInterfaceWithProjects() {
  const [currentView, setCurrentView] = useState<"chat" | "settings">("chat")

  const handleOpenSettings = () => {
    setCurrentView("settings")
  }

  const handleCloseSettings = () => {
    setCurrentView("chat")
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        title="AI Assistant"
        onSettingsClick={handleOpenSettings}
        showSettings={currentView === "chat"}
        showBackButton={currentView === "settings"}
        onBackClick={handleCloseSettings}
      />
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          hideHeader={true}
          currentView={currentView}
          onOpenSettings={handleOpenSettings}
          onCloseSettings={handleCloseSettings}
          setEmbeddedChatView={setCurrentView}
        />
      </div>
    </div>
  )
}
