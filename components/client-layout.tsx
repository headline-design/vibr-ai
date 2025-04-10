"use client"

import { FluxFloatingPanel } from "@/components/flux-floating-panel"
import { Bug, Code, Settings, Cpu } from "lucide-react"
import { UserFeedbackSystem } from "@/components/flow-state/user-feedback-system"
import { FluxBranding } from "@/components/flow-state/flux-branding"
import { CommandPaletteEnhanced } from "@/components/flow-state/command-palette-enhanced"
import { useDemoState } from "./flow-state/demo-state-provider"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    demoView,
    setDemoView,
    isFloatingPanelOpen,
    setIsFloatingPanelOpen,
  } = useDemoState()

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Navbar */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <FluxBranding size="md" />
          <div dir="ltr" data-orientation="horizontal" className="hidden sm:flex">
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-700 p-1 text-neutral-500 dark:text-neutral-400"
              tabIndex={0}
              data-orientation="horizontal"
              style={{ outline: "none" }}
            >
              <Link
                href="/"
                type="button"
                role="tab"
                aria-selected="true"
                aria-controls="radix-«r0»-content-demo"
                data-state={pathname === "/" ? "active" : "inactive"}
                id="radix-«r0»-trigger-demo"
                className="justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center"
                tabIndex={0}
                data-orientation="horizontal"
                data-radix-collection-item=""
              >
                <Code className="h-4 w-4 mr-2" />
                Demo
              </Link>
              <Link
                type="button"
                href="/ai-tools"
                role="tab"
                aria-selected="false"
                aria-controls="radix-«r0»-content-ai-tools"
                data-state={pathname === "/ai-tools" ? "active" : "inactive"}
                id="radix-«r0»-trigger-ai-tools"
                className="justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center"
                tabIndex={-1}
                data-orientation="horizontal"
                data-radix-collection-item=""
              >
                <Cpu className="h-4 w-4 mr-2" />
                AI Tools
              </Link>
              <Link
                href="/debug"
                type="button"
                role="tab"
                aria-selected="false"
                aria-controls="radix-«r0»-content-debug"
                data-state={pathname === "/debug" ? "active" : "inactive"}
                id="radix-«r0»-trigger-debug"
                className="justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center"
                tabIndex={-1}
                data-orientation="horizontal"
                data-radix-collection-item=""
              >
                <Bug className="h-4 w-4 mr-2" />
                Debug
              </Link>
              <Link
                href="/settings"
                type="button"
                role="tab"
                aria-selected="false"
                aria-controls="radix-«r0»-content-settings"
                data-state={pathname === "/settings" ? "active" : "inactive"}
                id="radix-«r0»-trigger-settings"
                className="justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center"
                tabIndex={-1}
                data-orientation="horizontal"
                data-radix-collection-item=""
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">{children}</div>

      {/* User feedback system */}
      <UserFeedbackSystem />
      {/* Command Palette */}
      {isCommandPaletteOpen && (
        <CommandPaletteEnhanced
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelect={(command) => console.log(`Selected command: ${command}`)}
        />
      )}
      {isFloatingPanelOpen && (
        <FluxFloatingPanel isOpen={isFloatingPanelOpen} onClose={() => setIsFloatingPanelOpen(false)} />
      )}
    </div>
  )
}
