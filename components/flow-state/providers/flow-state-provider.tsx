"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useConversationTree } from "@/components/flow-state/conversation-tree/conversation-tree-provider"
import { v4 as uuidv4 } from "uuid"
import type { ChatMessage, ChatAction } from "@/components/flow-state/chat-interface"

// Define the flow state context
interface FlowStateContextProps {
  messages: ChatMessage[]
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  handleSendMessage: (message: string, parentId?: string) => void
  handleActionClick: (messageId: string, actionId: string) => void
  isWaitingForResponse: boolean
  clearMessages: () => void
}

// Create the flow state context
const FlowStateContext = createContext<FlowStateContextProps>({
  messages: [],
  setMessages: () => {},
  handleSendMessage: () => {},
  handleActionClick: () => {},
  isWaitingForResponse: false,
  clearMessages: () => {},
})

// Create the flow state provider
export function FlowStateProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
  const { processUserMessage } = useConversationTree()

  // Handle sending a message
  const handleSendMessage = useCallback(
    async (message: string, parentId?: string) => {
      if (!message.trim()) return

      // Generate a unique ID for the message
      const messageId = uuidv4()

      // Add the user message to the messages array
      const userMessage: ChatMessage = {
        id: messageId,
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
        parentId,
      }

      setMessages((prev) => [...prev, userMessage])

      // Add a thinking message
      const thinkingMessageId = uuidv4()
      setMessages((prev) => [
        ...prev,
        {
          id: thinkingMessageId,
          role: "assistant",
          content: "Thinking...",
          timestamp: new Date().toISOString(),
          parentId: messageId,
          isThinking: true,
        },
      ])

      setIsWaitingForResponse(true)

      try {
        // Process the user message
        const { response, isClientOnly, actions, component, componentProps } = await processUserMessage(message)

        // Remove the thinking message and add the assistant response
        setMessages((prev) => {
          const filteredMessages = prev.filter((msg) => msg.id !== thinkingMessageId)
          return [
            ...filteredMessages,
            {
              id: uuidv4(),
              role: "assistant",
              content: response,
              timestamp: new Date().toISOString(),
              parentId: messageId,
              actions: actions?.map((action) => ({
                ...action,
                variant: action.variant as "default" | "secondary" | "outline" | "destructive" | undefined,
              })),
              component,
              componentProps,
            },
          ]
        })
      } catch (error) {
        console.error("Error processing message:", error)

        // Remove the thinking message and add an error message
        setMessages((prev) => {
          const filteredMessages = prev.filter((msg) => msg.id !== thinkingMessageId)
          return [
            ...filteredMessages,
            {
              id: uuidv4(),
              role: "assistant",
              content: "Sorry, I encountered an error processing your message. Please try again.",
              timestamp: new Date().toISOString(),
              parentId: messageId,
            },
          ]
        })
      } finally {
        setIsWaitingForResponse(false)
      }
    },
    [processUserMessage],
  )

  // Handle clicking an action button
  const handleActionClick = useCallback(
    (messageId: string, actionId: string) => {
      // Find the message with the action
      const message = messages.find((msg) => msg.id === messageId)
      if (!message) return

      // Ensure actions are typed correctly
      const action = (message.actions as ChatAction[] | undefined)?.find((action) => action.id === actionId)
      if (!action) return

      // Handle the action
      handleSendMessage(action.label, message.id)
    },
    [messages, handleSendMessage],
  )

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return (
    <FlowStateContext.Provider
      value={{
        messages,
        setMessages,
        handleSendMessage,
        handleActionClick,
        isWaitingForResponse,
        clearMessages,
      }}
    >
      {children}
    </FlowStateContext.Provider>
  )
}

// Create a hook to use the flow state context
export function useFlowState() {
  return useContext(FlowStateContext)
}
