"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Eye, Type, MousePointer, Keyboard, Volume2, Plus, Minus, RotateCcw } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AccessibilityOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function AccessibilityOverlay({ isOpen, onClose }: AccessibilityOverlayProps) {
  // Accessibility settings
  const [fontSize, setFontSize] = useState(100) // percentage
  const [contrast, setContrast] = useState(100) // percentage
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [dyslexicFont, setDyslexicFont] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [keyboardNavigation, setKeyboardNavigation] = useState(true)
  const [autoReadMessages, setAutoReadMessages] = useState(false)

  // Apply accessibility settings
  useEffect(() => {
    if (!isOpen) return

    // Apply font size
    document.documentElement.style.setProperty("--accessibility-font-scale", `${fontSize}%`)

    // Apply contrast
    document.documentElement.style.setProperty("--accessibility-contrast", `${contrast}%`)

    // Apply reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }

    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Apply dyslexic font
    if (dyslexicFont) {
      document.documentElement.classList.add("dyslexic-font")
    } else {
      document.documentElement.classList.remove("dyslexic-font")
    }

    // Apply keyboard navigation
    if (keyboardNavigation) {
      document.documentElement.classList.add("keyboard-navigation")
    } else {
      document.documentElement.classList.remove("keyboard-navigation")
    }

    return () => {
      // Clean up when component unmounts
      document.documentElement.style.removeProperty("--accessibility-font-scale")
      document.documentElement.style.removeProperty("--accessibility-contrast")
      document.documentElement.classList.remove("reduce-motion")
      document.documentElement.classList.remove("high-contrast")
      document.documentElement.classList.remove("dyslexic-font")
      document.documentElement.classList.remove("keyboard-navigation")
    }
  }, [isOpen, fontSize, contrast, reducedMotion, highContrast, dyslexicFont, keyboardNavigation])

  // Reset settings to defaults
  const resetSettings = () => {
    setFontSize(100)
    setContrast(100)
    setReducedMotion(false)
    setHighContrast(false)
    setDyslexicFont(false)
    setScreenReader(false)
    setKeyboardNavigation(true)
    setAutoReadMessages(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto bg-background dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Accessibility Settings
          </DialogTitle>
          <DialogDescription>Customize your experience to make the chat more accessible.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="visual">
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
              <div className="flex items-center justify-between">
                <Label className="flex items-center">
                  <Type className="h-4 w-4 mr-2" />
                  <span>Font Size</span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setFontSize(Math.max(70, fontSize - 10))}
                    disabled={fontSize <= 70}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm w-10 text-center">{fontSize}%</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                    disabled={fontSize >= 150}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Slider value={[fontSize]} min={70} max={150} step={5} onValueChange={(value) => setFontSize(value[0])} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Contrast</Label>
                <span className="text-sm">{contrast}%</span>
              </div>
              <Slider value={[contrast]} min={80} max={120} step={5} onValueChange={(value) => setContrast(value[0])} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="cursor-pointer">
                High Contrast Mode
              </Label>
              <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
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
              <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
            </div>
          </TabsContent>

          <TabsContent value="interaction" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="keyboard-navigation" className="cursor-pointer flex items-center">
                <Keyboard className="h-4 w-4 mr-2" />
                <span>Enhanced Keyboard Navigation</span>
              </Label>
              <Switch id="keyboard-navigation" checked={keyboardNavigation} onCheckedChange={setKeyboardNavigation} />
            </div>

            <div className="p-3 bg-muted dark:bg-gray-800 rounded-md">
              <h4 className="text-sm font-medium mb-2">Keyboard Shortcuts</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Send message</span>
                  <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Enter</kbd>
                </div>
                <div className="flex justify-between">
                  <span>New line</span>
                  <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Shift + Enter</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Command palette</span>
                  <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl/⌘ + K</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Focus input</span>
                  <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + I</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Navigate messages</span>
                  <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">↑/↓</kbd>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="screen-reader" className="cursor-pointer">
                Screen Reader Optimizations
              </Label>
              <Switch id="screen-reader" checked={screenReader} onCheckedChange={setScreenReader} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-read" className="cursor-pointer">
                Auto-read New Messages
              </Label>
              <Switch id="auto-read" checked={autoReadMessages} onCheckedChange={setAutoReadMessages} />
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Screen reader optimizations improve the experience for users with screen readers by adding additional
                context and improving navigation.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
