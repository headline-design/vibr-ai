"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Moon, Sun, Laptop } from "lucide-react"
import { EnhancedAccessibilityPanel } from "@/components/flow-state/enhanced-accessibility-panel"
import { useDemoState } from "@/components/flow-state/providers/demo-state-provider"

export default function ChatSettings() {
  const { theme, setTheme } = useTheme()

  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    demoView,
    setDemoView,
    isFloatingPanelOpen,
    setIsFloatingPanelOpen,
  } = useDemoState()

  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false)

  // Handle theme changes using next-themes
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Theme</h3>
              <Tabs defaultValue={theme} onValueChange={handleThemeChange}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="light">
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </TabsTrigger>
                  <TabsTrigger value="dark">
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </TabsTrigger>
                  <TabsTrigger value="system">
                    <Laptop className="h-4 w-4 mr-2" />
                    System
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Font Size</h3>
              <Tabs defaultValue="medium">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="small">Small</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                  <TabsTrigger value="large">Large</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Message Density</h3>
              <Tabs defaultValue="comfortable">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="compact">Compact</TabsTrigger>
                  <TabsTrigger value="comfortable">Comfortable</TabsTrigger>
                  <TabsTrigger value="spacious">Spacious</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Accessibility</CardTitle>
            <CardDescription>Configure accessibility settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <EnhancedAccessibilityPanel
              isOpen={showAccessibilityPanel}
              onClose={() => setShowAccessibilityPanel(false)}
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
