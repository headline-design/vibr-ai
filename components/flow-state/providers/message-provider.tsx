"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"

// Define message types
export interface Message {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  timestamp: number
  status?: "thinking" | "complete" | "error"
  actions?: Array<{ id: string; label: string; variant?: string }>
  metadata?: Record<string, any>
}

// Define the context interface
interface MessageContextProps {
  messages: Message[]
  addMessage: (message: Omit<Message, "id" | "timestamp">) => string
  updateMessage: (id: string, updates: Partial<Message>) => void
  removeMessage: (id: string) => void
  setMessageThinking: (id: string, isThinking: boolean) => void
  clearMessages: () => void
  getLastMessage: () => Message | undefined
  getLastUserMessage: () => Message | undefined
}

// Create the context
const MessageContext = createContext<MessageContextProps>({
  messages: [],
  addMessage: () => "",
  updateMessage: () => {},
  removeMessage: () => {},
  setMessageThinking: () => {},
  clearMessages: () => {},
  getLastMessage: () => undefined,
  getLastUserMessage: () => undefined,
})

// Create the provider component
export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])

  // Add a new message
  const addMessage = useCallback((message: Omit<Message, "id" | "timestamp">) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const newMessage: Message = {
      ...message,
      id,
      timestamp: Date.now(),
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])
    return id
  }, [])

  // Update an existing message
  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)))
  }, [])

  // Remove a message
  const removeMessage = useCallback((id: string) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id))
  }, [])

  // Set a message to thinking state
  const setMessageThinking = useCallback((id: string, isThinking: boolean) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === id ? { ...msg, status: isThinking ? "thinking" : "complete" } : msg)),
    )
  }, [])

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  // Get the last message
  const getLastMessage = useCallback(() => {
    return messages[messages.length - 1]
  }, [messages])

  // Get the last user message
  const getLastUserMessage = useCallback(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        return messages[i]
      }
    }
    return undefined
  }, [messages])

  // Create the context value
  const contextValue = useMemo(
    () => ({
      messages,
      addMessage,
      updateMessage,
      removeMessage,
      setMessageThinking,
      clearMessages,
      getLastMessage,
      getLastUserMessage,
    }),
    [
      messages,
      addMessage,
      updateMessage,
      removeMessage,
      setMessageThinking,
      clearMessages,
      getLastMessage,
      getLastUserMessage,
    ],
  )

  return <MessageContext.Provider value={contextValue}>{children}</MessageContext.Provider>
}

// Create a hook to use the message context
export function useMessages() {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider")
  }
  return context
}
