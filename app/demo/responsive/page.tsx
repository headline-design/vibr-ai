"use client"

import { useState } from "react"
import { ResponsiveChatLayout } from "@/components/flow-state/responsive-chat-layout"
import { EnhancedAccessibilityPanel } from "@/components/flow-state/enhanced-accessibility-panel"
import { UserFeedbackSystem } from "@/components/flow-state/user-feedback-system"
import { Button } from "@/components/ui/button"
import { MessageInput } from "@/components/flow-state/message-input"
import { MessageBubbleContainer } from "@/components/flow-state/message-bubble-container"
import { Eye, Bell, MessageSquare, Settings, Users, Search } from "lucide-react"
import { FluxBranding } from "@/components/flow-state/flux-branding"
import { ChatMessage, ChatRole } from "@/components/flow-state/chat-interface"

export default function ResponsiveDemoPage() {
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! How can I help you today?",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      role: "user",
      content: "I'm looking for information about responsive design.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "3",
      role: "assistant",
      content:
        "Responsive design is an approach to web design that makes web pages render well on a variety of devices and window or screen sizes. Here are some key principles:\n\n1. Fluid grids\n2. Flexible images\n3. Media queries\n\nWould you like me to explain any of these in more detail?",
      timestamp: new Date().toISOString(),
    },
  ])

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return ""
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as ChatRole,
      content: message,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as ChatRole,
        content: `I received your message: "${message}". This is a simulated response to demonstrate the responsive chat layout.`,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const sidebar = (
    <div className="space-y-4">
      <div className="px-2 py-4">
        <FluxBranding size="md" />
      </div>

      <div className="space-y-1">
        <Button variant="ghost" className="w-full justify-start">
          <MessageSquare className="mr-2 h-4 w-4" />
          Conversations
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Contacts
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => setShowAccessibilityPanel(true)}>
          <Eye className="mr-2 h-4 w-4" />
          Accessibility
        </Button>
      </div>
    </div>
  )

  const header = (
    <div className="flex items-center">
      <h1 className="text-lg font-semibold">Responsive Chat Demo</h1>
    </div>
  )

  return (
    <>
      <ResponsiveChatLayout
        sidebar={sidebar}
        header={header}
        footer={<MessageInput onSendMessage={handleSendMessage} isWaitingForResponse={false} />}
        className="p-4"
      >
        <div className="flex flex-col space-y-4 pb-20">
          {messages.map((message, index) => {
            const isFirstInGroup = index === 0 || messages[index - 1].role !== message.role
            const isLastInGroup = index === messages.length - 1 || messages[index + 1].role !== message.role

            return (
              <MessageBubbleContainer
                key={message.id}
                message={message}
                isFirstInGroup={isFirstInGroup}
                isLastInGroup={isLastInGroup}
                isEditing={false}
                draftContent={message.content}
                onEditChange={() => {}}
                onSaveEdit={() => {}}
                onCancelEdit={() => {}}
                onCopy={() => {}}
                formatTimestamp={formatTimestamp}
                isMobile={false}
              />
            )
          })}
        </div>
      </ResponsiveChatLayout>

      <EnhancedAccessibilityPanel isOpen={showAccessibilityPanel} onClose={() => setShowAccessibilityPanel(false)} />

      <UserFeedbackSystem />
    </>
  )
}
