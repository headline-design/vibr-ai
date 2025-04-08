"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Cpu,
  Zap,
  Settings,
  Clock,
  DollarSign,
  Star,
  StarHalf,
  HelpCircle,
  Check,
  Sparkles,
  Brain,
  Lightbulb,
  MessageSquare,
  Code,
  Image,
  Bookmark,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AIModel {
  id: string
  name: string
  provider: string
  version: string
  type: "text" | "image" | "audio" | "video" | "multimodal"
  capabilities: string[]
  contextWindow: number
  tokenLimit: number
  costPer1KTokens: {
    input: number
    output: number
  }
  averageSpeed: number
  rating: number
  isDefault?: boolean
  isFavorite?: boolean
}

interface ModelPreset {
  id: string
  name: string
  description: string
  model: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  systemPrompt?: string
  isDefault?: boolean
}

export function AIModelConfiguration() {
  const [activeTab, setActiveTab] = useState("models")
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<ModelPreset | null>(null)
  const [isCreatePresetDialogOpen, setIsCreatePresetDialogOpen] = useState(false)
  const [newPresetName, setNewPresetName] = useState("")
  const [newPresetDescription, setNewPresetDescription] = useState("")
  const [newPresetModel, setNewPresetModel] = useState("")
  const [newPresetTemperature, setNewPresetTemperature] = useState(0.7)
  const [newPresetMaxTokens, setNewPresetMaxTokens] = useState(1024)
  const [newPresetTopP, setNewPresetTopP] = useState(1.0)
  const [newPresetFrequencyPenalty, setNewPresetFrequencyPenalty] = useState(0.0)
  const [newPresetPresencePenalty, setNewPresetPresencePenalty] = useState(0.0)
  const [newPresetSystemPrompt, setNewPresetSystemPrompt] = useState("")

  // Sample data
  const models: AIModel[] = [
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      version: "1.0",
      type: "multimodal",
      capabilities: ["text-generation", "code-generation", "image-understanding", "reasoning"],
      contextWindow: 128000,
      tokenLimit: 4096,
      costPer1KTokens: {
        input: 0.01,
        output: 0.03,
      },
      averageSpeed: 1.2,
      rating: 4.9,
      isDefault: true,
      isFavorite: true,
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      provider: "OpenAI",
      version: "0.613",
      type: "text",
      capabilities: ["text-generation", "code-generation"],
      contextWindow: 16000,
      tokenLimit: 4096,
      costPer1KTokens: {
        input: 0.0015,
        output: 0.002,
      },
      averageSpeed: 0.8,
      rating: 4.5,
      isFavorite: true,
    },
    {
      id: "claude-3-opus",
      name: "Claude 3 Opus",
      provider: "Anthropic",
      version: "1.0",
      type: "multimodal",
      capabilities: ["text-generation", "code-generation", "image-understanding", "reasoning"],
      contextWindow: 200000,
      tokenLimit: 4096,
      costPer1KTokens: {
        input: 0.015,
        output: 0.075,
      },
      averageSpeed: 1.5,
      rating: 4.8,
    },
    {
      id: "claude-3-sonnet",
      name: "Claude 3 Sonnet",
      provider: "Anthropic",
      version: "1.0",
      type: "multimodal",
      capabilities: ["text-generation", "code-generation", "image-understanding"],
      contextWindow: 200000,
      tokenLimit: 4096,
      costPer1KTokens: {
        input: 0.003,
        output: 0.015,
      },
      averageSpeed: 1.0,
      rating: 4.6,
    },
    {
      id: "llama-3-70b",
      name: "Llama 3 70B",
      provider: "Meta",
      version: "1.0",
      type: "text",
      capabilities: ["text-generation", "code-generation", "reasoning"],
      contextWindow: 8192,
      tokenLimit: 2048,
      costPer1KTokens: {
        input: 0.0007,
        output: 0.0014,
      },
      averageSpeed: 1.1,
      rating: 4.4,
    },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      provider: "Google",
      version: "1.0",
      type: "multimodal",
      capabilities: ["text-generation", "code-generation", "image-understanding"],
      contextWindow: 32000,
      tokenLimit: 8192,
      costPer1KTokens: {
        input: 0.0025,
        output: 0.0075,
      },
      averageSpeed: 1.3,
      rating: 4.7,
    },
  ]

  const presets: ModelPreset[] = [
    {
      id: "preset-1",
      name: "Default",
      description: "Balanced settings for general use",
      model: "gpt-4o",
      temperature: 0.7,
      maxTokens: 1024,
      topP: 1.0,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      isDefault: true,
    },
    {
      id: "preset-2",
      name: "Creative Writing",
      description: "Higher creativity for storytelling and content creation",
      model: "gpt-4o",
      temperature: 0.9,
      maxTokens: 2048,
      topP: 1.0,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5,
      systemPrompt:
        "You are a creative writing assistant. Be imaginative, descriptive, and engaging in your responses.",
    },
    {
      id: "preset-3",
      name: "Technical Documentation",
      description: "Precise and factual for technical content",
      model: "gpt-4o",
      temperature: 0.3,
      maxTokens: 1024,
      topP: 0.9,
      frequencyPenalty: 0.2,
      presencePenalty: 0.0,
      systemPrompt: "You are a technical documentation assistant. Provide clear, concise, and accurate information.",
    },
    {
      id: "preset-4",
      name: "Code Assistant",
      description: "Optimized for programming help",
      model: "gpt-4o",
      temperature: 0.2,
      maxTokens: 2048,
      topP: 0.95,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
      systemPrompt:
        "You are a coding assistant. Provide clean, efficient, and well-documented code examples with explanations.",
    },
    {
      id: "preset-5",
      name: "Fast Response",
      description: "Optimized for quick responses with lower token usage",
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      maxTokens: 256,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
    },
  ]

  // Get model by ID
  const getModelById = (id: string) => {
    return models.find((model) => model.id === id) || null
  }

  // Format cost
  const formatCost = (cost: number) => {
    return `$${cost.toFixed(4)}`
  }

  // Get capability icon
  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case "text-generation":
        return <MessageSquare className="h-4 w-4" />
      case "code-generation":
        return <Code className="h-4 w-4" />
      case "image-understanding":
        return <Image className="h-4 w-4" />
      case "reasoning":
        return <Brain className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  // Get capability label
  const getCapabilityLabel = (capability: string) => {
    switch (capability) {
      case "text-generation":
        return "Text Generation"
      case "code-generation":
        return "Code Generation"
      case "image-understanding":
        return "Image Understanding"
      case "reasoning":
        return "Advanced Reasoning"
      default:
        return capability
    }
  }

  // Handle create preset
  const handleCreatePreset = () => {
    // In a real app, this would save the preset to the database
    console.log("Creating preset:", {
      name: newPresetName,
      description: newPresetDescription,
      model: newPresetModel,
      temperature: newPresetTemperature,
      maxTokens: newPresetMaxTokens,
      topP: newPresetTopP,
      frequencyPenalty: newPresetFrequencyPenalty,
      presencePenalty: newPresetPresencePenalty,
      systemPrompt: newPresetSystemPrompt,
    })

    setIsCreatePresetDialogOpen(false)

    // Reset form
    setNewPresetName("")
    setNewPresetDescription("")
    setNewPresetModel("")
    setNewPresetTemperature(0.7)
    setNewPresetMaxTokens(1024)
    setNewPresetTopP(1.0)
    setNewPresetFrequencyPenalty(0.0)
    setNewPresetPresencePenalty(0.0)
    setNewPresetSystemPrompt("")
  }

  // Toggle favorite
  const toggleFavorite = (model: AIModel) => {
    // In a real app, this would update the model in the database
    console.log("Toggling favorite for model:", model.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">AI Model Configuration</h2>
        <Badge variant="outline" className="gap-1">
          <Cpu className="h-4 w-4" />
          {models.filter((m) => m.isDefault).length > 0
            ? models.filter((m) => m.isDefault)[0].name
            : "No default model"}{" "}
          (Default)
        </Badge>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Models
          </TabsTrigger>
          <TabsTrigger value="presets" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Presets
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4 mt-6">
          <div className="grid gap-6 md:grid-cols-12">
            <Card className="md:col-span-7">
              <CardHeader>
                <CardTitle>Available Models</CardTitle>
                <CardDescription>Select an AI model to use for your conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {models.map((model) => (
                      <div
                        key={model.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedModel?.id === model.id ? "border-primary bg-primary/5" : "hover:bg-accent"
                        }`}
                        onClick={() => setSelectedModel(model)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                              <Cpu className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{model.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {model.provider} • v{model.version}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {model.isDefault && (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                Default
                              </Badge>
                            )}
                            <button
                              className="text-muted-foreground hover:text-primary"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(model)
                              }}
                            >
                              {model.isFavorite ? (
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <Star className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="flex items-center gap-1 text-xs">
                            <MessageSquare className="h-3 w-3 text-muted-foreground" />
                            <span>Context: {model.contextWindow.toLocaleString()} tokens</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>Speed: {model.averageSpeed}x</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            <span>Cost: {formatCost(model.costPer1KTokens.output)}/1K tokens</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 text-muted-foreground" />
                            <span>Rating: {model.rating}/5</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {model.capabilities.map((capability) => (
                            <Badge key={capability} variant="secondary" className="text-xs">
                              {getCapabilityIcon(capability)}
                              <span className="ml-1">{getCapabilityLabel(capability)}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="md:col-span-5">
              <CardHeader>
                <CardTitle>Model Details</CardTitle>
                <CardDescription>Detailed information about the selected model</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedModel ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Cpu className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{selectedModel.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedModel.provider} • v{selectedModel.version}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Type</h4>
                        <p className="text-sm capitalize">{selectedModel.type}</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Context Window</h4>
                        <p className="text-sm">{selectedModel.contextWindow.toLocaleString()} tokens</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Max Output</h4>
                        <p className="text-sm">{selectedModel.tokenLimit.toLocaleString()} tokens</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Speed Rating</h4>
                        <p className="text-sm">{selectedModel.averageSpeed}x (relative)</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Cost</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 border rounded-md">
                          <p className="text-xs text-muted-foreground">Input</p>
                          <p className="text-sm font-medium">
                            {formatCost(selectedModel.costPer1KTokens.input)}/1K tokens
                          </p>
                        </div>
                        <div className="p-2 border rounded-md">
                          <p className="text-xs text-muted-foreground">Output</p>
                          <p className="text-sm font-medium">
                            {formatCost(selectedModel.costPer1KTokens.output)}/1K tokens
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Capabilities</h4>
                      <div className="space-y-2">
                        {selectedModel.capabilities.map((capability) => (
                          <div key={capability} className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                              {getCapabilityIcon(capability)}
                            </div>
                            <span className="text-sm">{getCapabilityLabel(capability)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Rating</h4>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star}>
                            {star <= Math.floor(selectedModel.rating) ? (
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ) : star === Math.ceil(selectedModel.rating) && star > Math.floor(selectedModel.rating) ? (
                              <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <Star className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                        <span className="text-sm ml-2">{selectedModel.rating}/5</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Button variant="outline" className="gap-2" onClick={() => toggleFavorite(selectedModel)}>
                        {selectedModel.isFavorite ? (
                          <>
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            Favorited
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4" />
                            Add to Favorites
                          </>
                        )}
                      </Button>
                      <Button className="gap-2" disabled={selectedModel.isDefault}>
                        <Check className="h-4 w-4" />
                        Set as Default
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <Cpu className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Model Selected</h3>
                    <p className="text-muted-foreground max-w-xs">
                      Select a model from the list to view detailed information
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="presets" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Model Presets</h3>
              <p className="text-sm text-muted-foreground">Save and load configurations for different use cases</p>
            </div>
            <Button onClick={() => setIsCreatePresetDialogOpen(true)}>Create Preset</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {presets.map((preset) => (
              <Card
                key={preset.id}
                className={`cursor-pointer transition-colors ${
                  selectedPreset?.id === preset.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedPreset(preset)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{preset.name}</CardTitle>
                    {preset.isDefault && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Default
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{preset.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Model:</span>
                      <span className="font-medium">{preset.model}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Temperature:</span>
                      <span className="font-medium">{preset.temperature}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Max Tokens:</span>
                      <span className="font-medium">{preset.maxTokens}</span>
                    </div>
                    {preset.systemPrompt && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">System Prompt:</span>
                        <p className="text-xs mt-1 line-clamp-2">{preset.systemPrompt}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex items-center justify-between w-full">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      <Bookmark className="h-3.5 w-3.5" />
                      Save
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Zap className="h-4 w-4 mr-2" />
                          Apply
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {!preset.isDefault && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {selectedPreset && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Preset Details: {selectedPreset.name}</CardTitle>
                <CardDescription>{selectedPreset.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <div className="flex items-center gap-2 p-2 border rounded-md">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedPreset.model}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Temperature: {selectedPreset.temperature}</Label>
                        <span className="text-xs text-muted-foreground">
                          {selectedPreset.temperature < 0.3
                            ? "More deterministic"
                            : selectedPreset.temperature > 0.7
                              ? "More creative"
                              : "Balanced"}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${selectedPreset.temperature * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Max Tokens: {selectedPreset.maxTokens}</Label>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${(selectedPreset.maxTokens / 4096) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Top P: {selectedPreset.topP}</Label>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${selectedPreset.topP * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Frequency Penalty: {selectedPreset.frequencyPenalty}</Label>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${selectedPreset.frequencyPenalty * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Presence Penalty: {selectedPreset.presencePenalty}</Label>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${selectedPreset.presencePenalty * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {selectedPreset.systemPrompt && (
                  <div className="space-y-2">
                    <Label>System Prompt</Label>
                    <div className="p-3 border rounded-md bg-muted/50">
                      <p className="text-sm whitespace-pre-wrap">{selectedPreset.systemPrompt}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" className="gap-2">
                  <Copy className="h-4 w-4" />
                  Duplicate
                </Button>
                <Button className="gap-2">
                  <Zap className="h-4 w-4" />
                  Apply Preset
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Configuration</CardTitle>
              <CardDescription>Fine-tune model behavior and performance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature" className="flex items-center gap-2">
                      Temperature
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Controls randomness. Lower values are more deterministic, higher values are more creative.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <span className="text-sm">0.7</span>
                  </div>
                  <Slider id="temperature" min={0} max={2} step={0.1} defaultValue={[0.7]} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Precise</span>
                    <span>Balanced</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-tokens" className="flex items-center gap-2">
                      Max Tokens
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Maximum number of tokens to generate. One token is roughly 4 characters.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <span className="text-sm">1024</span>
                  </div>
                  <Slider id="max-tokens" min={64} max={4096} step={64} defaultValue={[1024]} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Shorter</span>
                    <span>Medium</span>
                    <span>Longer</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="top-p" className="flex items-center gap-2">
                      Top P
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Controls diversity via nucleus sampling. 0.1 means only the top 10% most likely tokens are
                              considered.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <span className="text-sm">1.0</span>
                  </div>
                  <Slider id="top-p" min={0.1} max={1.0} step={0.05} defaultValue={[1.0]} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="frequency-penalty" className="flex items-center gap-2">
                      Frequency Penalty
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Reduces repetition by penalizing tokens that have already appeared in the text.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <span className="text-sm">0.0</span>
                  </div>
                  <Slider id="frequency-penalty" min={0} max={2} step={0.1} defaultValue={[0.0]} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="presence-penalty" className="flex items-center gap-2">
                      Presence Penalty
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Encourages the model to talk about new topics by penalizing tokens that have appeared at
                              all.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <span className="text-sm">0.0</span>
                  </div>
                  <Slider id="presence-penalty" min={0} max={2} step={0.1} defaultValue={[0.0]} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-base font-medium">System Prompt</h3>
                <div className="space-y-2">
                  <Label htmlFor="system-prompt" className="text-sm">
                    Define the AI's behavior and capabilities
                  </Label>
                  <textarea
                    id="system-prompt"
                    className="w-full h-32 p-3 border rounded-md"
                    placeholder="You are a helpful AI assistant..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isCreatePresetDialogOpen} onOpenChange={setIsCreatePresetDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create Preset</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Preset</DialogTitle>
            <DialogDescription>Create a new AI model preset for different use cases.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newPresetDescription}
                onChange={(e) => setNewPresetDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Model
              </Label>
              <Input
                id="model"
                value={newPresetModel}
                onChange={(e) => setNewPresetModel(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="temperature" className="text-right">
                Temperature
              </Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={newPresetTemperature}
                onChange={(e) => setNewPresetTemperature(Number.parseFloat(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxTokens" className="text-right">
                Max Tokens
              </Label>
              <Input
                id="maxTokens"
                type="number"
                value={newPresetMaxTokens}
                onChange={(e) => setNewPresetMaxTokens(Number.parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topP" className="text-right">
                Top P
              </Label>
              <Input
                id="topP"
                type="number"
                step="0.05"
                value={newPresetTopP}
                onChange={(e) => setNewPresetTopP(Number.parseFloat(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequencyPenalty" className="text-right">
                Frequency Penalty
              </Label>
              <Input
                id="frequencyPenalty"
                type="number"
                step="0.1"
                value={newPresetFrequencyPenalty}
                onChange={(e) => setNewPresetFrequencyPenalty(Number.parseFloat(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="presencePenalty" className="text-right">
                Presence Penalty
              </Label>
              <Input
                id="presencePenalty"
                type="number"
                step="0.1"
                value={newPresetPresencePenalty}
                onChange={(e) => setNewPresetPresencePenalty(Number.parseFloat(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="systemPrompt" className="text-right">
                System Prompt
              </Label>
              <textarea
                id="systemPrompt"
                value={newPresetSystemPrompt}
                onChange={(e) => setNewPresetSystemPrompt(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsCreatePresetDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleCreatePreset}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
