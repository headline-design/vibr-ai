"use client"

import { Slider } from "@/components/ui/slider"

import { useState } from "react"
import {
  User,
  Edit2,
  Save,
  Trash2,
  Plus,
  Sparkles,
  MessageSquare,
  Brain,
  Lightbulb,
  Zap,
  Palette,
  Sliders,
  Check,
  X,
  Download,
  Upload,
  HelpCircle,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface AssistantPersonalizationProps {
  onSave: (settings: AssistantSettings) => void
  initialSettings?: Partial<AssistantSettings>
  className?: string
}

interface AssistantSettings {
  name: string
  description: string
  avatarUrl: string
  personality: string
  expertise: string[]
  tone: string
  verbosity: string
  formality: string
  creativity: string
  systemPrompt: string
  greeting: string
  isCustomAvatar: boolean
  primaryColor: string
  secondaryColor: string
  customInstructions: string[]
  enableContinuousLearning: boolean
  enablePersonalization: boolean
  enableMemory: boolean
  memoryDepth: number
}

interface Preset {
  id: string
  name: string
  description: string
  settings: Partial<AssistantSettings>
  isBuiltIn?: boolean
}

export function AssistantPersonalization({ onSave, initialSettings, className }: AssistantPersonalizationProps) {
  // Default settings
  const defaultSettings: AssistantSettings = {
    name: "AI Assistant",
    description: "A helpful AI assistant that can answer questions and provide information.",
    avatarUrl: "",
    personality: "helpful",
    expertise: ["general"],
    tone: "neutral",
    verbosity: "balanced",
    formality: "neutral",
    creativity: "balanced",
    systemPrompt: "You are a helpful AI assistant. Answer questions accurately and concisely.",
    greeting: "Hello! How can I help you today?",
    isCustomAvatar: false,
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    customInstructions: [],
    enableContinuousLearning: true,
    enablePersonalization: true,
    enableMemory: true,
    memoryDepth: 10,
  }

  // Merge initial settings with defaults
  const mergedSettings = { ...defaultSettings, ...initialSettings }

  // State
  const [settings, setSettings] = useState<AssistantSettings>(mergedSettings)
  const [activeTab, setActiveTab] = useState<string>("personality")
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false)
  const [isSavePresetDialogOpen, setIsSavePresetDialogOpen] = useState(false)
  const [newPresetName, setNewPresetName] = useState("")
  const [newPresetDescription, setNewPresetDescription] = useState("")
  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState(false)
  const [newInstruction, setNewInstruction] = useState("")
  const [editingInstructionIndex, setEditingInstructionIndex] = useState<number | null>(null)
  const [isSystemPromptDialogOpen, setIsSystemPromptDialogOpen] = useState(false)
  const [isResetConfirmDialogOpen, setIsResetConfirmDialogOpen] = useState(false)

  // Sample presets
  const [presets, setPresets] = useState<Preset[]>([
    {
      id: "default",
      name: "Default Assistant",
      description: "A balanced, helpful AI assistant for general use",
      settings: defaultSettings,
      isBuiltIn: true,
    },
    {
      id: "professional",
      name: "Professional Consultant",
      description: "Formal, precise, and business-oriented assistant",
      settings: {
        personality: "professional",
        tone: "formal",
        verbosity: "concise",
        formality: "formal",
        creativity: "low",
        systemPrompt:
          "You are a professional consultant providing accurate, concise, and business-oriented advice. Maintain a formal tone and focus on delivering precise information.",
        greeting: "Good day. How may I assist you with your professional needs?",
      },
      isBuiltIn: true,
    },
    {
      id: "creative",
      name: "Creative Companion",
      description: "Imaginative, expressive, and artistic assistant",
      settings: {
        personality: "creative",
        tone: "enthusiastic",
        verbosity: "detailed",
        formality: "casual",
        creativity: "high",
        systemPrompt:
          "You are a creative companion with a flair for imagination and expression. Provide colorful, detailed responses that inspire creativity and artistic thinking.",
        greeting: "Hey there! Ready to explore some creative ideas together?",
      },
      isBuiltIn: true,
    },
    {
      id: "technical",
      name: "Technical Expert",
      description: "Precise, detailed technical assistant for developers",
      settings: {
        personality: "analytical",
        expertise: ["programming", "technology", "data science"],
        tone: "neutral",
        verbosity: "detailed",
        formality: "neutral",
        creativity: "low",
        systemPrompt:
          "You are a technical expert specializing in software development, technology, and data science. Provide detailed, accurate technical information with code examples when appropriate.",
        greeting: "Hello. What technical challenge can I help you solve today?",
      },
      isBuiltIn: true,
    },
  ])

  // Update settings
  const updateSettings = (newSettings: Partial<AssistantSettings>) => {
    setSettings({ ...settings, ...newSettings })
  }

  // Save settings
  const saveSettings = () => {
    onSave(settings)
  }

  // Reset to defaults
  const resetToDefaults = () => {
    setSettings(defaultSettings)
    setIsResetConfirmDialogOpen(false)
  }

  // Apply preset
  const applyPreset = (preset: Preset) => {
    setSettings({ ...settings, ...preset.settings })
    setIsPresetDialogOpen(false)
  }

  // Save current settings as preset
  const saveAsPreset = () => {
    if (!newPresetName) return

    const newPreset: Preset = {
      id: `preset-${Date.now()}`,
      name: newPresetName,
      description: newPresetDescription || `Custom preset: ${newPresetName}`,
      settings: { ...settings },
    }

    setPresets([...presets, newPreset])
    setNewPresetName("")
    setNewPresetDescription("")
    setIsSavePresetDialogOpen(false)
  }

  // Add custom instruction
  const addCustomInstruction = () => {
    if (!newInstruction) return

    if (editingInstructionIndex !== null) {
      // Update existing instruction
      const updatedInstructions = [...settings.customInstructions]
      updatedInstructions[editingInstructionIndex] = newInstruction
      updateSettings({ customInstructions: updatedInstructions })
    } else {
      // Add new instruction
      updateSettings({
        customInstructions: [...settings.customInstructions, newInstruction],
      })
    }

    setNewInstruction("")
    setEditingInstructionIndex(null)
    setIsInstructionDialogOpen(false)
  }

  // Remove custom instruction
  const removeCustomInstruction = (index: number) => {
    const updatedInstructions = [...settings.customInstructions]
    updatedInstructions.splice(index, 1)
    updateSettings({ customInstructions: updatedInstructions })
  }

  // Edit custom instruction
  const editCustomInstruction = (index: number) => {
    setNewInstruction(settings.customInstructions[index])
    setEditingInstructionIndex(index)
    setIsInstructionDialogOpen(true)
  }

  // Get personality options
  const personalityOptions = [
    { value: "helpful", label: "Helpful" },
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "creative", label: "Creative" },
    { value: "analytical", label: "Analytical" },
    { value: "empathetic", label: "Empathetic" },
  ]

  // Get expertise options
  const expertiseOptions = [
    { value: "general", label: "General Knowledge" },
    { value: "programming", label: "Programming" },
    { value: "writing", label: "Writing" },
    { value: "data science", label: "Data Science" },
    { value: "business", label: "Business" },
    { value: "education", label: "Education" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
    { value: "finance", label: "Finance" },
    { value: "health", label: "Health" },
    { value: "technology", label: "Technology" },
  ]

  // Get tone options
  const toneOptions = [
    { value: "formal", label: "Formal" },
    { value: "neutral", label: "Neutral" },
    { value: "casual", label: "Casual" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "serious", label: "Serious" },
    { value: "humorous", label: "Humorous" },
  ]

  // Get verbosity options
  const verbosityOptions = [
    { value: "concise", label: "Concise" },
    { value: "balanced", label: "Balanced" },
    { value: "detailed", label: "Detailed" },
  ]

  // Get formality options
  const formalityOptions = [
    { value: "formal", label: "Formal" },
    { value: "neutral", label: "Neutral" },
    { value: "casual", label: "Casual" },
  ]

  // Get creativity options
  const creativityOptions = [
    { value: "low", label: "Low" },
    { value: "balanced", label: "Balanced" },
    { value: "high", label: "High" },
  ]

  // Get color options
  const colorOptions = [
    { value: "#3b82f6", label: "Blue" },
    { value: "#10b981", label: "Green" },
    { value: "#f59e0b", label: "Amber" },
    { value: "#ef4444", label: "Red" },
    { value: "#8b5cf6", label: "Purple" },
    { value: "#ec4899", label: "Pink" },
    { value: "#6b7280", label: "Gray" },
  ]

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-500" />
          Assistant Personalization
        </h2>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8" onClick={() => setIsPresetDialogOpen(true)}>
            <Sparkles className="h-4 w-4 mr-1.5" />
            Presets
          </Button>

          <Button variant="default" size="sm" className="h-8" onClick={saveSettings}>
            <Save className="h-4 w-4 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Preview card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start">
            <Avatar className="h-12 w-12 mr-4">
              {settings.isCustomAvatar && settings.avatarUrl ? (
                <AvatarImage src={settings.avatarUrl} alt={settings.name} />
              ) : (
                <AvatarFallback style={{ backgroundColor: settings.primaryColor }} className="text-white">
                  {settings.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1">
              <h3 className="text-lg font-medium">{settings.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{settings.description}</p>

              <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm">{settings.greeting}</p>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                <Badge variant="outline" className="text-xs">
                  {personalityOptions.find((o) => o.value === settings.personality)?.label || settings.personality}
                </Badge>
                {settings.expertise.map((exp, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {expertiseOptions.find((o) => o.value === exp)?.label || exp}
                  </Badge>
                ))}
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{ color: settings.primaryColor, borderColor: settings.primaryColor + "40" }}
                >
                  {toneOptions.find((o) => o.value === settings.tone)?.label || settings.tone}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="personality" className="flex items-center">
            <Brain className="h-4 w-4 mr-1.5" />
            Personality
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Palette className="h-4 w-4 mr-1.5" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center">
            <Sliders className="h-4 w-4 mr-1.5" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Personality tab */}
        <TabsContent value="personality" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assistant-name">Assistant Name</Label>
                <Input
                  id="assistant-name"
                  value={settings.name}
                  onChange={(e) => updateSettings({ name: e.target.value })}
                  placeholder="Enter a name for your assistant"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assistant-description">Description</Label>
                <Textarea
                  id="assistant-description"
                  value={settings.description}
                  onChange={(e) => updateSettings({ description: e.target.value })}
                  placeholder="Describe what your assistant does"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assistant-greeting">Greeting Message</Label>
                <Textarea
                  id="assistant-greeting"
                  value={settings.greeting}
                  onChange={(e) => updateSettings({ greeting: e.target.value })}
                  placeholder="Enter a greeting message"
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assistant-personality">Personality</Label>
                <Select value={settings.personality} onValueChange={(value) => updateSettings({ personality: value })}>
                  <SelectTrigger id="assistant-personality">
                    <SelectValue placeholder="Select personality" />
                  </SelectTrigger>
                  <SelectContent>
                    {personalityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Expertise</Label>
                <div className="flex flex-wrap gap-1 p-2 border rounded-md min-h-[80px]">
                  {settings.expertise.map((exp, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {expertiseOptions.find((o) => o.value === exp)?.label || exp}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() =>
                          updateSettings({
                            expertise: settings.expertise.filter((_, i) => i !== index),
                          })
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}

                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !settings.expertise.includes(value)) {
                        updateSettings({
                          expertise: [...settings.expertise, value],
                        })
                      }
                    }}
                  >
                    <SelectTrigger className="h-7 border-dashed border-gray-300 text-gray-500">
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      <span>Add expertise</span>
                    </SelectTrigger>
                    <SelectContent>
                      {expertiseOptions
                        .filter((option) => !settings.expertise.includes(option.value))
                        .map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assistant-tone">Tone</Label>
                  <Select value={settings.tone} onValueChange={(value) => updateSettings({ tone: value })}>
                    <SelectTrigger id="assistant-tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assistant-verbosity">Verbosity</Label>
                  <Select value={settings.verbosity} onValueChange={(value) => updateSettings({ verbosity: value })}>
                    <SelectTrigger id="assistant-verbosity">
                      <SelectValue placeholder="Select verbosity" />
                    </SelectTrigger>
                    <SelectContent>
                      {verbosityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assistant-formality">Formality</Label>
                  <Select value={settings.formality} onValueChange={(value) => updateSettings({ formality: value })}>
                    <SelectTrigger id="assistant-formality">
                      <SelectValue placeholder="Select formality" />
                    </SelectTrigger>
                    <SelectContent>
                      {formalityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assistant-creativity">Creativity</Label>
                  <Select value={settings.creativity} onValueChange={(value) => updateSettings({ creativity: value })}>
                    <SelectTrigger id="assistant-creativity">
                      <SelectValue placeholder="Select creativity" />
                    </SelectTrigger>
                    <SelectContent>
                      {creativityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <MessageSquare className="h-4 w-4 mr-1.5 text-blue-500" />
                Custom Instructions
              </CardTitle>
              <CardDescription>Add specific instructions for how the assistant should behave</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {settings.customInstructions.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No custom instructions yet</p>
                  <p className="text-xs mt-1">Add instructions to customize how your assistant responds</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {settings.customInstructions.map((instruction, index) => (
                    <div key={index} className="flex items-start p-3 border rounded-md bg-gray-100">
                      <div className="flex-1 text-sm">{instruction}</div>
                      <div className="flex items-center ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => editCustomInstruction(index)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500"
                          onClick={() => removeCustomInstruction(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  setNewInstruction("")
                  setEditingInstructionIndex(null)
                  setIsInstructionDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Instruction
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance tab */}
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Avatar</Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    {settings.isCustomAvatar && settings.avatarUrl ? (
                      <AvatarImage src={settings.avatarUrl} alt={settings.name} />
                    ) : (
                      <AvatarFallback style={{ backgroundColor: settings.primaryColor }} className="text-white text-xl">
                        {settings.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Switch
                        id="custom-avatar"
                        checked={settings.isCustomAvatar}
                        onCheckedChange={(checked) => updateSettings({ isCustomAvatar: checked })}
                      />
                      <Label htmlFor="custom-avatar" className="ml-2">
                        Use custom avatar
                      </Label>
                    </div>

                    {settings.isCustomAvatar && (
                      <Input
                        value={settings.avatarUrl}
                        onChange={(e) => updateSettings({ avatarUrl: e.target.value })}
                        placeholder="Enter avatar URL"
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <TooltipProvider key={color.value}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={cn(
                              "w-8 h-8 rounded-full",
                              settings.primaryColor === color.value && "ring-2 ring-offset-2 ring-gray-400",
                            )}
                            style={{ backgroundColor: color.value }}
                            onClick={() => updateSettings({ primaryColor: color.value })}
                          >
                            {settings.primaryColor === color.value && <Check className="h-4 w-4 text-white mx-auto" />}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label
                          className={cn(
                            "w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center cursor-pointer",
                            !colorOptions.some((c) => c.value === settings.primaryColor) &&
                              "ring-2 ring-offset-2 ring-gray-400",
                          )}
                        >
                          <input
                            type="color"
                            className="sr-only"
                            value={settings.primaryColor}
                            onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                          />
                          <Plus className="h-4 w-4 text-gray-500" />
                        </label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Custom color</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <TooltipProvider key={color.value}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={cn(
                              "w-8 h-8 rounded-full",
                              settings.secondaryColor === color.value && "ring-2 ring-offset-2 ring-gray-400",
                            )}
                            style={{ backgroundColor: color.value }}
                            onClick={() => updateSettings({ secondaryColor: color.value })}
                          >
                            {settings.secondaryColor === color.value && (
                              <Check className="h-4 w-4 text-white mx-auto" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label
                          className={cn(
                            "w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center cursor-pointer",
                            !colorOptions.some((c) => c.value === settings.secondaryColor) &&
                              "ring-2 ring-offset-2 ring-gray-400",
                          )}
                        >
                          <input
                            type="color"
                            className="sr-only"
                            value={settings.secondaryColor}
                            onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                          />
                          <Plus className="h-4 w-4 text-gray-500" />
                        </label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Custom color</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-3 mb-4">
                    <Avatar className="h-10 w-10">
                      {settings.isCustomAvatar && settings.avatarUrl ? (
                        <AvatarImage src={settings.avatarUrl} alt={settings.name} />
                      ) : (
                        <AvatarFallback style={{ backgroundColor: settings.primaryColor }} className="text-white">
                          {settings.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div
                      className="p-3 rounded-lg max-w-[80%]"
                      style={{ backgroundColor: settings.primaryColor + "15" }}
                    >
                      <p className="text-sm">{settings.greeting}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 justify-end">
                    <div
                      className="p-3 rounded-lg max-w-[80%]"
                      style={{ backgroundColor: settings.secondaryColor + "15" }}
                    >
                      <p className="text-sm">Hello! I have a question about React hooks.</p>
                    </div>

                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gray-300 text-gray-600">U</AvatarFallback>
                    </Avatar>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label>Chat Interface Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={cn(
                      "border rounded-md p-3 cursor-pointer",
                      "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
                    )}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Modern</span>
                      <Check className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500" />
                      <div className="flex-1 h-2 bg-gray-200 rounded-full" />
                    </div>
                  </div>

                  <div
                    className={cn(
                      "border rounded-md p-3 cursor-pointer",
                      "hover:border-gray-300 dark:hover:border-gray-600",
                    )}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Classic</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300" />
                      <div className="flex-1 h-2 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Advanced tab */}
        <TabsContent value="advanced" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Zap className="h-4 w-4 mr-1.5 text-amber-500" />
                System Prompt
              </CardTitle>
              <CardDescription>Define the core behavior and capabilities of your assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 border rounded-md bg-gray-100">
                <p className="text-sm font-mono whitespace-pre-wrap">{settings.systemPrompt}</p>
              </div>

              <div className="flex justify-end mt-2">
                <Button variant="outline" size="sm" onClick={() => setIsSystemPromptDialogOpen(true)}>
                  <Edit2 className="h-4 w-4 mr-1.5" />
                  Edit System Prompt
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Behavior Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-personalization" className="font-medium">
                      Personalization
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">Adapt to your preferences over time</p>
                  </div>
                  <Switch
                    id="enable-personalization"
                    checked={settings.enablePersonalization}
                    onCheckedChange={(checked) => updateSettings({ enablePersonalization: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-memory" className="font-medium">
                      Conversation Memory
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">Remember details from previous conversations</p>
                  </div>
                  <Switch
                    id="enable-memory"
                    checked={settings.enableMemory}
                    onCheckedChange={(checked) => updateSettings({ enableMemory: checked })}
                  />
                </div>

                {settings.enableMemory && (
                  <div className="pl-6 space-y-2">
                    <Label htmlFor="memory-depth" className="text-sm">
                      Memory Depth: {settings.memoryDepth} conversations
                    </Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">5</span>
                      <Slider
                        id="memory-depth"
                        min={5}
                        max={50}
                        step={5}
                        value={[settings.memoryDepth]}
                        onValueChange={(value) => updateSettings({ memoryDepth: value[0] })}
                        className="flex-1"
                      />
                      <span className="text-xs">50</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-continuous-learning" className="font-medium">
                      Continuous Learning
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">Improve responses based on feedback</p>
                  </div>
                  <Switch
                    id="enable-continuous-learning"
                    checked={settings.enableContinuousLearning}
                    onCheckedChange={(checked) => updateSettings({ enableContinuousLearning: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsSavePresetDialogOpen(true)}
                  >
                    <Save className="h-4 w-4 mr-1.5" />
                    Save Current Settings as Preset
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsResetConfirmDialogOpen(true)}
                  >
                    <RefreshCw className="h-4 w-4 mr-1.5" />
                    Reset to Default Settings
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Import/Export</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        const dataStr =
                          "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2))
                        const downloadAnchorNode = document.createElement("a")
                        downloadAnchorNode.setAttribute("href", dataStr)
                        downloadAnchorNode.setAttribute("download", "assistant-settings.json")
                        document.body.appendChild(downloadAnchorNode)
                        downloadAnchorNode.click()
                        downloadAnchorNode.remove()
                      }}
                    >
                      <Download className="h-4 w-4 mr-1.5" />
                      Export
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = "application/json"
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                              try {
                                const importedSettings = JSON.parse(e.target?.result as string)
                                setSettings(importedSettings)
                              } catch (error) {
                                console.error("Failed to parse settings file", error)
                              }
                            }
                            reader.readAsText(file)
                          }
                        }
                        input.click()
                      }}
                    >
                      <Upload className="h-4 w-4 mr-1.5" />
                      Import
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Presets dialog */}
      <Dialog open={isPresetDialogOpen} onOpenChange={setIsPresetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
              Assistant Presets
            </DialogTitle>
            <DialogDescription>Choose a preset to quickly configure your assistant</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => applyPreset(preset)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium">{preset.name}</h4>
                    {preset.isBuiltIn && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Built-in
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 ml-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    applyPreset(preset)
                  }}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPresetDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save preset dialog */}
      <Dialog open={isSavePresetDialogOpen} onOpenChange={setIsSavePresetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Save className="h-5 w-5 mr-2 text-blue-500" />
              Save as Preset
            </DialogTitle>
            <DialogDescription>Save your current assistant settings as a preset for future use</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Enter a name for your preset"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preset-description">Description (optional)</Label>
              <Textarea
                id="preset-description"
                value={newPresetDescription}
                onChange={(e) => setNewPresetDescription(e.target.value)}
                placeholder="Describe what this preset is for"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSavePresetDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveAsPreset} disabled={!newPresetName.trim()}>
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom instruction dialog */}
      <Dialog open={isInstructionDialogOpen} onOpenChange={setIsInstructionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
              {editingInstructionIndex !== null ? "Edit Instruction" : "Add Custom Instruction"}
            </DialogTitle>
            <DialogDescription>
              {editingInstructionIndex !== null
                ? "Update this instruction for your assistant"
                : "Add a specific instruction for how your assistant should behave"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <Label htmlFor="instruction">Instruction</Label>
              <Textarea
                id="instruction"
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                placeholder="E.g., Always provide code examples when explaining programming concepts"
                rows={4}
              />
            </div>

            <div className="text-xs text-gray-500">
              <p>Tips for effective instructions:</p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Be specific and clear about what you want</li>
                <li>Focus on one behavior per instruction</li>
                <li>Use examples to illustrate your expectations</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInstructionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addCustomInstruction} disabled={!newInstruction.trim()}>
              {editingInstructionIndex !== null ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* System prompt dialog */}
      <Dialog open={isSystemPromptDialogOpen} onOpenChange={setIsSystemPromptDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-amber-500" />
              Edit System Prompt
            </DialogTitle>
            <DialogDescription>Define the core behavior and capabilities of your assistant</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea
                id="system-prompt"
                value={settings.systemPrompt}
                onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
                placeholder="Enter system prompt"
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <div className="text-xs text-gray-500">
              <p>The system prompt is the initial instruction given to the AI model that defines its behavior.</p>
              <p className="mt-1">
                <HelpCircle className="h-3.5 w-3.5 inline mr-1" />
                Advanced users only. Changes here can significantly alter assistant behavior.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSystemPromptDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsSystemPromptDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset confirmation dialog */}
      <Dialog open={isResetConfirmDialogOpen} onOpenChange={setIsResetConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500">
              <RefreshCw className="h-5 w-5 mr-2" />
              Reset to Default Settings
            </DialogTitle>
            <DialogDescription>This will reset all assistant settings to their default values</DialogDescription>
          </DialogHeader>

          <div className="my-2">
            <p className="text-sm">Are you sure you want to reset all settings? This action cannot be undone.</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={resetToDefaults}>
              Reset All Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
