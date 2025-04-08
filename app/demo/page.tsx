"use client"

import { Command } from "@/components/ui/command"

import { useState, useEffect } from "react"
import { FluxFloatingPanel } from "@/components/flux-floating-panel"
import { FluxAssistant } from "@/components/flux-assistant"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
// Update the import to use default import
import ChatInterface from "@/components/flow-state/chat-interface"
import {
  MessageSquare,
  Maximize2,
  PanelLeft,
  Moon,
  Sun,
  Laptop,
  Bug,
  Code,
  Settings,
  Info,
  Keyboard,
  Mic,
  Paperclip,
  Cpu,
  Database,
  Sparkles,
  BarChart2,
  ChevronLeft,
} from "lucide-react"
import { MetaSessionDebugger } from "@/components/flow-state/meta-session-debugger"
import { ConversationTreeVisualizer } from "@/components/flow-state/conversation-tree-visualizer"
import { Input } from "@/components/ui/input"
import {
  isGreetingToFlux,
  isGeneralGreeting,
  isGratitude,
  isFarewell,
  isAppQuestion,
  isAppRelatedQuery,
} from "@/components/flow-state/greeting-patterns"
import { detectIntent } from "@/components/flow-state/intent-patterns"
import { UserFeedbackSystem } from "@/components/flow-state/user-feedback-system"
import { FluxBranding } from "@/components/flow-state/flux-branding"
import { IntentDebugger } from "@/components/flow-state/intent-debugger"
import { AIModelSelector } from "@/components/flow-state/ai-model-selector"
import { AIModelConfiguration } from "@/components/flow-state/ai-model-configuration"
import { CodeGenerationAssistant } from "@/components/flow-state/code-generation-assistant"
import { CommandPaletteEnhanced } from "@/components/flow-state/command-palette-enhanced"
import { KnowledgeBaseIntegration } from "@/components/flow-state/knowledge-base-integration"
import { PromptEngineeringTool } from "@/components/flow-state/prompt-engineering-tool"
import { EnhancedAccessibilityPanel } from "@/components/flow-state/enhanced-accessibility-panel"
import { DataVisualizationDashboard } from "@/components/flow-state/data-visualization-dashboard"

export default function ChatDemo() {
  const [isFloatingPanelOpen, setIsFloatingPanelOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [demoView, setDemoView] = useState<"floating" | "embedded" | "assistant">("embedded")
  const [activeTab, setActiveTab] = useState<"demo" | "debug" | "settings" | "ai-tools">("demo")
  const [testMessage, setTestMessage] = useState("")
  const [matchResult, setMatchResult] = useState<string | null>(null)
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [activeAITool, setActiveAITool] = useState<
    "model-selector" | "model-config" | "code-gen" | "knowledge-base" | "prompt-engineering" | "analytics" | null
  >("model-selector")

  const [embeddedChatView, setEmbeddedChatView] = useState<"chat" | "settings">("chat")

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle theme changes using next-themes
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  // Handle AI model selection
  const handleModelSelect = (modelId: string, settings: any) => {
    console.log("Selected model:", modelId, "with settings:", settings)
    // In a real app, you would update your state or context with the selected model
  }

  const testMessageMatching = () => {
    if (!testMessage.trim()) {
      setMatchResult("Please enter a message to test")
      return
    }

    // Check for intent patterns first
    const { intent, confidence, confirmationMessage } = detectIntent(testMessage)
    if (intent && confidence > 0.3) {
      setMatchResult(`✅ Detected intent: "${intent}" with ${(confidence * 100).toFixed(1)}% confidence.
   Will respond with confirmation: "${confirmationMessage}"`)
      return
    }

    // Check other patterns
    if (isGreetingToFlux(testMessage)) {
      setMatchResult(
        "✅ Matches specific Flux greeting pattern: Will respond with 'Hello [name], welcome to the grid.'",
      )
    } else if (isGeneralGreeting(testMessage)) {
      setMatchResult("✅ Matches general greeting pattern: Will respond with a friendly greeting.")
    } else if (isGratitude(testMessage)) {
      setMatchResult("✅ Matches gratitude pattern: Will respond with 'You're welcome' or similar.")
    } else if (isFarewell(testMessage)) {
      setMatchResult("✅ Matches farewell pattern: Will respond with 'Goodbye' or similar.")
    } else if (isAppQuestion(testMessage)) {
      setMatchResult("✅ Matches app question pattern: Will respond with app information.")
    } else if (isAppRelatedQuery(testMessage)) {
      setMatchResult("✅ Matches general app-related query: Will use client-side response.")
    } else {
      setMatchResult("❌ No specific pattern match: Will use general conversation tree logic or LLM.")
    }
  }

  // Avoid rendering with server-side theme to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navbar */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <FluxBranding size="md" />
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "demo" | "debug" | "settings" | "ai-tools")}
          >
            <TabsList>
              <TabsTrigger value="demo" className="flex items-center">
                <Code className="h-4 w-4 mr-2" />
                Demo
              </TabsTrigger>
              <TabsTrigger value="ai-tools" className="flex items-center">
                <Cpu className="h-4 w-4 mr-2" />
                AI Tools
              </TabsTrigger>
              <TabsTrigger value="debug" className="flex items-center">
                <Bug className="h-4 w-4 mr-2" />
                Debug
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        {activeTab === "demo" && (
          <div>
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Assistant Chat Interface</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Experience our intelligent AI assistant with advanced conversation capabilities
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Panel */}
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Demo Controls</CardTitle>
                  <CardDescription>Configure the demo experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* View Mode */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">View Mode</h3>
                    <Tabs
                      defaultValue={demoView}
                      onValueChange={(v) => setDemoView(v as "floating" | "embedded" | "assistant")}
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="embedded">
                          <PanelLeft className="h-4 w-4 mr-2" />
                          Embedded
                        </TabsTrigger>
                        <TabsTrigger value="floating">
                          <Maximize2 className="h-4 w-4 mr-2" />
                          Floating
                        </TabsTrigger>
                        <TabsTrigger value="assistant">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Assistant
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Theme Selector */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Theme</h3>
                    <Tabs defaultValue={theme} onValueChange={handleThemeChange}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="light">
                          <Sun className="h-4 w-4 mr-2" />
                          Light
                        </TabsTrigger>
                        <TabsTrigger value="dark">
                          <Moon className="h-4 w-4 mr-2" />
                          Dark
                        </TabsTrigger>
                        <TabsTrigger value="system">
                          <Laptop className="h-4 w-4 mr-2" />
                          System
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Feature Showcase */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Feature Showcase</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={activeFeature === "command" ? "border-primary" : ""}
                        onClick={() => setIsCommandPaletteOpen(!isCommandPaletteOpen)}
                      >
                        <Command className="h-4 w-4 mr-2" />
                        Command Palette
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={activeFeature === "voice" ? "border-primary" : ""}
                        onClick={() => setActiveFeature(activeFeature === "voice" ? null : "voice")}
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        Voice Input
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={activeFeature === "file" ? "border-primary" : ""}
                        onClick={() => setActiveFeature(activeFeature === "file" ? null : "file")}
                      >
                        <Paperclip className="h-4 w-4 mr-2" />
                        File Attachment
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={activeFeature === "keyboard" ? "border-primary" : ""}
                        onClick={() => setActiveFeature(activeFeature === "keyboard" ? null : "keyboard")}
                      >
                        <Keyboard className="h-4 w-4 mr-2" />
                        Keyboard Shortcuts
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={activeFeature === "accessibility" ? "border-primary" : ""}
                        onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Accessibility
                      </Button>
                    </div>
                  </div>

                  {/* Feature Toggles */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Features</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="markdown" className="cursor-pointer">
                        Markdown Support
                      </Label>
                      <Switch id="markdown" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="voice" className="cursor-pointer">
                        Voice Input
                      </Label>
                      <Switch id="voice" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emoji" className="cursor-pointer">
                        Emoji Picker
                      </Label>
                      <Switch id="emoji" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reactions" className="cursor-pointer">
                        Message Reactions
                      </Label>
                      <Switch id="reactions" defaultChecked />
                    </div>
                  </div>

                  {/* Floating Panel Controls */}
                  {demoView === "floating" && (
                    <div className="pt-4">
                      <Button onClick={() => setIsFloatingPanelOpen(!isFloatingPanelOpen)} className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {isFloatingPanelOpen ? "Close Chat Panel" : "Open Chat Panel"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chat Interface */}
              {demoView === "embedded" && (
                <div className="lg:col-span-8">
                  <Card className="h-[600px] overflow-hidden">
                    <CardHeader className="sr-only">
                      Chat Module
                    </CardHeader>
                    <CardContent className="p-0 h-[calc(100%-73px)]">
                      <ChatInterface className="flex-1" setEmbeddedChatView={setEmbeddedChatView} />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Floating Panel */}
              {demoView === "floating" && isFloatingPanelOpen && (
                <FluxFloatingPanel isOpen={isFloatingPanelOpen} onClose={() => setIsFloatingPanelOpen(false)} />
              )}

              {/* Assistant Mode */}
              {demoView === "assistant" && <FluxAssistant />}

              {/* Feature Description */}
              <Card className={demoView === "embedded" ? "lg:col-span-12" : "lg:col-span-8"}>
                <CardHeader>
                  <CardTitle>
                    {activeFeature === "command" && "Command Palette"}
                    {activeFeature === "voice" && "Voice Input"}
                    {activeFeature === "file" && "File Attachment"}
                    {activeFeature === "keyboard" && "Keyboard Shortcuts"}
                    {activeFeature === "accessibility" && "Accessibility Features"}
                    {!activeFeature && "How to Use This Demo"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeFeature === "command" && (
                    <div>
                      <p className="mb-4">
                        The Command Palette provides quick access to all available actions in the chat interface. Press{" "}
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">/</kbd> to open it.
                      </p>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Available Commands:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mr-2 text-sm">/help</span>{" "}
                            Show help information
                          </li>
                          <li className="flex items-center">
                            <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mr-2 text-sm">/clear</span>{" "}
                            Clear conversation
                          </li>
                          <li className="flex items-center">
                            <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mr-2 text-sm">/voice</span>{" "}
                            Start voice input
                          </li>
                          <li className="flex items-center">
                            <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mr-2 text-sm">/file</span>{" "}
                            Attach a file
                          </li>
                          <li className="flex items-center">
                            <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mr-2 text-sm">
                              /settings
                            </span>{" "}
                            Open settings
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeFeature === "voice" && (
                    <div>
                      <p className="mb-4">
                        Voice Input allows you to speak your messages instead of typing them. Click the microphone icon
                        or press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Ctrl+Shift+V</kbd> to
                        start.
                      </p>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Voice Commands:</h4>
                        <ul className="space-y-2">
                          <li>"Send message" - Sends the current transcription</li>
                          <li>"Clear input" - Clears the current transcription</li>
                          <li>"Stop listening" - Ends the voice input session</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeFeature === "file" && (
                    <div>
                      <p className="mb-4">
                        File Attachment allows you to share files with the AI assistant for analysis or reference. Click
                        the paperclip icon to attach files.
                      </p>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Supported File Types:</h4>
                        <ul className="space-y-2">
                          <li>Images (.jpg, .png, .gif)</li>
                          <li>Documents (.pdf, .docx, .txt)</li>
                          <li>Code files (.js, .py, .html, etc.)</li>
                          <li>Data files (.csv, .json)</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeFeature === "keyboard" && (
                    <div>
                      <p className="mb-4">
                        Keyboard shortcuts provide quick access to common actions without using the mouse.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Ctrl + Enter</kbd>
                          <span>Send message</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Esc</kbd>
                          <span>Clear input</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">↑</kbd>
                          <span>Edit last message</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">/</kbd>
                          <span>Open command palette</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Ctrl + Shift + V</kbd>
                          <span>Voice input</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Ctrl + Shift + F</kbd>
                          <span>Attach file</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature === "accessibility" && (
                    <div>
                      <p className="mb-4">
                        Accessibility features make the chat interface usable for everyone, including people with
                        disabilities.
                      </p>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Key Accessibility Features:</h4>
                        <ul className="space-y-2">
                          <li>Screen reader compatibility with ARIA labels</li>
                          <li>Keyboard navigation for all interface elements</li>
                          <li>High contrast mode for visual impairments</li>
                          <li>Text size adjustment options</li>
                          <li>Voice commands for hands-free operation</li>
                          <li>Focus indicators for keyboard navigation</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {!activeFeature && (
                    <div>
                      <div>
                        <h3 className="font-medium mb-2">Key Features</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Ask the AI assistant questions and receive intelligent responses</li>
                          <li>Edit your messages to clarify your requests</li>
                          <li>Rate the assistant's responses with thumbs up/down</li>
                          <li>View code examples with syntax highlighting</li>
                          <li>Use keyboard shortcuts for faster interaction</li>
                          <li>Choose between light and dark mode</li>
                          <li>Access the assistant in embedded, floating panel, or assistant mode</li>
                        </ul>
                      </div>

                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Ctrl + Enter</kbd>
                            <span>Send message</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Esc</kbd>
                            <span>Clear input</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">↑</kbd>
                            <span>Edit last message</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">/</kbd>
                            <span>Open command palette</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "ai-tools" && (
          <div>
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Advanced AI Tools</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore and configure advanced AI capabilities for your chat experience
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* AI Tools Navigation */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>AI Tools</CardTitle>
                  <CardDescription>Select a tool to configure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={activeAITool === "model-selector" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveAITool("model-selector")}
                  >
                    <Cpu className="h-4 w-4 mr-2" />
                    AI Model Selector
                  </Button>
                  <Button
                    variant={activeAITool === "model-config" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveAITool("model-config")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Model Configuration
                  </Button>
                  <Button
                    variant={activeAITool === "code-gen" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveAITool("code-gen")}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Code Generation
                  </Button>
                  <Button
                    variant={activeAITool === "knowledge-base" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveAITool("knowledge-base")}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Knowledge Base
                  </Button>
                  <Button
                    variant={activeAITool === "prompt-engineering" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveAITool("prompt-engineering")}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Prompt Engineering
                  </Button>
                  <Button
                    variant={activeAITool === "analytics" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveAITool("analytics")}
                  >
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* AI Tool Content */}
              <div className="lg:col-span-9">
                {activeAITool === "model-selector" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Cpu className="h-5 w-5 mr-2 text-primary" />
                        AI Model Selector
                      </CardTitle>
                      <CardDescription>
                        Choose from a variety of AI models with different capabilities and performance characteristics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AIModelSelector onModelSelect={handleModelSelect} initialModelId="gpt-4" />
                    </CardContent>
                  </Card>
                )}

                {activeAITool === "model-config" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-primary" />
                        AI Model Configuration
                      </CardTitle>
                      <CardDescription>
                        Fine-tune model parameters and create presets for different use cases
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AIModelConfiguration />
                    </CardContent>
                  </Card>
                )}

                {activeAITool === "code-gen" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Code className="h-5 w-5 mr-2 text-primary" />
                        Code Generation Assistant
                      </CardTitle>
                      <CardDescription>
                        Generate code snippets, components, and functions with AI assistance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeGenerationAssistant />
                    </CardContent>
                  </Card>
                )}

                {activeAITool === "knowledge-base" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Database className="h-5 w-5 mr-2 text-primary" />
                        Knowledge Base Integration
                      </CardTitle>
                      <CardDescription>
                        Connect and manage your knowledge sources for enhanced AI responses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <KnowledgeBaseIntegration />
                    </CardContent>
                  </Card>
                )}

                {activeAITool === "prompt-engineering" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-primary" />
                        Prompt Engineering Tool
                      </CardTitle>
                      <CardDescription>Create, test, and manage prompts for optimal AI performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PromptEngineeringTool
                        onSavePrompt={(prompt) => {
                          console.log("Saving prompt:", prompt)
                        }}
                        onTestPrompt={async (prompt, variables) => {
                          console.log("Testing prompt:", prompt, variables)
                          await new Promise((resolve) => setTimeout(resolve, 500))
                          return "This is a test result"
                        }}
                      />
                    </CardContent>
                  </Card>
                )}

                {activeAITool === "analytics" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                        Analytics & Insights
                      </CardTitle>
                      <CardDescription>
                        Track usage, performance, and trends to optimize your AI experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DataVisualizationDashboard />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "debug" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle>Pattern Matching Debugger</CardTitle>
                <CardDescription>Test message pattern matching</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a test message..."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={testMessageMatching}>Test</Button>
                </div>
                {matchResult && (
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md whitespace-pre-wrap font-mono text-sm">
                    {matchResult}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle>Intent Debugger</CardTitle>
                <CardDescription>View detected intents</CardDescription>
              </CardHeader>
              <CardContent>
                <IntentDebugger />
              </CardContent>
            </Card>

            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle>Session Debugger</CardTitle>
                <CardDescription>View session state</CardDescription>
              </CardHeader>
              <CardContent>
                <MetaSessionDebugger />
              </CardContent>
            </Card>

            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle>Conversation Tree</CardTitle>
                <CardDescription>Visualize conversation flow</CardDescription>
              </CardHeader>
              <CardContent>
                <ConversationTreeVisualizer />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Theme</h3>
                  <Tabs defaultValue={theme} onValueChange={handleThemeChange}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="light">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </TabsTrigger>
                      <TabsTrigger value="dark">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </TabsTrigger>
                      <TabsTrigger value="system">
                        <Laptop className="h-4 w-4 mr-2" />
                        System
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Font Size</h3>
                  <Tabs defaultValue="medium">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="small">Small</TabsTrigger>
                      <TabsTrigger value="medium">Medium</TabsTrigger>
                      <TabsTrigger value="large">Large</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Message Density</h3>
                  <Tabs defaultValue="comfortable">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="compact">Compact</TabsTrigger>
                      <TabsTrigger value="comfortable">Comfortable</TabsTrigger>
                      <TabsTrigger value="spacious">Spacious</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle>Accessibility</CardTitle>
                <CardDescription>Configure accessibility settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <EnhancedAccessibilityPanel isOpen={showAccessibilityPanel} onClose={() => setShowAccessibilityPanel(false)} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* User feedback system */}
      <UserFeedbackSystem />
      {/* Command Palette */}
      {isCommandPaletteOpen && (
        <CommandPaletteEnhanced
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelect={(command) => console.log(`Selected command: ${command}`)}
        />
      )}
      {isFloatingPanelOpen && (
        <FluxFloatingPanel isOpen={isFloatingPanelOpen} onClose={() => setIsFloatingPanelOpen(false)} />
      )}
    </div>
  )
}
