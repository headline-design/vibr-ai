"use client"

import type React from "react"
import { AuthProvider } from "./auth/auth-provider"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { FlareColorProvider } from "@/components/providers/flare-color-provider"
import { MessageProvider } from "@/components/flow-state/providers/message-provider"
import { ConversationTreeProvider } from "@/components/flow-state/conversation-tree/conversation-tree-provider"
import { AccessibilityProvider } from "@/components/flow-state/providers/accessibility-provider"
import { DemoStateProvider } from "@/components/flow-state/providers/demo-state-provider"
import { FlowStateProvider } from "@/components/flow-state/providers/flow-state-provider"
import { MetaSessionProvider } from "@/components/flow-state/providers/meta-session-provider"
import { ChatConfigProvider } from "@/components/flow-state/providers/chat-config-provider"

interface ClientProvidersProps {
  children: ReactNode
  initialShowSuggestions?: boolean
}

export function ClientProviders({ children, initialShowSuggestions = true }: ClientProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AccessibilityProvider>
        <MetaSessionProvider>
          <ConversationTreeProvider>
            <FlowStateProvider>
              <ChatConfigProvider>
                <DemoStateProvider>
                  <AuthProvider>
                    <MessageProvider>
                      <FlareColorProvider>{children}</FlareColorProvider>
                    </MessageProvider>
                  </AuthProvider>
                </DemoStateProvider>
              </ChatConfigProvider>
            </FlowStateProvider>
          </ConversationTreeProvider>
        </MetaSessionProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
