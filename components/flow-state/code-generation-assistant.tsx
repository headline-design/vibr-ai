"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Check, Code, Copy, Download, FileCode, Layers, Sparkles, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CodeSnippet {
  id: string
  language: string
  code: string
  description: string
  timestamp: Date
}

export function CodeGenerationAssistant() {
  const [prompt, setPrompt] = useState("")
  const [language, setLanguage] = useState("typescript")
  const [framework, setFramework] = useState("react")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [savedSnippets, setSavedSnippets] = useState<CodeSnippet[]>([
    {
      id: "1",
      language: "typescript",
      code: "const fetchData = async () => {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error fetching data:', error);\n    return null;\n  }\n};",
      description: "Fetch data from API with error handling",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      language: "typescript",
      code: "interface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\nfunction formatUser(user: User) {\n  return {\n    ...user,\n    displayName: user.name.toUpperCase()\n  };\n}",
      description: "TypeScript interface with formatter function",
      timestamp: new Date(Date.now() - 172800000),
    },
  ])
  const [complexity, setComplexity] = useState(50)
  const [includeComments, setIncludeComments] = useState(true)
  const [includeTests, setIncludeTests] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")

  const handleGenerate = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate code generation with a delay
    setTimeout(() => {
      const sampleCode = `// Generated ${language} code for ${framework}
// Based on prompt: ${prompt}
${language === "typescript" ? "import React from 'react';\n" : ""}
${language === "typescript" ? "interface Props {\n  title: string;\n  items: string[];\n}\n" : ""}
${
  framework === "react"
    ? language === "typescript"
      ? 'export const DynamicList: React.FC<Props> = ({ title, items }) => {\n  return (\n    <div className="dynamic-list">\n      <h2>{title}</h2>\n      <ul>\n        {items.map((item, index) => (\n          <li key={index}>{item}</li>\n        ))}\n      </ul>\n    </div>\n  );\n};'
      : 'function DynamicList({ title, items }) {\n  return (\n    <div className="dynamic-list">\n      <h2>{title}</h2>\n      <ul>\n        {items.map((item, index) => (\n          <li key={index}>{item}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nexport default DynamicList;'
    : 'console.log("Generated code would appear here");'
}

${includeTests ? '\n// Test case\nimport { render, screen } from \'@testing-library/react\';\n\ntest(\'renders list items\', () => {\n  render(<DynamicList title="Test List" items={["Item 1", "Item 2"]} />);\n  expect(screen.getByText("Test List")).toBeInTheDocument();\n  expect(screen.getByText("Item 1")).toBeInTheDocument();\n  expect(screen.getByText("Item 2")).toBeInTheDocument();\n});' : ""}`

      setGeneratedCode(sampleCode)
      setIsGenerating(false)
    }, 1500)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    const newSnippet: CodeSnippet = {
      id: Date.now().toString(),
      language,
      code: generatedCode,
      description: prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt,
      timestamp: new Date(),
    }

    setSavedSnippets([newSnippet, ...savedSnippets])
    setActiveTab("saved")
  }

  const handleDownload = () => {
    const extension = language === "typescript" ? ".tsx" : ".js"
    const filename = `generated-code-${Date.now()}${extension}`
    const blob = new Blob([generatedCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card className="w-full max-w-4xl shadow-lg ">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6" />
            <CardTitle>Code Generation Assistant</CardTitle>
          </div>
          <Badge variant="outline" className="bg-white/10 text-white border-white/20">
            Beta
          </Badge>
        </div>
        <CardDescription className="text-white/80">
          Generate code snippets, components, and functions with AI assistance
        </CardDescription>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mx-6 my-2">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Saved Snippets
          </TabsTrigger>
        </TabsList>
        <CardContent className="p-6 pt-2">
          <TabsContent value="generate" className="space-y-4 mt-0">
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt" className="text-sm font-medium">
                  Describe what code you need
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., Create a React component that displays a list of items with pagination"
                  className="mt-1.5 min-h-[100px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="language" className="text-sm font-medium">
                    Language
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="framework" className="text-sm font-medium">
                    Framework
                  </Label>
                  <Select value={framework} onValueChange={setFramework}>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="vue">Vue</SelectItem>
                      <SelectItem value="angular">Angular</SelectItem>
                      <SelectItem value="svelte">Svelte</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <Label htmlFor="complexity" className="text-sm font-medium">
                      Complexity
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {complexity < 33 ? "Simple" : complexity < 66 ? "Moderate" : "Complex"}
                    </span>
                  </div>
                  <Slider
                    id="complexity"
                    min={0}
                    max={100}
                    step={1}
                    value={[complexity]}
                    onValueChange={(value) => setComplexity(value[0])}
                    className="py-1"
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="comments" checked={includeComments} onCheckedChange={setIncludeComments} />
                    <Label htmlFor="comments" className="text-sm">
                      Include comments
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="tests" checked={includeTests} onCheckedChange={setIncludeTests} />
                    <Label htmlFor="tests" className="text-sm">
                      Include tests
                    </Label>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Generate Code
                  </div>
                )}
              </Button>

              {generatedCode && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Generated Code</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 gap-1">
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleSave} className="h-8 gap-1">
                        <FileCode className="h-3.5 w-3.5" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload} className="h-8 gap-1">
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-md overflow-x-auto text-sm">
                      <code>{generatedCode}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Your Saved Code Snippets</h3>
                <Input placeholder="Search snippets..." className="max-w-xs h-8 text-sm" />
              </div>

              <ScrollArea className="h-[400px] rounded-md border">
                {savedSnippets.length > 0 ? (
                  <div className="space-y-2 p-4">
                    {savedSnippets.map((snippet) => (
                      <div key={snippet.id} className="border rounded-md p-3 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {snippet.language}
                            </Badge>
                            <span className="text-sm font-medium">{snippet.description}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDate(snippet.timestamp)}</span>
                        </div>
                        <div className="bg-zinc-950 text-zinc-100 p-3 rounded-md overflow-x-auto text-xs">
                          <pre>
                            <code>
                              {snippet.code.length > 150 ? snippet.code.substring(0, 150) + "..." : snippet.code}
                            </code>
                          </pre>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(snippet.code)
                            }}
                            className="h-7 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setGeneratedCode(snippet.code)
                              setActiveTab("generate")
                            }}
                            className="h-7 text-xs"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <FileCode className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No saved snippets yet</p>
                    <Button variant="link" onClick={() => setActiveTab("generate")} className="mt-2">
                      Generate your first snippet
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      <CardFooter className="bg-muted/50 px-6 py-4 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">Powered by Vibr AI Code Generation</div>
        <Button variant="link" size="sm" className="text-xs h-auto p-0">
          View documentation
        </Button>
      </CardFooter>
    </Card>
  )
}
