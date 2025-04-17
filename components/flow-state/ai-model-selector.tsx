"use client"

import { useState } from "react"
import { Brain, Clock, DollarSign, Info, Check, Lock, Star, Cpu, Gauge, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  capabilities: string[]
  limitations?: string[]
  contextLength: number
  costPer1kTokens: number
  latency: "low" | "medium" | "high"
  isNew?: boolean
  isPremium?: boolean
  isRecommended?: boolean
  category: "general" | "specialized" | "experimental"
}

interface AIModelSelectorProps {
  onModelSelect: (modelId: string, settings: AIModelSettings) => void
  initialModelId?: string
  initialSettings?: Partial<AIModelSettings>
  className?: string
}

interface AIModelSettings {
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  systemPrompt: string
  enableKnowledgeBase: boolean
  enableWebSearch: boolean
  enableCodeInterpreter: boolean
  enablePlugins: boolean
}

export function AIModelSelector({
  onModelSelect,
  initialModelId = "gpt-4",
  initialSettings,
  className,
}: AIModelSelectorProps) {
  // Sample models data
  const models: AIModel[] = [
    {
      id: "gpt-4",
      name: "GPT-4",
      provider: "OpenAI",
      description: "Advanced reasoning, complex instructions, and expert-level content generation",
      capabilities: ["Advanced reasoning", "Complex instructions", "Expert-level content"],
      contextLength: 8192,
      costPer1kTokens: 0.03,
      latency: "medium",
      isRecommended: true,
      category: "general",
    },
    {
      id: "gpt-4-turbo",
      name: "GPT-4 Turbo",
      provider: "OpenAI",
      description: "Faster version of GPT-4 with improved performance and lower cost",
      capabilities: ["Advanced reasoning", "Complex instructions", "Faster response time"],
      contextLength: 16384,
      costPer1kTokens: 0.01,
      latency: "low",
      isNew: true,
      category: "general",
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      provider: "OpenAI",
      description: "Fast and cost-effective for most everyday tasks",
      capabilities: ["General knowledge", "Creative content", "Conversational"],
      limitations: ["Less reasoning ability", "Simpler instructions only"],
      contextLength: 4096,
      costPer1kTokens: 0.002,
      latency: "low",
      category: "general",
    },
    {
      id: "claude-2",
      name: "Claude 2",
      provider: "Anthropic",
      description: "Strong reasoning and conversation with longer context",
      capabilities: ["Long context", "Nuanced conversation", "Safety focused"],
      contextLength: 100000,
      costPer1kTokens: 0.008,
      latency: "medium",
      category: "general",
    },
    {
      id: "llama-2-70b",
      name: "Llama 2 (70B)",
      provider: "Meta",
      description: "Open model with strong performance across various tasks",
      capabilities: ["Open weights", "Customizable", "General purpose"],
      contextLength: 4096,
      costPer1kTokens: 0.001,
      latency: "medium",
      category: "general",
    },
    {
      id: "code-llama-34b",
      name: "Code Llama (34B)",
      provider: "Meta",
      description: "Specialized for code generation and understanding",
      capabilities: ["Code generation", "Code explanation", "Debugging"],
      contextLength: 16384,
      costPer1kTokens: 0.001,
      latency: "medium",
      category: "specialized",
    },
    {
      id: "mistral-7b",
      name: "Mistral 7B",
      provider: "Mistral AI",
      description: "Efficient model with strong performance despite smaller size",
      capabilities: ["Efficient", "Strong reasoning", "Low resource requirements"],
      contextLength: 8192,
      costPer1kTokens: 0.0005,
      latency: "low",
      category: "general",
    },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      provider: "Google",
      description: "Google's multimodal model with strong reasoning capabilities",
      capabilities: ["Multimodal", "Strong reasoning", "Knowledge cutoff: Apr 2023"],
      contextLength: 32768,
      costPer1kTokens: 0.0025,
      latency: "low",
      isNew: true,
      category: "general",
    },
    {
      id: "gpt-4-vision",
      name: "GPT-4 Vision",
      provider: "OpenAI",
      description: "Analyze and understand images with advanced reasoning",
      capabilities: ["Image understanding", "Visual reasoning", "Multimodal"],
      contextLength: 8192,
      costPer1kTokens: 0.05,
      latency: "high",
      isPremium: true,
      category: "specialized",
    },
    {
      id: "falcon-180b",
      name: "Falcon (180B)",
      provider: "TII",
      description: "Large open model with strong performance on various tasks",
      capabilities: ["Open weights", "Massive scale", "General purpose"],
      contextLength: 2048,
      costPer1kTokens: 0.002,
      latency: "high",
      category: "experimental",
    },
  ]

  // State
  const [selectedModelId, setSelectedModelId] = useState<string>(initialModelId)
  const [activeTab, setActiveTab] = useState<string>("general")
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [settings, setSettings] = useState<AIModelSettings>({
    temperature: initialSettings?.temperature ?? 0.7,
    maxTokens: initialSettings?.maxTokens ?? 2048,
    topP: initialSettings?.topP ?? 1.0,
    frequencyPenalty: initialSettings?.frequencyPenalty ?? 0.0,
    presencePenalty: initialSettings?.presencePenalty ?? 0.0,
    systemPrompt: initialSettings?.systemPrompt ?? "You are a helpful AI assistant.",
    enableKnowledgeBase: initialSettings?.enableKnowledgeBase ?? false,
    enableWebSearch: initialSettings?.enableWebSearch ?? false,
    enableCodeInterpreter: initialSettings?.enableCodeInterpreter ?? false,
    enablePlugins: initialSettings?.enablePlugins ?? false,
  })

  // Get selected model
  const selectedModel = models.find((model) => model.id === selectedModelId) || models[0]

  // Filter models by category
  const filteredModels = models.filter((model) => {
    if (activeTab === "all") return true
    if (activeTab === "general") return model.category === "general"
    if (activeTab === "specialized") return model.category === "specialized"
    if (activeTab === "experimental") return model.category === "experimental"
    return true
  })

  // Handle model selection
  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId)
    onModelSelect(modelId, settings)
  }

  // Update settings
  const updateSettings = (newSettings: Partial<AIModelSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    onModelSelect(selectedModelId, updatedSettings)
  }

  // Format cost
  const formatCost = (cost: number) => {
    if (cost < 0.01) {
      return `$${cost.toFixed(4)}`
    }
    return `$${cost.toFixed(2)}`
  }

  // Get latency label
  const getLatencyLabel = (latency: AIModel["latency"]) => {
    switch (latency) {
      case "low":
        return "Fast"
      case "medium":
        return "Medium"
      case "high":
        return "Slow"
      default:
        return "Medium"
    }
  }

  // Get latency color
  const getLatencyColor = (latency: AIModel["latency"]) => {
    switch (latency) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-amber-500"
      case "high":
        return "text-red-500"
      default:
        return "text-amber-500"
    }
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-500" />
          AI Models
        </h2>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Sliders className="h-3.5 w-3.5" />
              <span>Settings</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Model Settings</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                >
                  {showAdvancedSettings ? "Basic" : "Advanced"}
                </Button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature" className="text-xs">
                      Temperature: {settings.temperature.toFixed(1)}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p className="text-xs">
                            Controls randomness. Lower values are more deterministic, higher values are more creative.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={2}
                    step={0.1}
                    value={[settings.temperature]}
                    onValueChange={(value) => updateSettings({ temperature: value[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Precise</span>
                    <span>Balanced</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maxTokens" className="text-xs">
                      Max Output Length: {settings.maxTokens}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p className="text-xs">
                            Maximum number of tokens to generate. One token is roughly 4 characters.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    id="maxTokens"
                    min={256}
                    max={4096}
                    step={256}
                    value={[settings.maxTokens]}
                    onValueChange={(value) => updateSettings({ maxTokens: value[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Short</span>
                    <span>Medium</span>
                    <span>Long</span>
                  </div>
                </div>

                {showAdvancedSettings && (
                  <>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="topP" className="text-xs">
                          Top P: {settings.topP.toFixed(1)}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs">
                              <p className="text-xs">
                                Controls diversity via nucleus sampling. Lower values are more focused.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Slider
                        id="topP"
                        min={0.1}
                        max={1.0}
                        step={0.1}
                        value={[settings.topP]}
                        onValueChange={(value) => updateSettings({ topP: value[0] })}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="frequencyPenalty" className="text-xs">
                          Frequency Penalty: {settings.frequencyPenalty.toFixed(1)}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs">
                              <p className="text-xs">Reduces repetition by penalizing tokens that appear frequently.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Slider
                        id="frequencyPenalty"
                        min={0}
                        max={2}
                        step={0.1}
                        value={[settings.frequencyPenalty]}
                        onValueChange={(value) => updateSettings({ frequencyPenalty: value[0] })}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="presencePenalty" className="text-xs">
                          Presence Penalty: {settings.presencePenalty.toFixed(1)}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs">
                              <p className="text-xs">
                                Encourages the model to talk about new topics by penalizing tokens that have appeared.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Slider
                        id="presencePenalty"
                        min={0}
                        max={2}
                        step={0.1}
                        value={[settings.presencePenalty]}
                        onValueChange={(value) => updateSettings({ presencePenalty: value[0] })}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="systemPrompt" className="text-xs">
                        System Prompt
                      </Label>
                      <textarea
                        id="systemPrompt"
                        value={settings.systemPrompt}
                        onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
                        className="w-full h-20 px-3 py-2 text-xs border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Instructions for the AI model..."
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-xs font-medium">Capabilities</h4>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="knowledge-base" className="text-xs cursor-pointer">
                      Knowledge Base
                    </Label>
                    <Switch
                      id="knowledge-base"
                      checked={settings.enableKnowledgeBase}
                      onCheckedChange={(checked) => updateSettings({ enableKnowledgeBase: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="web-search" className="text-xs cursor-pointer">
                      Web Search
                    </Label>
                    <Switch
                      id="web-search"
                      checked={settings.enableWebSearch}
                      onCheckedChange={(checked) => updateSettings({ enableWebSearch: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="code-interpreter" className="text-xs cursor-pointer">
                      Code Interpreter
                    </Label>
                    <Switch
                      id="code-interpreter"
                      checked={settings.enableCodeInterpreter}
                      onCheckedChange={(checked) => updateSettings({ enableCodeInterpreter: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="plugins" className="text-xs cursor-pointer">
                      Plugins
                    </Label>
                    <Switch
                      id="plugins"
                      checked={settings.enablePlugins}
                      onCheckedChange={(checked) => updateSettings({ enablePlugins: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected model display */}
      <div className="mb-4 p-4 border rounded-lg bg-accent-muted">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center">
              <h3 className="text-base font-medium">{selectedModel.name}</h3>
              <Badge variant="outline" className="ml-2 text-xs">
                {selectedModel.provider}
              </Badge>
              {selectedModel.isNew && <Badge className="ml-2 bg-green-100 text-green-800 text-xs">New</Badge>}
              {selectedModel.isRecommended && (
                <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">Recommended</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{selectedModel.description}</p>
          </div>

          <Select value={selectedModelId} onValueChange={handleModelSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center">
                    <span>{model.name}</span>
                    {model.isNew && <Badge className="ml-2 bg-green-100 text-green-800 text-xs">New</Badge>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex items-center">
            <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Context Length</div>
              <div className="text-sm font-medium">{selectedModel.contextLength.toLocaleString()} tokens</div>
            </div>
          </div>

          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Cost</div>
              <div className="text-sm font-medium">{formatCost(selectedModel.costPer1kTokens)} per 1K tokens</div>
            </div>
          </div>

          <div className="flex items-center">
            <Clock className={cn("h-4 w-4 mr-2", getLatencyColor(selectedModel.latency))} />
            <div>
              <div className="text-xs text-muted-foreground">Speed</div>
              <div className="text-sm font-medium">{getLatencyLabel(selectedModel.latency)}</div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-muted-foreground mb-1">Capabilities</div>
          <div className="flex flex-wrap gap-1">
            {selectedModel.capabilities.map((capability, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {capability}
              </Badge>
            ))}
          </div>
        </div>

        {selectedModel.limitations && (
          <div className="mt-3">
            <div className="text-xs text-muted-foreground mb-1">Limitations</div>
            <div className="flex flex-wrap gap-1">
              {selectedModel.limitations.map((limitation, index) => (
                <Badge key={index} variant="outline" className="text-xs text-amber-600 border-amber-200 bg-amber-50">
                  {limitation}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Model selection tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="specialized">Specialized</TabsTrigger>
          <TabsTrigger value="experimental">Experimental</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-2">
          {filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isSelected={model.id === selectedModelId}
              onSelect={handleModelSelect}
            />
          ))}
        </TabsContent>

        <TabsContent value="general" className="mt-4 space-y-2">
          {filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isSelected={model.id === selectedModelId}
              onSelect={handleModelSelect}
            />
          ))}
        </TabsContent>

        <TabsContent value="specialized" className="mt-4 space-y-2">
          {filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isSelected={model.id === selectedModelId}
              onSelect={handleModelSelect}
            />
          ))}
        </TabsContent>

        <TabsContent value="experimental" className="mt-4 space-y-2">
          {filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isSelected={model.id === selectedModelId}
              onSelect={handleModelSelect}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Model card component
function ModelCard({
  model,
  isSelected,
  onSelect,
}: {
  model: AIModel
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  return (
    <div
      className={cn(
        "p-3 border rounded-lg cursor-pointer transition-colors",
        isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "hover:bg-accent-muted",
      )}
      onClick={() => onSelect(model.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="mr-3">
            {isSelected ? (
              <Check className="h-5 w-5 text-blue-500" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
            )}
          </div>

          <div>
            <div className="flex items-center">
              <h3 className="font-medium">{model.name}</h3>
              <Badge variant="outline" className="ml-2 text-xs">
                {model.provider}
              </Badge>
              {model.isNew && <Badge className="ml-2 bg-green-100 text-green-800 text-xs">New</Badge>}
              {model.isPremium && (
                <Badge className="ml-2 bg-purple-100 text-purple-800 text-xs flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>Premium</span>
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{model.description}</p>
          </div>
        </div>

        {model.isRecommended && (
          <Badge className="bg-blue-100 text-blue-800 text-xs flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            <span>Recommended</span>
          </Badge>
        )}
      </div>

      <div className="flex items-center mt-2 text-xs text-muted-foreground/80 space-x-4">
        <div className="flex items-center">
          <Cpu className="h-3.5 w-3.5 mr-1" />
          <span>{model.contextLength.toLocaleString()} tokens</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="h-3.5 w-3.5 mr-1" />
          <span>${model.costPer1kTokens.toFixed(4)}/1K</span>
        </div>
        <div className="flex items-center">
          <Gauge className="h-3.5 w-3.5 mr-1" />
          <span>{model.latency === "low" ? "Fast" : model.latency === "medium" ? "Medium" : "Slow"}</span>
        </div>
      </div>
    </div>
  )
}
