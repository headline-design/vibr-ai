"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import { useMetaSession } from "./meta-session-provider"
import { conversationNodes, ProximityCategory } from "./conversation-nodes"
import { isGreetingToFlux, isGeneralGreeting, isAppQuestion, isGratitude, isFarewell } from "./greeting-patterns"
import { detectIntent, isConfirmation, isDenial } from "./intent-patterns"

// Define the structure of MetaSessionData
interface MetaSessionData {
  userName: string
  timeOfDay: string
  interactionCount: number
  lastTopics: string[]
  preferredLanguages: string[]
  deviceType: string
  sessionDuration: number
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
}

// Define the conversation tree context
interface ConversationTreeContextProps {
  currentNode: ConversationNode | null
  processUserMessage: (message: string) => Promise<{
    response: string
    isClientOnly: boolean
    actions?: Array<{ id: string; label: string; variant?: string }>
  }>
  isProcessing: boolean
}

// Create the conversation tree context
const ConversationTreeContext = createContext<ConversationTreeContextProps>({
  currentNode: null,
  processUserMessage: async () => ({ response: "", isClientOnly: false }),
  isProcessing: false,
})

// Helper function to evaluate conditions
function evaluateConditions(conditions: ConversationNode["conditions"], metaSession: any): boolean {
  if (!conditions || conditions.length === 0) return true

  return conditions.every((condition) => {
    const { key, operator, value } = condition
    const sessionValue = metaSession[key]

    switch (operator) {
      case "equals":
        return sessionValue === value
      case "contains":
        return Array.isArray(sessionValue) && sessionValue.includes(value)
      case "greaterThan":
        return sessionValue > value
      case "lessThan":
        return sessionValue < value
      default:
        return false
    }
  })
}

// Helper function to determine if a message is about the app itself
function isAppRelatedQuery(message: string): boolean {
  // Check if it's a direct question about the app
  if (isAppQuestion(message)) {
    return true
  }

  const appRelatedKeywords = [
    "app",
    "flux",
    "feature",
    "help",
    "how to use",
    "settings",
    "preferences",
    "interface",
    "ui",
    "dashboard",
    "account",
    "profile",
    "login",
    "logout",
    "how does this work",
    "what can you do",
    "what are you",
  ]

  const lowerMessage = message.toLowerCase()
  return appRelatedKeywords.some((keyword) => lowerMessage.includes(keyword))
}

// Helper function to find matching node
function findMatchingNode(
  message: string,
  nodes: ConversationNode[],
  metaSession: any,
): {
  node: ConversationNode | null
  isHighProximity: boolean
} {
  // Simple keyword matching for demo purposes
  // In a real implementation, you'd use NLP or more sophisticated matching
  const lowerMessage = message.toLowerCase().trim()

  // Check for specific greeting patterns first
  if (isGreetingToFlux(lowerMessage)) {
    // Find the hello_flux_greeting node
    const helloFluxNode = nodes.find((node) => node.id === "hello_flux_greeting")
    if (helloFluxNode) {
      return { node: helloFluxNode, isHighProximity: true }
    }
  }

  // Check for general greetings
  if (isGeneralGreeting(lowerMessage)) {
    const generalGreetingNode = nodes.find((node) => node.id === "general_greeting")
    if (generalGreetingNode) {
      return { node: generalGreetingNode, isHighProximity: true }
    }
  }

  // Check for gratitude expressions
  if (isGratitude(lowerMessage)) {
    const gratitudeNode = nodes.find((node) => node.id === "gratitude_response")
    if (gratitudeNode) {
      return { node: gratitudeNode, isHighProximity: true }
    }
  }

  // Check for farewell expressions
  if (isFarewell(lowerMessage)) {
    const farewellNode = nodes.find((node) => node.id === "farewell_response")
    if (farewellNode) {
      return { node: farewellNode, isHighProximity: true }
    }
  }

  // Check if this is an app-related query
  const isAppRelated = isAppRelatedQuery(message)

  // First, try to find high-proximity matches if it's app-related
  if (isAppRelated) {
    // Look for nodes in high-proximity categories
    const highProximityNodes = nodes.filter(
      (node) =>
        node.category === ProximityCategory.APP_SPECIFIC ||
        node.category === ProximityCategory.USER_SPECIFIC ||
        node.category === ProximityCategory.SESSION_SPECIFIC ||
        node.category === ProximityCategory.INTERACTION_SPECIFIC,
    )

    // Try to find a direct match in high-proximity nodes
    for (const node of highProximityNodes) {
      if (node.id.toLowerCase().includes(lowerMessage) && evaluateConditions(node.conditions, metaSession)) {
        return { node, isHighProximity: true }
      }
    }

    // If asking about app capabilities
    if (
      lowerMessage.includes("what can you do") ||
      lowerMessage.includes("capabilities") ||
      lowerMessage.includes("features")
    ) {
      const capabilitiesNode = nodes.find((node) => node.id === "app_capabilities")
      if (capabilitiesNode) {
        return { node: capabilitiesNode, isHighProximity: true }
      }
    }

    // If asking for help with the app
    if (
      lowerMessage.includes("how to use") ||
      lowerMessage.includes("help me use") ||
      lowerMessage.includes("how do i use")
    ) {
      const helpNode = nodes.find((node) => node.id === "app_help")
      if (helpNode) {
        return { node: helpNode, isHighProximity: true }
      }
    }
  }

  // For non-app-related queries, or if no high-proximity match was found
  // Look for nodes in low-proximity categories
  const lowProximityNodes = nodes.filter(
    (node) =>
      node.category === ProximityCategory.DOMAIN_KNOWLEDGE ||
      node.category === ProximityCategory.CAREER_ADVICE ||
      node.category === ProximityCategory.GENERAL_KNOWLEDGE,
  )

  // Try to find a direct match in low-proximity nodes
  for (const node of lowProximityNodes) {
    if (node.id.toLowerCase().includes(lowerMessage) && evaluateConditions(node.conditions, metaSession)) {
      return { node, isHighProximity: false }
    }
  }

  // If no direct match, try to match based on conditions only
  // First in high-proximity nodes if app-related
  if (isAppRelated) {
    for (const node of nodes) {
      if (
        (node.category?.toString().startsWith("app_") ||
          node.category?.toString().startsWith("user_") ||
          node.category?.toString().startsWith("session_") ||
          node.category?.toString().startsWith("interaction_")) &&
        evaluateConditions(node.conditions, metaSession)
      ) {
        return { node, isHighProximity: true }
      }
    }
  }

  // Then in low-proximity nodes
  for (const node of nodes) {
    if (
      (node.category?.toString().startsWith("domain_") ||
        node.category?.toString().startsWith("career_") ||
        node.category?.toString().startsWith("general_")) &&
      evaluateConditions(node.conditions, metaSession)
    ) {
      return { node, isHighProximity: false }
    }
  }

  // If still no match, return appropriate fallback based on whether it's app-related
  const fallbackNode = isAppRelated
    ? nodes.find((node) => node.id === "fallback_client")
    : nodes.find((node) => node.id === "fallback_llm")

  return {
    node: fallbackNode || null,
    isHighProximity: isAppRelated,
  }
}

// Mock LLM response function
async function getLLMResponse(message: string): Promise<string> {
  // In a real implementation, this would call your LLM API
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
  return `I processed your message: "${message}" through the LLM model and generated this response.`
}

// Create the conversation tree provider
export function ConversationTreeProvider({ children }: { children: ReactNode }) {
  const { metaSession, incrementInteractionCount, addTopic } = useMetaSession()
  const [currentNode, setCurrentNode] = useState<ConversationNode | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pendingIntent, setPendingIntent] = useState<{
    intent: string
    confirmationMessage: string
    originalMessage: string
  } | null>(null)

  const processUserMessage = useCallback(
    async (message: string) => {
      setIsProcessing(true)

      try {
        // Extract potential topics from the message
        const words = message.toLowerCase().split(/\s+/)
        const potentialTopics = ["code", "javascript", "typescript", "react", "help", "debug", "career"]
        const detectedTopics = potentialTopics.filter((topic) => words.includes(topic))

        if (detectedTopics.length > 0) {
          addTopic(detectedTopics[0])
        }

        // Check if this is a response to a pending intent confirmation
        if (pendingIntent) {
          console.log("Handling pending intent:", pendingIntent)
          if (isConfirmation(message)) {
            console.log("User confirmed intent")
            // User confirmed the intent, handle it
            const intentNode = conversationNodes.find((node) => node.id === pendingIntent.intent)
            setPendingIntent(null)

            if (intentNode) {
              const content =
                typeof intentNode.content === "function" ? intentNode.content(metaSession) : intentNode.content

              return { response: content, isClientOnly: true, actions: undefined }
            }
          } else if (isDenial(message)) {
            console.log("User denied intent")
            // User denied the intent, process the original message with LLM
            const originalMessage = pendingIntent.originalMessage
            setPendingIntent(null)
            const denialNode = conversationNodes.find((node) => node.id === "denial_response")

            if (denialNode) {
              const content =
                typeof denialNode.content === "function" ? denialNode.content(metaSession) : denialNode.content

              // Use LLM for the original message, not the "no" response
              const llmResponse = await getLLMResponse(originalMessage)
              return { response: `${content}\n\n${llmResponse}`, isClientOnly: false, actions: undefined }
            }
          }
        }

        // Detect intent from the message
        const { intent, confidence, confirmationMessage } = detectIntent(message)
        console.log("Intent detection result:", { intent, confidence, confirmationMessage })

        // Lower the confidence threshold to catch more intents
        if (intent && confidence > 0.2 && confirmationMessage) {
          console.log("Setting pending intent:", intent)
          setPendingIntent({ intent, confirmationMessage, originalMessage: message })

          // Return a response with action buttons for Yes/No
          return {
            response: confirmationMessage,
            isClientOnly: true,
            actions: [
              { id: "yes", label: "Yes", variant: "default" },
              { id: "no", label: "No", variant: "outline" },
            ],
          }
        }

        // Find matching node in conversation tree
        const { node: matchingNode, isHighProximity } = findMatchingNode(message, conversationNodes, metaSession)
        setCurrentNode(matchingNode)

        // Increment interaction count
        incrementInteractionCount()

        // If it's a high-proximity match or explicitly marked as clientOnly, use client-side response
        if (matchingNode && (isHighProximity || matchingNode.clientOnly)) {
          const content =
            matchingNode && typeof matchingNode.content === "function" ? matchingNode.content(metaSession) : matchingNode?.content

          // Simulate network delay for client-side responses to make them feel like LLM responses
          // Simple fixed delay of 1.5 seconds
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // Get actions if they exist
          const actions = matchingNode.actions || undefined

          return { response: typeof content === "function" ? content(metaSession) : content, isClientOnly: true, actions }
        } else {
          // For low-proximity matches, use LLM but with the node content as context
          const llmResponse = await getLLMResponse(message)
          const nodeContent =
            matchingNode && typeof matchingNode.content === "function" ? matchingNode.content(metaSession) : matchingNode?.content

          // Fuse the responses - in a real implementation, you might use the node content
          // as context for the LLM rather than just concatenating
          const fusedResponse = `${typeof nodeContent === "function" ? nodeContent(metaSession) : nodeContent}\n\n${llmResponse}`
          return { response: fusedResponse, isClientOnly: false, actions: undefined }
        }
      } finally {
        setIsProcessing(false)
      }
    },
    [metaSession, incrementInteractionCount, addTopic, pendingIntent],
  )

  const contextValue = useMemo(
    () => ({
      currentNode,
      processUserMessage,
      isProcessing,
    }),
    [currentNode, processUserMessage, isProcessing],
  )

  return <ConversationTreeContext.Provider value={contextValue}>{children}</ConversationTreeContext.Provider>
}

// Create a hook to use the conversation tree context
export function useConversationTree() {
  return useContext(ConversationTreeContext)
}
