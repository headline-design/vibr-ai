"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye, Type, MousePointer, Keyboard, Volume2, RotateCcw } from "lucide-react"
import { useAccessibility } from "./accessibility-provider"

interface EnhancedAccessibilityPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function EnhancedAccessibilityPanel({ isOpen, onClose }: EnhancedAccessibilityPanelProps) {
  const [activeTab, setActiveTab] = useState("visual")
  const {
    fontSize,
    setFontSize,
    colorContrast,
    setColorContrast,
    animationPreference,
    setAnimationPreference,
    keyboardNavigation,
    setKeyboardNavigation,
    dyslexicFont,
    setDyslexicFont,
    screenReaderOptimized,
    setScreenReaderOptimized,
    autoAnnounce,
    setAutoAnnounce,
    resetSettings,
  } = useAccessibility()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Accessibility Settings
          </DialogTitle>
          <DialogDescription>Customize your experience to make the chat more accessible.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="visual" className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              <span>Visual</span>
            </TabsTrigger>
            <TabsTrigger value="interaction" className="flex items-center">
              <MousePointer className="h-4 w-4 mr-2" />
              <span>Interaction</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center">
              <Volume2 className="h-4 w-4 mr-2" />
              <span>Audio</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center">
                <Type className="h-4 w-4 mr-2" />
                <span>Font Size</span>
              </Label>
              <RadioGroup
                value={fontSize}
                onValueChange={(value) => setFontSize(value as any)}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="font-default" />
                  <Label htmlFor="font-default">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="font-large" />
                  <Label htmlFor="font-large">Large</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="x-large" id="font-x-large" />
                  <Label htmlFor="font-x-large">X-Large</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Contrast</Label>
              <RadioGroup
                value={colorContrast}
                onValueChange={(value) => setColorContrast(value as any)}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="contrast-default" />
                  <Label htmlFor="contrast-default">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="contrast-high" />
                  <Label htmlFor="contrast-high">High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="highest" id="contrast-highest" />
                  <Label htmlFor="contrast-highest">Highest</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dyslexic-font" className="cursor-pointer">
                Dyslexia-friendly Font
              </Label>
              <Switch id="dyslexic-font" checked={dyslexicFont} onCheckedChange={setDyslexicFont} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion" className="cursor-pointer">
                Reduce Motion
              </Label>
              <Switch
                id="reduced-motion"
                checked={animationPreference === "reduced"}
                onCheckedChange={(checked) => setAnimationPreference(checked ? "reduced" : "default")}
              />
            </div>
          </TabsContent>

          <TabsContent value="interaction" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="keyboard-navigation" className="cursor-pointer flex items-center">
                <Keyboard className="h-4 w-4 mr-2" />
                <span>Enhanced Keyboard Navigation</span>
              </Label>
              <Switch
                id="keyboard-navigation"
                checked={keyboardNavigation === "enhanced"}
                onCheckedChange={(checked) => setKeyboardNavigation(checked ? "enhanced" : "default")}
              />
            </div>

            <div className="p-3 bg-muted rounded-md">
              <h4 className="text-sm font-medium mb-2">Keyboard Shortcuts</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Send message</span>
                  <kbd className="px-2 py-0.5 bg-muted-foreground/20 rounded text-xs">Enter</kbd>
                </div>
                <div className="flex justify-between">
                  <span>New line</span>
                  <kbd className="px-2 py-0.5 bg-muted-foreground/20 rounded text-xs">Shift + Enter</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Command palette</span>
                  <kbd className="px-2 py-0.5 bg-muted-foreground/20 rounded text-xs">Ctrl/⌘ + K</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Focus input</span>
                  <kbd className="px-2 py-0.5 bg-muted-foreground/20 rounded text-xs">Alt + I</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Navigate messages</span>
                  <kbd className="px-2 py-0.5 bg-muted-foreground/20 rounded text-xs">↑/↓</kbd>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="screen-reader" className="cursor-pointer">
                Screen Reader Optimizations
              </Label>
              <Switch id="screen-reader" checked={screenReaderOptimized} onCheckedChange={setScreenReaderOptimized} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-announce" className="cursor-pointer">
                Auto-announce New Messages
              </Label>
              <Switch id="auto-announce" checked={autoAnnounce} onCheckedChange={setAutoAnnounce} />
            </div>

            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                Screen reader optimizations improve the experience for users with screen readers by adding additional
                context and improving navigation.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={resetSettings} className="flex items-center">
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset to Defaults
          </Button>
          <Button size="sm" onClick={onClose}>
            Apply Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
