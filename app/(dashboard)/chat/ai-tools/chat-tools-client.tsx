"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Settings, Cpu, Database, Sparkles, BarChart2 } from "lucide-react"
import { AIModelSelector } from "@/components/flow-state/ai-model-selector"
import { AIModelConfiguration } from "@/components/flow-state/ai-model-configuration"
import { CodeGenerationAssistant } from "@/components/flow-state/code-generation-assistant"
import { KnowledgeBaseIntegration } from "@/components/flow-state/knowledge-base-integration"
import { PromptEngineeringTool } from "@/components/flow-state/prompt-engineering-tool"
import { DataVisualizationDashboard } from "@/components/flow-state/data-visualization-dashboard"
import { useDemoState } from "@/components/flow-state/providers/demo-state-provider"
import { useTheme } from "next-themes"

export default function ChatToolsClient() {
  const { theme, setTheme } = useTheme()

  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    demoView,
    setDemoView,
    isFloatingPanelOpen,
    setIsFloatingPanelOpen,
  } = useDemoState()

  const [activeAITool, setActiveAITool] = useState<
    "model-selector" | "model-config" | "code-gen" | "knowledge-base" | "prompt-engineering" | "analytics" | null
  >("model-selector")

  // Handle AI model selection
  const handleModelSelect = (modelId: string, settings: any) => {
    console.log("Selected model:", modelId, "with settings:", settings)
    // In a real app, you would update your state or context with the selected model
  }

  return (


    <>
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
          <CodeGenerationAssistant />
        )}

        {activeAITool === "knowledge-base" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-primary" />
                Knowledge Base Integration
              </CardTitle>
              <CardDescription>Connect and manage your knowledge sources for enhanced AI responses</CardDescription>
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
              <CardDescription>Track usage, performance, and trends to optimize your AI experience</CardDescription>
            </CardHeader>
            <CardContent>
              <DataVisualizationDashboard />
            </CardContent>
          </Card>
        )}
      </div>
    </>

  )
}
