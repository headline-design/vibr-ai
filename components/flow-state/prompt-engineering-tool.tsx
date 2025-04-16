"use client"

import { useState } from "react"
import {
  Sparkles,
  Save,
  Copy,
  Trash2,
  Plus,
  Edit2,
  Play,
  Lightbulb,
  Wand2,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Download,
  Upload,
  Check,
  X,
  HelpCircle,
  Layers,
  Pencil,
  FileText,
  Braces,
  Palette,
  Cpu,
  Gauge,
  Sliders,
  Clipboard,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

interface PromptEngineeringToolProps {
  onSavePrompt: (prompt: SavedPrompt) => void
  onTestPrompt: (prompt: string, variables: Record<string, string>) => Promise<string>
  savedPrompts?: SavedPrompt[]
  className?: string
}

interface SavedPrompt {
  id: string
  name: string
  description: string
  prompt: string
  tags: string[]
  variables: PromptVariable[]
  createdAt: string
  updatedAt: string
  isFavorite?: boolean
  category?: string
}

interface PromptVariable {
  name: string
  description: string
  defaultValue: string
  required: boolean
}

interface PromptTemplate {
  id: string
  name: string
  description: string
  template: string
  category: string
  tags: string[]
}

export function PromptEngineeringTool({
  onSavePrompt,
  onTestPrompt,
  savedPrompts = [],
  className,
}: PromptEngineeringToolProps) {
  // State
  const [activeTab, setActiveTab] = useState<string>("editor")
  const [promptText, setPromptText] = useState<string>("")
  const [promptName, setPromptName] = useState<string>("")
  const [promptDescription, setPromptDescription] = useState<string>("")
  const [promptTags, setPromptTags] = useState<string[]>([])
  const [promptVariables, setPromptVariables] = useState<PromptVariable[]>([])
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [testResult, setTestResult] = useState<string>("")
  const [isTestLoading, setIsTestLoading] = useState<boolean>(false)
  const [isVariableDialogOpen, setIsVariableDialogOpen] = useState<boolean>(false)
  const [currentVariable, setCurrentVariable] = useState<PromptVariable | null>(null)
  const [isEditingVariable, setIsEditingVariable] = useState<boolean>(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)

  // Sample prompt templates
  const promptTemplates: PromptTemplate[] = [
    {
      id: "summarize",
      name: "Text Summarization",
      description: "Summarize a text into a concise format",
      template: "Summarize the following text in {{length}} sentences:\n\n{{text}}",
      category: "content",
      tags: ["summarization", "content"],
    },
    {
      id: "explain",
      name: "Concept Explanation",
      description: "Explain a concept in simple terms",
      template: "Explain {{concept}} in simple terms that a {{audience}} would understand.",
      category: "education",
      tags: ["explanation", "education"],
    },
    {
      id: "code-review",
      name: "Code Review",
      description: "Review code for improvements and issues",
      template: "Review the following {{language}} code and suggest improvements:\n\n```{{language}}\n{{code}}\n```",
      category: "development",
      tags: ["code", "review", "development"],
    },
    {
      id: "blog-outline",
      name: "Blog Post Outline",
      description: "Create an outline for a blog post",
      template:
        "Create a detailed outline for a blog post about {{topic}}. The target audience is {{audience}} and the tone should be {{tone}}.",
      category: "content",
      tags: ["blog", "outline", "writing"],
    },
    {
      id: "product-description",
      name: "Product Description",
      description: "Generate a compelling product description",
      template:
        "Write a compelling product description for {{product_name}}, which is a {{product_type}} that {{product_benefit}}. The target audience is {{target_audience}}.",
      category: "marketing",
      tags: ["product", "marketing", "description"],
    },
    {
      id: "data-analysis",
      name: "Data Analysis",
      description: "Analyze data and provide insights",
      template:
        "Analyze the following data and provide key insights:\n\n{{data}}\n\nFocus on trends related to {{focus_area}} and provide {{number_of_insights}} main takeaways.",
      category: "analysis",
      tags: ["data", "analysis", "insights"],
    },
    {
      id: "email-template",
      name: "Professional Email",
      description: "Create a professional email template",
      template:
        "Write a professional email to {{recipient}} regarding {{subject}}. The tone should be {{tone}} and the purpose is to {{purpose}}.",
      category: "communication",
      tags: ["email", "communication", "professional"],
    },
    {
      id: "social-post",
      name: "Social Media Post",
      description: "Create engaging social media content",
      template:
        "Create a {{platform}} post about {{topic}} that will engage {{target_audience}}. The post should be {{tone}} in tone and include {{hashtags}} relevant hashtags.",
      category: "marketing",
      tags: ["social media", "marketing", "content"],
    },
  ]

  // Extract variables from prompt text
  const extractVariables = (text: string) => {
    const regex = /\{\{([^}]+)\}\}/g
    const matches = text.match(regex) || []
    const variableNames = matches.map((match) => match.replace(/\{\{|\}\}/g, ""))

    // Create new variables for ones that don't exist yet
    const existingNames = promptVariables.map((v) => v.name)
    const newVariables = variableNames
      .filter((name) => !existingNames.includes(name))
      .map((name) => ({
        name,
        description: `Value for ${name}`,
        defaultValue: "",
        required: true,
      }))

    // Remove variables that no longer exist in the prompt
    const updatedVariables = promptVariables.filter((v) => variableNames.includes(v.name))

    setPromptVariables([...updatedVariables, ...newVariables])

    // Update variable values
    const newValues = { ...variableValues }
    newVariables.forEach((v) => {
      newValues[v.name] = v.defaultValue
    })
    setVariableValues(newValues)
  }

  // Add or edit variable
  const saveVariable = () => {
    if (!currentVariable) return

    if (isEditingVariable) {
      // Update existing variable
      setPromptVariables(promptVariables.map((v) => (v.name === currentVariable.name ? currentVariable : v)))
    } else {
      // Add new variable
      setPromptVariables([...promptVariables, currentVariable])
    }

    // Update variable values
    setVariableValues({
      ...variableValues,
      [currentVariable.name]: currentVariable.defaultValue,
    })

    setCurrentVariable(null)
    setIsEditingVariable(false)
    setIsVariableDialogOpen(false)
  }

  // Remove variable
  const removeVariable = (name: string) => {
    setPromptVariables(promptVariables.filter((v) => v.name !== name))

    // Remove from values
    const newValues = { ...variableValues }
    delete newValues[name]
    setVariableValues(newValues)
  }

  // Fill prompt with variable values
  const fillPrompt = (prompt: string, values: Record<string, string>) => {
    let filledPrompt = prompt
    Object.entries(values).forEach(([name, value]) => {
      filledPrompt = filledPrompt.replace(new RegExp(`\\{\\{${name}\\}\\}`, "g"), value)
    })
    return filledPrompt
  }

  // Test prompt
  const testPrompt = async () => {
    setIsTestLoading(true)
    try {
      const filledPrompt = fillPrompt(promptText, variableValues)
      const result = await onTestPrompt(filledPrompt, variableValues)
      setTestResult(result)
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsTestLoading(false)
    }
  }

  // Save prompt
  const savePrompt = () => {
    const newPrompt: SavedPrompt = {
      id: `prompt-${Date.now()}`,
      name: promptName,
      description: promptDescription,
      prompt: promptText,
      tags: promptTags,
      variables: promptVariables,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSavePrompt(newPrompt)
    setIsSaveDialogOpen(false)
  }

  // Apply template
  const applyTemplate = () => {
    if (!selectedTemplate) return

    setPromptText(selectedTemplate.template)
    extractVariables(selectedTemplate.template)
    setPromptName(selectedTemplate.name)
    setPromptDescription(selectedTemplate.description)
    setPromptTags(selectedTemplate.tags)

    setIsTemplateDialogOpen(false)
  }

  // Clear editor
  const clearEditor = () => {
    setPromptText("")
    setPromptName("")
    setPromptDescription("")
    setPromptTags([])
    setPromptVariables([])
    setVariableValues({})
    setTestResult("")
  }

  // Filter templates by search query
  const filteredTemplates = promptTemplates.filter((template) => {
    if (!searchQuery) return true
    return (
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  // Group templates by category
  const groupedTemplates = filteredTemplates.reduce(
    (acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = []
      }
      acc[template.category].push(template)
      return acc
    },
    {} as Record<string, PromptTemplate[]>,
  )

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "content":
        return "Content Creation"
      case "education":
        return "Education & Learning"
      case "development":
        return "Software Development"
      case "marketing":
        return "Marketing & Sales"
      case "analysis":
        return "Data Analysis"
      case "communication":
        return "Communication"
      default:
        return category.charAt(0).toUpperCase() + category.slice(1)
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "content":
        return <FileText className="h-4 w-4" />
      case "education":
        return <Lightbulb className="h-4 w-4" />
      case "development":
        return <Braces className="h-4 w-4" />
      case "marketing":
        return <Palette className="h-4 w-4" />
      case "analysis":
        return <Cpu className="h-4 w-4" />
      case "communication":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center">
          <Wand2 className="h-5 w-5 mr-2 text-purple-500" />
          Prompt Engineering Tool
        </h2>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8" onClick={() => setIsTemplateDialogOpen(true)}>
            <Sparkles className="h-4 w-4 mr-1.5" />
            Templates
          </Button>

          <Button variant="default" size="sm" className="h-8" onClick={() => setIsSaveDialogOpen(true)}>
            <Save className="h-4 w-4 mr-1.5" />
            Save Prompt
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="editor" className="flex items-center">
            <Pencil className="h-4 w-4 mr-1.5" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center">
            <Play className="h-4 w-4 mr-1.5" />
            Test
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center">
            <Bookmark className="h-4 w-4 mr-1.5" />
            Library
          </TabsTrigger>
        </TabsList>

        {/* Editor tab */}
        <TabsContent value="editor" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Pencil className="h-4 w-4 mr-1.5 text-blue-500" />
                    Prompt Editor
                  </CardTitle>
                  <CardDescription>
                    Write your prompt with variables in double curly braces: {"{{variable_name}}"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={promptText}
                    onChange={(e) => {
                      setPromptText(e.target.value)
                      extractVariables(e.target.value)
                    }}
                    placeholder="Write your prompt here..."
                    className="min-h-[200px] font-mono"
                  />
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <Layers className="h-3.5 w-3.5 mr-1" />
                    {promptText.length} characters
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={clearEditor}>
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      Clear
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(promptText)
                      }}
                    >
                      <Copy className="h-4 w-4 mr-1.5" />
                      Copy
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Sliders className="h-4 w-4 mr-1.5 text-amber-500" />
                    Prompt Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt-name">Prompt Name</Label>
                    <Input
                      id="prompt-name"
                      value={promptName}
                      onChange={(e) => setPromptName(e.target.value)}
                      placeholder="Enter a name for your prompt"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt-description">Description</Label>
                    <Textarea
                      id="prompt-description"
                      value={promptDescription}
                      onChange={(e) => setPromptDescription(e.target.value)}
                      placeholder="Describe what your prompt does"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-1 p-2 border rounded-md min-h-[40px]">
                      {promptTags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => setPromptTags(promptTags.filter((_, i) => i !== index))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}

                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          const input = e.currentTarget.elements.namedItem("tag") as HTMLInputElement
                          if (input.value && !promptTags.includes(input.value)) {
                            setPromptTags([...promptTags, input.value])
                            input.value = ""
                          }
                        }}
                        className="inline-flex"
                      >
                        <Input name="tag" className="h-7 text-xs w-24 border-dashed" placeholder="Add tag..." />
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center">
                      <Braces className="h-4 w-4 mr-1.5 text-green-500" />
                      Variables
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7"
                      onClick={() => {
                        setCurrentVariable({
                          name: "",
                          description: "",
                          defaultValue: "",
                          required: true,
                        })
                        setIsEditingVariable(false)
                        setIsVariableDialogOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1.5" />
                      Add
                    </Button>
                  </div>
                  <CardDescription>Define variables for your prompt</CardDescription>
                </CardHeader>
                <CardContent>
                  {promptVariables.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <Braces className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No variables defined</p>
                      <p className="text-xs mt-1">Use {"{{variable_name}}"} in your prompt to create variables</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {promptVariables.map((variable) => (
                        <div key={variable.name} className="p-3 border rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm">
                              {variable.name}
                              {variable.required && <span className="text-red-500 ml-1">*</span>}
                            </div>
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  setCurrentVariable({ ...variable })
                                  setIsEditingVariable(true)
                                  setIsVariableDialogOpen(true)
                                }}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-500"
                                onClick={() => removeVariable(variable.name)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            {variable.description || `Value for ${variable.name}`}
                          </p>
                          <Input
                            value={variableValues[variable.name] || variable.defaultValue}
                            onChange={(e) =>
                              setVariableValues({
                                ...variableValues,
                                [variable.name]: e.target.value,
                              })
                            }
                            placeholder={`Enter value for ${variable.name}`}
                            className="h-7 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Gauge className="h-4 w-4 mr-1.5 text-red-500" />
                    Model Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="temperature" className="text-sm">
                        Temperature: 0.7
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">
                              Controls randomness. Lower values are more deterministic, higher values are more creative.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Slider id="temperature" min={0} max={2} step={0.1} defaultValue={[0.7]} />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Precise</span>
                      <span>Balanced</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-sm">
                      Model
                    </Label>
                    <Select defaultValue="gpt-4">
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-2">Claude 2</SelectItem>
                        <SelectItem value="llama-2">Llama 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="max-tokens" className="text-sm">
                        Max Tokens: 1024
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">
                              Maximum number of tokens to generate. One token is roughly 4 characters.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Slider id="max-tokens" min={256} max={4096} step={256} defaultValue={[1024]} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Test tab */}
        <TabsContent value="test" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Braces className="h-4 w-4 mr-1.5 text-green-500" />
                  Variable Values
                </CardTitle>
                <CardDescription>Set values for your prompt variables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {promptVariables.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Braces className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No variables defined</p>
                    <p className="text-xs mt-1">Go to the Editor tab to define variables</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {promptVariables.map((variable) => (
                      <div key={variable.name} className="space-y-2">
                        <Label htmlFor={`var-${variable.name}`} className="text-sm">
                          {variable.name}
                          {variable.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <Input
                          id={`var-${variable.name}`}
                          value={variableValues[variable.name] || variable.defaultValue}
                          onChange={(e) =>
                            setVariableValues({
                              ...variableValues,
                              [variable.name]: e.target.value,
                            })
                          }
                          placeholder={variable.description || `Enter value for ${variable.name}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={testPrompt}
                  disabled={isTestLoading || promptText.trim() === ""}
                >
                  {isTestLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1.5" />
                      Test Prompt
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1.5 text-blue-500" />
                  Result
                </CardTitle>
                <CardDescription>AI response to your prompt</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md bg-gray-100 min-h-[200px] max-h-[400px] overflow-y-auto">
                  {testResult ? (
                    <div className="whitespace-pre-wrap text-sm">{testResult}</div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No result yet</p>
                      <p className="text-xs mt-1">Test your prompt to see the result</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center text-xs text-gray-500">
                  <Layers className="h-3.5 w-3.5 mr-1" />
                  {testResult.length} characters
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(testResult)
                  }}
                  disabled={!testResult}
                >
                  <Copy className="h-4 w-4 mr-1.5" />
                  Copy Result
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Clipboard className="h-4 w-4 mr-1.5 text-purple-500" />
                Filled Prompt Preview
              </CardTitle>
              <CardDescription>Your prompt with all variables filled in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md bg-gray-100 font-mono text-sm whitespace-pre-wrap">
                {fillPrompt(promptText, variableValues)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Library tab */}
        <TabsContent value="library" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Bookmark className="h-4 w-4 mr-1.5 text-blue-500" />
                    Saved Prompts
                  </CardTitle>
                  <CardDescription>Your library of saved prompts</CardDescription>
                </CardHeader>
                <CardContent>
                  {savedPrompts.length === 0 ? (
                    <div className="text-center py-12">
                      <Bookmark className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No saved prompts</h3>
                      <p className="text-gray-500 mb-4">Save your prompts to reuse them later</p>
                      <Button variant="outline" onClick={() => setActiveTab("editor")}>
                        <Pencil className="h-4 w-4 mr-1.5" />
                        Create a Prompt
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedPrompts.map((prompt) => (
                        <div
                          key={prompt.id}
                          className="p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                          onClick={() => {
                            setPromptText(prompt.prompt)
                            setPromptName(prompt.name)
                            setPromptDescription(prompt.description)
                            setPromptTags(prompt.tags)
                            setPromptVariables(prompt.variables)

                            // Set variable values
                            const newValues: Record<string, string> = {}
                            prompt.variables.forEach((v) => {
                              newValues[v.name] = v.defaultValue
                            })
                            setVariableValues(newValues)

                            setActiveTab("editor")
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-medium">{prompt.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {new Date(prompt.updatedAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center">
                              {prompt.isFavorite && <BookmarkCheck className="h-4 w-4 text-amber-500 mr-1" />}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigator.clipboard.writeText(prompt.prompt)
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{prompt.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {prompt.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Lightbulb className="h-4 w-4 mr-1.5 text-amber-500" />
                    Prompt Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-sm">Be specific and clear</AccordionTrigger>
                      <AccordionContent className="text-xs text-gray-600 dark:text-gray-300">
                        Clearly state what you want the AI to do. Avoid ambiguity and provide context.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-sm">Use examples</AccordionTrigger>
                      <AccordionContent className="text-xs text-gray-600 dark:text-gray-300">
                        Provide examples of the desired output format or style to guide the AI.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-sm">Break down complex tasks</AccordionTrigger>
                      <AccordionContent className="text-xs text-gray-600 dark:text-gray-300">
                        For complex tasks, break them down into smaller, more manageable steps.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-sm">Specify the format</AccordionTrigger>
                      <AccordionContent className="text-xs text-gray-600 dark:text-gray-300">
                        Clearly specify the desired output format (e.g., bullet points, paragraphs, table).
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-sm">Use variables for flexibility</AccordionTrigger>
                      <AccordionContent className="text-xs text-gray-600 dark:text-gray-300">
                        Use variables like {"{{variable_name}}"} to make your prompts reusable and flexible.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const dataStr =
                      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedPrompts, null, 2))
                    const downloadAnchorNode = document.createElement("a")
                    downloadAnchorNode.setAttribute("href", dataStr)
                    downloadAnchorNode.setAttribute("download", "prompt-library.json")
                    document.body.appendChild(downloadAnchorNode)
                    downloadAnchorNode.click()
                    downloadAnchorNode.remove()
                  }}
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Export Library
                </Button>

                <Button
                  variant="outline"
                  size="sm"
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
                            const importedPrompts = JSON.parse(e.target?.result as string)
                            // In a real app, you would merge these with existing prompts
                            console.log("Imported prompts:", importedPrompts)
                          } catch (error) {
                            console.error("Failed to parse prompts file", error)
                          }
                        }
                        reader.readAsText(file)
                      }
                    }
                    input.click()
                  }}
                >
                  <Upload className="h-4 w-4 mr-1.5" />
                  Import Library
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Variable dialog */}
      <Dialog open={isVariableDialogOpen} onOpenChange={setIsVariableDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Braces className="h-5 w-5 mr-2 text-green-500" />
              {isEditingVariable ? "Edit Variable" : "Add Variable"}
            </DialogTitle>
            <DialogDescription>
              {isEditingVariable ? "Edit the properties of this variable" : "Define a new variable for your prompt"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <Label htmlFor="variable-name">Variable Name</Label>
              <Input
                id="variable-name"
                value={currentVariable?.name || ""}
                onChange={(e) =>
                  setCurrentVariable({
                    ...currentVariable!,
                    name: e.target.value,
                  })
                }
                placeholder="e.g., topic, length, tone"
                disabled={isEditingVariable}
              />
              <p className="text-xs text-gray-500">
                Use this name in your prompt with double curly braces: {"{{variable_name}}"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="variable-description">Description</Label>
              <Input
                id="variable-description"
                value={currentVariable?.description || ""}
                onChange={(e) =>
                  setCurrentVariable({
                    ...currentVariable!,
                    description: e.target.value,
                  })
                }
                placeholder="What this variable is for"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variable-default">Default Value</Label>
              <Input
                id="variable-default"
                value={currentVariable?.defaultValue || ""}
                onChange={(e) =>
                  setCurrentVariable({
                    ...currentVariable!,
                    defaultValue: e.target.value,
                  })
                }
                placeholder="Default value (optional)"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="variable-required"
                checked={currentVariable?.required || false}
                onCheckedChange={(checked) =>
                  setCurrentVariable({
                    ...currentVariable!,
                    required: checked,
                  })
                }
              />
              <Label htmlFor="variable-required" className="cursor-pointer">
                Required
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVariableDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveVariable} disabled={!currentVariable?.name}>
              {isEditingVariable ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save prompt dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Save className="h-5 w-5 mr-2 text-blue-500" />
              Save Prompt
            </DialogTitle>
            <DialogDescription>Save your prompt to your library for future use</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <Label htmlFor="save-name">Prompt Name</Label>
              <Input
                id="save-name"
                value={promptName}
                onChange={(e) => setPromptName(e.target.value)}
                placeholder="Enter a name for your prompt"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="save-description">Description</Label>
              <Textarea
                id="save-description"
                value={promptDescription}
                onChange={(e) => setPromptDescription(e.target.value)}
                placeholder="Describe what your prompt does"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-1 p-2 border rounded-md min-h-[40px]">
                {promptTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setPromptTags(promptTags.filter((_, i) => i !== index))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const input = e.currentTarget.elements.namedItem("tag") as HTMLInputElement
                    if (input.value && !promptTags.includes(input.value)) {
                      setPromptTags([...promptTags, input.value])
                      input.value = ""
                    }
                  }}
                  className="inline-flex"
                >
                  <Input name="tag" className="h-7 text-xs w-24 border-dashed" placeholder="Add tag..." />
                </form>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="save-favorite" defaultChecked={false} />
              <Label htmlFor="save-favorite" className="cursor-pointer">
                Add to favorites
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePrompt} disabled={!promptName || !promptText}>
              Save Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
              Prompt Templates
            </DialogTitle>
            <DialogDescription>Choose a template to quickly create a new prompt</DialogDescription>
          </DialogHeader>

          <div className="my-2">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-6">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                  <h3 className="text-sm font-medium mb-1">No templates found</h3>
                  <p className="text-xs text-gray-500">Try a different search term</p>
                </div>
              ) : (
                Object.entries(groupedTemplates).map(([category, templates]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center">
                      {getCategoryIcon(category)}
                      <h3 className="text-sm font-medium ml-2">{getCategoryLabel(category)}</h3>
                    </div>

                    <div className="space-y-2">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={cn(
                            "p-3 border rounded-md cursor-pointer transition-colors",
                            selectedTemplate?.id === template.id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800",
                          )}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-sm">{template.name}</div>
                            {selectedTemplate?.id === template.id && <Check className="h-4 w-4 text-blue-500" />}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{template.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {template.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyTemplate} disabled={!selectedTemplate}>
              Use Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
