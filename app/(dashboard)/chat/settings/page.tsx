"use client"

import { Suspense, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { EnhancedAccessibilityPanel } from "@/components/flow-state/enhanced-accessibility-panel"
import { useDemoState } from "@/components/flow-state/demo-state-provider"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import ThemeTabs from "@/components/theme-tabs"
import ThemeTabsLoading from "@/components/theme-tabs-loading"

export default function ChatSettings() {

  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    demoView,
    setDemoView,
    isFloatingPanelOpen,
    setIsFloatingPanelOpen,
  } = useDemoState()

  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme Selector */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Theme</h3>
              <Suspense fallback={<ThemeTabsLoading />}>
                <ThemeTabs />
              </Suspense>
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
            <Button variant="outline"
              onClick={() => setShowAccessibilityPanel(true)}
            >
              Open Accessibility Options
            </Button>

          </CardContent>
        </Card>
      </div>
      <Dialog open={showAccessibilityPanel} onOpenChange={setShowAccessibilityPanel}>
        <DialogContent>
          <DialogHeader>
            <h3 className="text-lg font-medium">Enhanced Accessibility Options</h3>
          </DialogHeader>
          <EnhancedAccessibilityPanel isOpen={showAccessibilityPanel} onClose={() => setShowAccessibilityPanel(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
