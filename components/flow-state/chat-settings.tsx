"use client"

import { useState } from "react"
import { Moon, Sun, Volume2, VolumeX, Laptop } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatSettings({ isOpen, onClose }: ChatSettingsProps) {
  const [theme, setTheme] = useState("system")
  const [fontSize, setFontSize] = useState(16)
  const [sound, setSound] = useState(true)
  const [notifications, setNotifications] = useState(false)
  const [language, setLanguage] = useState("en")
  const [model, setModel] = useState("gpt-4")

  return (
    <div className={cn("bg-white dark:bg-gray-900 z-10 flex flex-col", isOpen ? "block" : "hidden")}>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Theme */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Theme</h3>
            <div className="grid grid-cols-3 gap-1">
              <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
              <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                <Laptop className="h-4 w-4 mr-2" />
                System
              </Button>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Font Size</h3>
            <Slider defaultValue={[16]} min={12} max={20} step={1} />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
            </div>
          </div>

          {/* Sound */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sound</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound" className="cursor-pointer text-xs">
                Message sounds
              </Label>
              <Switch id="sound" defaultChecked />
            </div>
            <div className="pl-6 flex items-center space-x-2">
              <VolumeX className="h-4 w-4 text-gray-400" />
              <Slider defaultValue={[70]} className="flex-1" />
              <Volume2 className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Desktop Notifications</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="desktop" className="cursor-pointer text-xs">
                Enable desktop notifications
              </Label>
              <Switch id="desktop" />
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Interface Language</h3>
            <Select defaultValue="en">
              <SelectTrigger className="h-7 text-xs">
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

          {/* AI Language Model */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">AI Language Model</h3>
            <Select defaultValue="gpt4">
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt4">GPT-4</SelectItem>
                <SelectItem value="gpt35">GPT-3.5</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="llama">Llama 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
