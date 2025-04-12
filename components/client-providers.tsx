"use client"

import type React from "react"
import { AuthProvider } from "./auth/auth-provider"
import { AccessibilityProvider } from "./flow-state/accessibility-provider"
import { ThemeProvider } from "next-themes"
import { MetaSessionProvider } from "@/components/flow-state/meta-session-provider"
import { ConversationTreeProvider } from "@/components/flow-state/conversation-tree"
import { FlowStateProvider } from "@/components/flow-state/flow-state-context"
import type { ReactNode } from "react"
import { DemoStateProvider } from "./flow-state/demo-state-provider"
import { FlareColorProvider } from "@/components/providers/flare-color-provider"

interface ClientProvidersProps {
  children: ReactNode
  initialShowSuggestions?: boolean
}

export function ClientProviders({ children, initialShowSuggestions = true }: ClientProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AccessibilityProvider>
        <MetaSessionProvider>
          <ConversationTreeProvider>
            <FlowStateProvider initialShowSuggestions={initialShowSuggestions}>
              <DemoStateProvider>
                <AuthProvider>
                  <FlareColorProvider>
                    {children}
                  </FlareColorProvider>
                </AuthProvider>
              </DemoStateProvider>
            </FlowStateProvider>
          </ConversationTreeProvider>
        </MetaSessionProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
