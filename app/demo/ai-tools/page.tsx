import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIModelSelector } from "@/components/flow-state/ai-model-selector"
import { AIModelConfiguration } from "@/components/flow-state/ai-model-configuration"
import { CodeGenerationAssistant } from "@/components/flow-state/code-generation-assistant"

export default function AIToolsPage() {
  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Tools</h1>
          <p className="text-muted-foreground mt-2">Advanced AI capabilities for the Vibr chat interface</p>
        </div>

        <Tabs defaultValue="model-selector" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="model-selector">AI Model Selector</TabsTrigger>
            <TabsTrigger value="model-configuration">AI Model Configuration</TabsTrigger>
            <TabsTrigger value="code-generation">Code Generation</TabsTrigger>
          </TabsList>

          <TabsContent value="model-selector" className="space-y-4">
            <AIModelSelector
              onModelSelect={(modelId, settings) => {
                console.log("Selected model:", modelId, settings)
              }}
            />
          </TabsContent>

          <TabsContent value="model-configuration" className="space-y-4">
            <AIModelConfiguration />
          </TabsContent>

          <TabsContent value="code-generation" className="space-y-4">
            <CodeGenerationAssistant />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
