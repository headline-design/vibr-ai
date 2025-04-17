"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

// Define the structure of ChatConfigData
export interface ChatConfigData {
  markdownEnabled: boolean | undefined
  enableCmdk: boolean
  enableVoiceInput: boolean
  enableAttachments: boolean
  enableShortcuts: boolean
  enableAccessibilityFeatures: boolean
  showChatAvatar: boolean
}

// Define the default configuration
const defaultChatConfig: ChatConfigData = {
  markdownEnabled: true,
  enableCmdk: false,
  enableVoiceInput: true,
  enableAttachments: true,
  enableShortcuts: true,
  enableAccessibilityFeatures: true,
  showChatAvatar: false,
}

// Define the chat config context
interface ChatConfigContextProps {
  chatConfig: ChatConfigData
  updateChatConfig: (updates: Partial<ChatConfigData>) => void
}

// Create the chat config context
const ChatConfigContext = createContext<ChatConfigContextProps>({
  chatConfig: defaultChatConfig,
  updateChatConfig: () => {},
})

// Create the chat config provider
export function ChatConfigProvider({ children }: { children: React.ReactNode }) {
  const [chatConfig, setChatConfig] = useState<ChatConfigData>(defaultChatConfig)

  // Update config
  const updateChatConfig = (updates: Partial<ChatConfigData>) => {
    setChatConfig((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  return (
    <ChatConfigContext.Provider value={{ chatConfig, updateChatConfig }}>
      {children}
    </ChatConfigContext.Provider>
  )
}

// Create a hook to use the chat config context
export function useChatConfig() {
  return useContext(ChatConfigContext)
}
