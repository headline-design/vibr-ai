export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  isThinking?: boolean
  options?: { id: string; label: string }[]
  isEditing?: boolean
  timestamp?: string
  reactions?: string[]
  parentId?: string
}
