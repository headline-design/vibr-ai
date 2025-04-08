"use client"

import { useState } from "react"
import { X, Type, Eye, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AccessibilityOverlayEnhancedProps {
  onClose: () => void
}

export function AccessibilityOverlayEnhanced({ onClose }: AccessibilityOverlayEnhancedProps) {
  const [activeTab, setActiveTab] = useState<string>("text")
  const [fontSize, setFontSize] = useState<number>(100)
  const [contrast, setContrast] = useState<number>(100)
  const [reduceMotion, setReduceMotion] = useState<boolean>(false)
  const [highContrast, setHighContrast] = useState<boolean>(false)
  const [screenReader, setScreenReader] = useState<boolean>(false)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-medium">Accessibility Options</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="text" className="flex items-center">
                <Type className="h-4 w-4 mr-2" />
                Text
              </TabsTrigger>
              <TabsTrigger value="visual" className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center">
                <Volume2 className="h-4 w-4 mr-2" />
                Audio
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "text" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="font-size">Font Size: {fontSize}%</Label>
                </div>
                <Slider
                  id="font-size"
                  min={50}
                  max={200}
                  step={10}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>A</span>
                  <span style={{ fontSize: "1.5em" }}>A</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dyslexic-font" className="cursor-pointer">
                  Dyslexia-friendly Font
                </Label>
                <Switch id="dyslexic-font" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="line-spacing" className="cursor-pointer">
                  Increased Line Spacing
                </Label>
                <Switch id="line-spacing" />
              </div>
            </div>
          )}

          {activeTab === "visual" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="contrast">Contrast: {contrast}%</Label>
                </div>
                <Slider
                  id="contrast"
                  min={50}
                  max={150}
                  step={10}
                  value={[contrast]}
                  onValueChange={(value) => setContrast(value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="cursor-pointer">
                  High Contrast Mode
                </Label>
                <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="reduce-motion" className="cursor-pointer">
                  Reduce Motion
                </Label>
                <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={setReduceMotion} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="color-blind" className="cursor-pointer">
                  Color Blind Mode
                </Label>
                <Switch id="color-blind" />
              </div>
            </div>
          )}

          {activeTab === "audio" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader" className="cursor-pointer">
                  Screen Reader Support
                </Label>
                <Switch id="screen-reader" checked={screenReader} onCheckedChange={setScreenReader} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="speech-rate">Speech Rate</Label>
                </div>
                <Slider id="speech-rate" min={50} max={200} step={10} defaultValue={[100]} />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="audio-cues" className="cursor-pointer">
                  Audio Cues for Events
                </Label>
                <Switch id="audio-cues" />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>Save Preferences</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
