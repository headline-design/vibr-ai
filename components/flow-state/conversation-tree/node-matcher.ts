import { type ConversationNode, ProximityCategory } from "./tree-types"
import { isGreetingToFlux, isGeneralGreeting, isAppQuestion, isGratitude, isFarewell } from "../greeting-patterns"

// Helper function to evaluate conditions
export function evaluateConditions(conditions: ConversationNode["conditions"], metaSession: any): boolean {
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
export function isAppRelatedQuery(message: string): boolean {
  // Check if it's a direct question about the app
  if (isAppQuestion(message)) {
    return true
  }

  const appRelatedKeywords = [
    "flux",
    "how to use",
    "what can you do",
    "what are you",
  ]

  const lowerMessage = message.toLowerCase()
  return appRelatedKeywords.some((keyword) => lowerMessage.includes(keyword))
}

// Helper function to find matching node
export function findMatchingNode(
  message: string,
  messageCount: number,
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
  if (isGreetingToFlux(lowerMessage, messageCount)) {
    // Find the hello_flux_greeting node
    const helloFluxNode = nodes.find((node) => node.id === "hello_flux_greeting")
    if (helloFluxNode) {
      return { node: helloFluxNode, isHighProximity: true }
    }
  }

  // Check for general greetings
  if (isGeneralGreeting(lowerMessage, messageCount)) {

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
        node.category === ProximityCategory.INTERACTION_SPECIFIC ||
        node.category === ProximityCategory.PROJECT_MANAGEMENT,
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
          node.category?.toString().startsWith("interaction_") ||
          node.category?.toString().startsWith("project_")) &&
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
