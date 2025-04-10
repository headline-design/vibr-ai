"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Moon,
  Sun,
  Laptop,
  Volume2,
  VolumeX,
  Globe,
  MessageSquare,
  Palette,
  Type,
  Bell,
  Shield,
  Save,
  X,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function SettingsPanel({ isOpen, onClose, className }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState("appearance")
  const [theme, setTheme] = useState("system")
  const [fontSize, setFontSize] = useState(100)
  const [messageDensity, setMessageDensity] = useState("comfortable")
  const [volume, setVolume] = useState(70)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [language, setLanguage] = useState("en")
  const [model, setModel] = useState("gpt-4o")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Track changes
  const trackChanges = () => {
    setHasUnsavedChanges(true)
  }

  // Save changes
  const saveChanges = () => {
    // In a real app, you'd save these settings to your state management or backend
    console.log("Saving settings:", {
      theme,
      fontSize,
      messageDensity,
      volume,
      soundEnabled,
      notificationsEnabled,
      language,
      model,
    })
    setHasUnsavedChanges(false)
  }

  // Discard changes
  const discardChanges = () => {
    // In a real app, you'd reset to the saved values
    setHasUnsavedChanges(false)
  }

  return (
    <motion.div
      className={cn(
        "fixed inset-0 bg-white dark:bg-neutral-900 z-50 flex flex-col overflow-hidden",
        !isOpen && "pointer-events-none opacity-0",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
        <h2 className="text-base font-medium flex items-center">
          <Palette className="h-4 w-4 mr-2 text-neutral-500" />
          Settings
        </h2>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <>
              <Button variant="outline" size="sm" onClick={discardChanges} className="h-7 text-xs">
                <X className="h-3 w-3 mr-1.5" />
                Discard
              </Button>
              <Button size="sm" onClick={saveChanges} className="h-7 text-xs">
                <Check className="h-3 w-3 mr-1.5" />
                Save
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close settings">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
        <TabsList className="w-full justify-start px-4 pt-2 bg-transparent border-b border-neutral-100 dark:border-neutral-800">
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-800 rounded-t-md"
          >
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-800 rounded-t-md"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="language"
            className="data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-800 rounded-t-md"
          >
            <Globe className="h-4 w-4 mr-2" />
            Language
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-800 rounded-t-md"
          >
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="appearance" className="mt-0 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col items-center justify-center h-20 p-2 transition-all",
                    theme === "light" && "border-neutral-900 ring-1 ring-neutral-900/10",
                  )}
                  onClick={() => {
                    setTheme("light")
                    trackChanges()
                  }}
                >
                  <div className="h-10 w-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-2 shadow-sm">
                    <Sun className="h-5 w-5 text-neutral-700" />
                  </div>
                  <span className="text-xs">Light</span>
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col items-center justify-center h-20 p-2 transition-all",
                    theme === "dark" && "border-neutral-900 ring-1 ring-neutral-900/10",
                  )}
                  onClick={() => {
                    setTheme("dark")
                    trackChanges()
                  }}
                >
                  <div className="h-10 w-10 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center mb-2 shadow-sm">
                    <Moon className="h-5 w-5 text-neutral-300" />
                  </div>
                  <span className="text-xs">Dark</span>
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col items-center justify-center h-20 p-2 transition-all",
                    theme === "system" && "border-neutral-900 ring-1 ring-neutral-900/10",
                  )}
                  onClick={() => {
                    setTheme("system")
                    trackChanges()
                  }}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white to-neutral-900 border border-neutral-300 flex items-center justify-center mb-2 shadow-sm">
                    <Laptop className="h-5 w-5 text-neutral-700" />
                  </div>
                  <span className="text-xs">System</span>
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="density" className="flex items-center cursor-pointer">
                  <MessageSquare className="h-4 w-4 mr-2 text-neutral-500" />
                  <span>Message Density</span>
                </Label>
              </div>
              <RadioGroup
                value={messageDensity}
                onValueChange={(value) => {
                  setMessageDensity(value)
                  trackChanges()
                }}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compact" id="density-compact" />
                  <Label htmlFor="density-compact">Compact</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfortable" id="density-comfortable" />
                  <Label htmlFor="density-comfortable">Comfortable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spacious" id="density-spacious" />
                  <Label htmlFor="density-spacious">Spacious</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="font-size" className="flex items-center cursor-pointer">
                  <Type className="h-4 w-4 mr-2 text-neutral-500" />
                  <span>Font Size ({fontSize}%)</span>
                </Label>
              </div>
              <Slider
                id="font-size"
                value={[fontSize]}
                min={70}
                max={150}
                step={10}
                onValueChange={(value) => {
                  setFontSize(value[0])
                  trackChanges()
                }}
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Small</span>
                <span>Medium</span>
                <span>Large</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium mb-3">Sound</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="cursor-pointer">
                  Message sounds
                </Label>
                <Switch
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={(checked) => {
                    setSoundEnabled(checked)
                    trackChanges()
                  }}
                />
              </div>

              <div className="pt-2">
                <Label className="text-xs text-neutral-500 mb-1 block">Volume</Label>
                <div className="flex items-center space-x-2">
                  <VolumeX className="h-4 w-4 text-neutral-400" />
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={10}
                    onValueChange={(value) => {
                      setVolume(value[0])
                      trackChanges()
                    }}
                    className="flex-1"
                    disabled={!soundEnabled}
                  />
                  <Volume2 className="h-4 w-4 text-neutral-400" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium mb-3">Desktop Notifications</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="desktop" className="cursor-pointer">
                  Enable desktop notifications
                </Label>
                <Switch
                  id="desktop"
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) => {
                    setNotificationsEnabled(checked)
                    trackChanges()
                  }}
                />
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-md text-xs text-neutral-500 dark:text-neutral-400">
                Desktop notifications will alert you when you receive new messages while the app is in the background.
              </div>
            </div>
          </TabsContent>

          <TabsContent value="language" className="mt-0 space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium mb-3">Interface Language</h3>
              <Select
                value={language}
                onValueChange={(value) => {
                  setLanguage(value)
                  trackChanges()
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium mb-3">AI Language Model</h3>
              <Select
                value={model}
                onValueChange={(value) => {
                  setModel(value)
                  trackChanges()
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                  <SelectItem value="claude-3">Claude 3</SelectItem>
                  <SelectItem value="llama-3">Llama 3</SelectItem>
                </SelectContent>
              </Select>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-md text-xs text-neutral-500 dark:text-neutral-400">
                Different models have different capabilities and response styles. GPT-4o offers the best overall
                performance.
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="mt-0 space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium mb-3">Data Usage</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="save-history" className="cursor-pointer">
                  Save chat history
                </Label>
                <Switch id="save-history" defaultChecked onChange={trackChanges} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="analytics" className="cursor-pointer">
                  Allow anonymous analytics
                </Label>
                <Switch id="analytics" defaultChecked onChange={trackChanges} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="improve-model" className="cursor-pointer">
                  Help improve AI models
                </Label>
                <Switch id="improve-model" defaultChecked onChange={trackChanges} />
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-md text-xs text-neutral-500 dark:text-neutral-400">
                Your privacy is important to us. We only use your data to improve your experience and our services. You
                can export or delete your data at any time.
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium mb-3">Data Management</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Delete All Data
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  )
}
