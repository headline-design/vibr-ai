import type React from "react"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import { useMetaSession } from "@/components/flow-state/providers/meta-session-provider"
import { conversationNodes } from "./conversation-nodes"
import { detectIntent } from "../intent-patterns"
import { useToast } from "@/components/ui/use-toast"
import { projectNodes } from "./project-tree"
import type { ProximityCategory } from "./tree-types"
import { findMatchingNode } from "./node-matcher"
import { handleIntentConditions, setPendingIntent } from "./conditions/intent-conditions"
import { handleProjectConditions } from "./conditions/project-conditions"
import { useMessages } from "@/components/flow-state/providers/message-provider"
import { getLLMResponse } from "@/lib/ai-service"
import { ChatMessage } from "../chat-interface"

// Define the structure of MetaSessionData
interface MetaSessionData {
  userName: string
  timeOfDay: string
  interactionCount: number
  lastTopics: string[]
  preferredLanguages: string[]
  deviceType: string
  sessionDuration: number
  lastProjectName?: string
}

// Define the node structure for our conversation tree
export interface ConversationNode {
  id: string
  content: string | ((metaSession: any) => string)
  clientOnly?: boolean
  category?: ProximityCategory
  conditions?: {
    key: keyof MetaSessionData
    operator: "equals" | "contains" | "greaterThan" | "lessThan"
    value: any
  }[]
  children?: ConversationNode[]
  fallback?: string
  actions?: Array<{ id: string; label: string; variant?: string }>
  component?: React.ComponentType<any>
}

// Define the conversation tree context
interface ConversationTreeContextProps {
  currentNode: ConversationNode | null
  messages: ChatMessage[]
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  processUserMessage: (message: string) => Promise<{
    response: string | any
    isClientOnly: boolean
    actions?: Array<{ id: string; label: string; variant?: string }>
    component?: React.ComponentType<any>
    componentProps?: any
  }>
  isProcessing: boolean
  handleUpdateMetaSession: (updates: Partial<MetaSessionData>) => void
}

// Create the conversation tree context
const ConversationTreeContext = createContext<ConversationTreeContextProps>({
  currentNode: null,
  processUserMessage: async () => ({ response: "", isClientOnly: false }),
  isProcessing: false,
  handleUpdateMetaSession: () => { },
  messages: [],
  setMessages: () => { },
})

// Create the conversation tree provider
export function ConversationTreeProvider({ children }: { children: ReactNode }) {
  const { metaSession, incrementInteractionCount, addTopic, updateMetaSession } = useMetaSession()
  const [currentNode, setCurrentNode] = useState<ConversationNode | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const { addMessage } = useMessages()

  // Function to update the meta session
  const handleUpdateMetaSession = useCallback(
    (updates: Partial<MetaSessionData>) => {
      console.log("Updating meta session:", updates)
      updateMetaSession(updates)
    },
    [updateMetaSession],
  )

  const processUserMessage = useCallback(
    async (message: string) => {
      setIsProcessing(true)
      console.log("Processing user message:", message)

      try {
        // Extract potential topics from the message
        const words = message.toLowerCase().split(/\s+/)
        const potentialTopics = ["code", "javascript", "typescript", "react", "help", "debug", "career", "project"]
        const detectedTopics = potentialTopics.filter((topic) => words.includes(topic))

        if (detectedTopics.length > 0) {
          addTopic(detectedTopics[0])
        }

        // Check for project-specific conditions
        const projectResult = await handleProjectConditions(message, {
          metaSession,
          updateMetaSession: handleUpdateMetaSession,
          toast,
        })

        if (projectResult) {
          return projectResult
        }

        console.log("project result:", projectResult)

        // Check for intent-specific conditions
        const intentResult = await handleIntentConditions(message, {
          metaSession,
        })

        if (intentResult) {
          return intentResult
        }

        // First, check for specific intents using the intent detector
        const { intent, confidence, confirmationMessage, actions } = detectIntent(message)
        console.log("Intent detection result:", { intent, confidence, confirmationMessage, actions })

        // If we have a high-confidence intent match with a confirmation message
        if (intent && confidence > 0.5 && confirmationMessage) {
          console.log("Setting pending intent:", intent)
          setPendingIntent({ intent, confirmationMessage, originalMessage: message, actions })

          // Return a response with action buttons for Yes/No
          return {
            response: confirmationMessage,
            isClientOnly: true,
            actions: actions,
          }
        }

        // If no specific intent was detected, find a matching node in the conversation tree
        const allNodes = [...conversationNodes, ...projectNodes]
        const messageCount = messages.filter((m) => m.role === "user").length
        const { node: matchingNode, isHighProximity } = findMatchingNode(message, messageCount, allNodes, metaSession)
        setCurrentNode(matchingNode)

        // Increment interaction count
        incrementInteractionCount()

        // If it's a high-proximity match or explicitly marked as clientOnly, use client-side response
        if (matchingNode && (isHighProximity || matchingNode.clientOnly)) {
          const content =
            matchingNode && typeof matchingNode.content === "function"
              ? matchingNode.content(metaSession)
              : matchingNode?.content || ""

          // Simulate network delay for client-side responses to make them feel like LLM responses
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // Get actions if they exist
          const actions = matchingNode.actions || undefined

          return {
            response: content,
            isClientOnly: true,
            actions,
            component: matchingNode.component,
            componentProps: {
              onComplete: (success: boolean, projectName?: string) => {
                if (success && projectName) {
                  handleUpdateMetaSession({ lastProjectName: projectName })
                }
              },
              onCancel: () => {
                console.log("Action cancelled")
              },
            },
          }
        } else {
          // For low-proximity matches, use LLM but with the node content as context
          const llmResponse = await getLLMResponse(message)
          const nodeContent =
            matchingNode && typeof matchingNode.content === "function"
              ? matchingNode.content(metaSession)
              : matchingNode?.content || ""

          // Fuse the responses - in a real implementation, you might use the node content
          // as context for the LLM rather than just concatenating
          const fusedResponse = nodeContent ? `${nodeContent}\n\n${llmResponse}` : llmResponse
          return { response: fusedResponse, isClientOnly: false, actions: undefined }
        }
      } finally {
        setIsProcessing(false)
      }
    },
    [metaSession, incrementInteractionCount, addTopic, handleUpdateMetaSession, toast, addMessage],
  )

  const contextValue = useMemo(
    () => ({
      currentNode,
      processUserMessage,
      isProcessing,
      handleUpdateMetaSession,
      messages,
      setMessages,
    }),
    [currentNode, processUserMessage, isProcessing, handleUpdateMetaSession],
  )

  return <ConversationTreeContext.Provider value={contextValue}>{children}</ConversationTreeContext.Provider>
}

// Create a hook to use the conversation tree context
export function useConversationTree() {
  return useContext(ConversationTreeContext)
}
