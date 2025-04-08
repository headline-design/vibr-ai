"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X, Settings, Search, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ResponsiveChatLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function ResponsiveChatLayout({ children, sidebar, header, footer, className }: ResponsiveChatLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")

  // Close sidebar when switching to mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - hidden on mobile unless toggled */}
      {sidebar && (
        <>
          <div
            className={cn(
              "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-200",
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
              !isMobile && "hidden",
            )}
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-200 ease-in-out",
              isMobile && !sidebarOpen && "-translate-x-full",
              isMobile && "absolute",
              !isMobile && isTablet && "w-56",
              !isMobile && !isTablet && "w-64",
              !isMobile && "relative",
            )}
          >
            <div className="flex h-full flex-col">
              {isMobile && (
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close sidebar</span>
                  </Button>
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-4">{sidebar}</div>
            </div>
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Header */}
        {header && (
          <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center">
              {sidebar && isMobile && (
                <Button variant="ghost" size="icon" className="mr-2" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              )}
              {header}
            </div>

            {isMobile && (
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </div>
            )}
          </header>
        )}

        {/* Main content area */}
        <main className={cn("flex-1 overflow-y-auto", className)}>{children}</main>

        {/* Footer */}
        {footer && <footer className="border-t border-border bg-card/50 backdrop-blur-sm">{footer}</footer>}

        {/* Mobile navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 h-14 bg-background border-t border-border flex items-center justify-around px-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Chats</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
