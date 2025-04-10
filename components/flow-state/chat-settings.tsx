"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFlowState } from "./flow-state-context"
import {
  Trash2,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  Info,
  ChevronRight,
  Moon,
  Sun,
  Clock,
  MessageSquare,
  Sparkles,
  Zap,
  Settings2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatSettingsProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function ChatSettings({ isOpen, onClose, className }: ChatSettingsProps) {
  const { clearMessages } = useFlowState()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("general")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)
  const [showTimestamps, setShowTimestamps] = useState(true)
  const [autoScroll, setAutoScroll] = useState(true)
  const [enableSuggestions, setEnableSuggestions] = useState(true)
  const [showConfirmClear, setShowConfirmClear] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Sync with theme system
  useEffect(() => {
    setIsDarkMode(theme === "dark")
  }, [theme])

  const handleDarkModeChange = (checked: boolean) => {
    setIsDarkMode(checked)
    setTheme(checked ? "dark" : "light")
  }

  const handleClearChat = () => {
    clearMessages()
    setShowConfirmClear(false)
    toast({
      title: "Chat cleared",
      description: "All messages have been removed from this conversation.",
    })
  }

  const handleExportChat = () => {
    // Implementation for exporting chat
    toast({
      title: "Chat exported",
      description: "Your conversation has been downloaded as a JSON file.",
    })
  }

  const handleImportChat = () => {
    // Implementation for importing chat
    toast({
      title: "Chat imported",
      description: "Your conversation has been successfully imported.",
    })
  }

  const handleResetSettings = () => {
    setIsResetting(true)
    // Simulate reset delay
    setTimeout(() => {
      setTemperature(0.7)
      setMaxTokens(1000)
      setShowTimestamps(true)
      setAutoScroll(true)
      setEnableSuggestions(true)
      setIsResetting(false)
      toast({
        title: "Settings reset",
        description: "All settings have been restored to their default values.",
      })
    }, 800)
  }

  const SettingItem = ({
    id,
    title,
    description,
    checked,
    onChange,
    icon: Icon,
    disabled = false,
    beta = false,
  }: {
    id: string
    title: string
    description: string
    checked: boolean
    onChange: (checked: boolean) => void
    icon: React.ElementType
    disabled?: boolean
    beta?: boolean
  }) => (
    <div
      className={cn(
        "flex items-start justify-between p-3 rounded-lg transition-colors",
        "hover:bg-muted/50",
        disabled && "opacity-60 pointer-events-none",
      )}
    >
      <div className="flex gap-3">
        <div className="mt-0.5 text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
              {title}
            </Label>
            {beta && (
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-primary/5 text-primary">
                BETA
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  )

  return (
    <ScrollArea className={cn("h-full bg-background", className)}>
      <div className="px-4 py-6 space-y-8">
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="general" className="flex items-center gap-1.5">
              <Settings2 className="h-3.5 w-3.5" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="model" className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Model</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="general" className="space-y-6 mt-0">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-foreground/80 px-3">Appearance & Behavior</h3>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <SettingItem
                      id="darkMode"
                      title="Dark Mode"
                      description="Switch between light and dark theme"
                      checked={isDarkMode}
                      onChange={handleDarkModeChange}
                      icon={isDarkMode ? Moon : Sun}
                    />
                    <div className="h-px bg-border mx-3" />
                    <SettingItem
                      id="timestamps"
                      title="Show Timestamps"
                      description="Display time for each message"
                      checked={showTimestamps}
                      onChange={setShowTimestamps}
                      icon={Clock}
                    />
                    <div className="h-px bg-border mx-3" />
                    <SettingItem
                      id="autoScroll"
                      title="Auto-scroll"
                      description="Automatically scroll to new messages"
                      checked={autoScroll}
                      onChange={setAutoScroll}
                      icon={ChevronRight}
                    />
                    <div className="h-px bg-border mx-3" />
                    <SettingItem
                      id="suggestions"
                      title="Show Suggestions"
                      description="Display suggested prompts"
                      checked={enableSuggestions}
                      onChange={setEnableSuggestions}
                      icon={MessageSquare}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-foreground/80 px-3">Chat Management</h3>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                      <Dialog open={showConfirmClear} onOpenChange={setShowConfirmClear}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start w-full text-sm font-normal h-auto p-0 hover:bg-transparent"
                          >
                            <div className="flex items-center gap-3">
                              <Trash2 className="h-5 w-5 text-muted-foreground" />
                              <div className="text-left">
                                <div className="font-medium">Clear conversation</div>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                  Remove all messages from this chat
                                </p>
                              </div>
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Clear conversation</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to clear all messages? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="flex space-x-2 sm:space-x-0 sm:justify-end">
                            <DialogClose asChild>
                              <Button type="button" variant="secondary" size="sm">
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={handleClearChat}
                              className="gap-1.5"
                            >
                              <Trash2 className="h-4 w-4" />
                              Clear
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="h-px bg-border mx-3" />
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleExportChat}
                        className="justify-start w-full text-sm font-normal h-auto p-0 hover:bg-transparent"
                      >
                        <div className="flex items-center gap-3">
                          <Download className="h-5 w-5 text-muted-foreground" />
                          <div className="text-left">
                            <div className="font-medium">Export chat</div>
                            <p className="text-sm text-muted-foreground mt-0.5">Download this conversation as a file</p>
                          </div>
                        </div>
                      </Button>
                    </div>
                    <div className="h-px bg-border mx-3" />
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleImportChat}
                        className="justify-start w-full text-sm font-normal h-auto p-0 hover:bg-transparent"
                      >
                        <div className="flex items-center gap-3">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <div className="text-left">
                            <div className="font-medium">Import chat</div>
                            <p className="text-sm text-muted-foreground mt-0.5">Load a conversation from a file</p>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="model" className="space-y-6 mt-0">
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-3">
                    <h3 className="text-sm font-medium text-foreground/80">Model Parameters</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">
                            These parameters control how the AI model generates responses. Adjust them to fine-tune the
                            output.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="p-4 space-y-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="temperature" className="text-sm font-medium">
                            Temperature
                          </Label>
                          <Badge variant="outline" className="font-mono text-xs">
                            {temperature.toFixed(1)}
                          </Badge>
                        </div>
                        <Slider
                          id="temperature"
                          min={0}
                          max={1}
                          step={0.1}
                          value={[temperature]}
                          onValueChange={(value) => setTemperature(value[0])}
                          className="py-1"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Precise</span>
                          <span>Balanced</span>
                          <span>Creative</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Controls randomness. Lower values produce more focused and deterministic responses. Higher
                          values produce more creative and varied responses.
                        </p>
                      </div>

                      <div className="h-px bg-border" />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="maxTokens" className="text-sm font-medium">
                            Maximum Length
                          </Label>
                          <Badge variant="outline" className="font-mono text-xs">
                            {maxTokens}
                          </Badge>
                        </div>
                        <Slider
                          id="maxTokens"
                          min={100}
                          max={4000}
                          step={100}
                          value={[maxTokens]}
                          onValueChange={(value) => setMaxTokens(value[0])}
                          className="py-1"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Short</span>
                          <span>Medium</span>
                          <span>Long</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Maximum number of tokens to generate in the response. One token is roughly 4 characters or 3/4
                          of a word.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border overflow-hidden bg-muted/30">
                  <div className="p-4 flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium">About Model Parameters</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        These settings affect how the AI generates responses. Experiment with different values to find
                        the best balance for your needs. Changes apply to new messages only.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6 mt-0">
                <div className="rounded-xl border border-warning/20 bg-warning/5 overflow-hidden">
                  <div className="p-4 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-warning-foreground">Advanced Settings</h4>
                      <p className="text-xs text-warning-foreground/80 mt-1">
                        These settings are for advanced users. Changes may affect the behavior and performance of the AI
                        assistant.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-foreground/80 px-3">Experimental Features</h3>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <SettingItem
                      id="voiceInput"
                      title="Voice Input"
                      description="Use your microphone to speak to the assistant"
                      checked={false}
                      onChange={() => {}}
                      icon={Mic}
                      beta={true}
                      disabled={true}
                    />
                    <div className="h-px bg-border mx-3" />
                    <SettingItem
                      id="debugMode"
                      title="Debug Mode"
                      description="Show technical information and logs"
                      checked={false}
                      onChange={() => {}}
                      icon={Code}
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetSettings}
                    disabled={isResetting}
                    className="w-full justify-center gap-2"
                  >
                    {isResetting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Reset to defaults
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </ScrollArea>
  )
}

function Mic(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}

function Code(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}
