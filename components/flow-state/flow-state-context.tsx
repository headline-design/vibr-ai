"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useConversationTree } from "./conversation-tree"
import { useMetaSession } from "./meta-session-provider"

// Define the message type
export interface FlowStateMessage {
  id: string
  role: "user" | "assistant" | "system"
  parentId?: string
  content: string
  isThinking?: boolean
  timestamp?: string
  actions?: Array<{
    id: string
    label: string
    variant?: "default" | "secondary" | "default" | "outline" | "destructive"
  }>
}

// Define the context type
interface FlowStateContextType {
  messages: FlowStateMessage[]
  setMessages: React.Dispatch<React.SetStateAction<FlowStateMessage[]>>
  handleSendMessage: (message: string, editId?: string) => void
  isWaitingForResponse: boolean
  clearMessages: () => void
  showSuggestions: boolean
  setShowSuggestions: (show: boolean) => void
}

// Create the context
const FlowStateContext = createContext<FlowStateContextType>({
  messages: [],
  setMessages: () => {},
  handleSendMessage: () => {},
  isWaitingForResponse: false,
  clearMessages: () => {},
  showSuggestions: true,
  setShowSuggestions: () => {},
})

interface FlowStateProviderProps {
  children: ReactNode
  initialShowSuggestions?: boolean
}

// Create the provider component
export function FlowStateProvider({ children, initialShowSuggestions = true }: FlowStateProviderProps) {
  // Add an initial welcome message
  const [messages, setMessages] = useState<FlowStateMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(initialShowSuggestions)
  const { processUserMessage } = useConversationTree()
  const { metaSession, updateMetaSession } = useMetaSession()

  // Initialize user name if needed
  useEffect(() => {
    if (metaSession.userName === "Guest") {
      // In a real app, you might prompt for the user's name
      // For now, we'll just use a random name
      const randomNames = ["Alex", "Jordan", "Taylor", "Casey", "Riley"]
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)]
      updateMetaSession({ userName: randomName })
    }
  }, [metaSession.userName, updateMetaSession])

  // Function to handle sending a message
  const handleSendMessage = useCallback(
    async (content: string, editId?: string) => {
      if (!content.trim()) return

      // If editing an existing message
      if (editId) {
        setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === editId ? { ...msg, content } : msg)))
        return
      }

      // Add user message
      const userMessageId = uuidv4()
      const userMessage: FlowStateMessage = {
        id: userMessageId,
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      }

      setMessages((prevMessages) => [...prevMessages, userMessage])

      // Add thinking message
      const thinkingMessageId = uuidv4()
      const thinkingMessage: FlowStateMessage = {
        id: thinkingMessageId,
        role: "assistant",
        content: "Thinking...",
        isThinking: true,
        timestamp: new Date().toISOString(),
      }

      setMessages((prevMessages) => [...prevMessages, thinkingMessage])
      setIsWaitingForResponse(true)

      try {
        // Process the message using the conversation tree
        const { response, isClientOnly, actions } = await processUserMessage(content)

        // Replace thinking message with actual response
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === thinkingMessageId
              ? {
                  id: thinkingMessageId,
                  role: "assistant",
                  content: response,
                  isThinking: false, // Set to false immediately
                  timestamp: new Date().toISOString(),
                  actions: actions?.map((action) => ({
                    ...action,
                    variant: action.variant as
                      | "default"
                      | "secondary"
                      | "default"
                      | "outline"
                      | "destructive"
                      | undefined,
                  })),
                }
              : msg,
          ),
        )

        // Set waiting for response to false after a short delay
        setTimeout(() => {
          setIsWaitingForResponse(false)
        }, 500)
      } catch (error) {
        console.error("Error processing message:", error)
        // Replace thinking message with error message
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === thinkingMessageId
              ? {
                  id: thinkingMessageId,
                  role: "assistant",
                  content: "Sorry, I encountered an error processing your request.",
                  timestamp: new Date().toISOString(),
                }
              : msg,
          ),
        )
        setIsWaitingForResponse(false)
      }
    },
    [processUserMessage],
  )

  // Function to clear all messages
  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  // Provide the context value
  const contextValue = {
    messages,
    setMessages,
    handleSendMessage,
    isWaitingForResponse,
    clearMessages,
    showSuggestions,
    setShowSuggestions,
  }

  return <FlowStateContext.Provider value={contextValue}>{children}</FlowStateContext.Provider>
}

// Create a hook to use the flow state context
export function useFlowState() {
  return useContext(FlowStateContext)
}
