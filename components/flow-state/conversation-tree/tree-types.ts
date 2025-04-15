import type React from "react"
// Add action responses to relevant nodes
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
  actions?: Array<{ id: string; label: string; variant?: string }>
  children?: ConversationNode[]
  fallback?: string
  component?: React.ComponentType<any>
}

export interface ConfirmationNode {
  id: string
  content: string
}

// Define categories based on proximity
export enum ProximityCategory {
  // High proximity (client-side handling)
  APP_SPECIFIC = "app_specific",
  USER_SPECIFIC = "user_specific",
  SESSION_SPECIFIC = "session_specific",
  INTERACTION_SPECIFIC = "interaction_specific",

  // Low proximity (LLM handling)
  DOMAIN_KNOWLEDGE = "domain_knowledge",
  CAREER_ADVICE = "career_advice",
  GENERAL_KNOWLEDGE = "general_knowledge",
  PROJECT_MANAGEMENT = "project_management",
}

// Define the structure of MetaSessionData
export interface MetaSessionData {
  userName: string
  timeOfDay: string
  interactionCount: number
  lastTopics: string[]
  preferredLanguages: string[]
  deviceType: string
  sessionDuration: number
  lastProjectName?: string
}
