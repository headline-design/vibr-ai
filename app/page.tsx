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
} from "lucide-react"
import { useDemoState } from "@/components/flow-state/demo-state-provider"

export default function ChatDemo() {

  const { theme, setTheme } = useTheme()

  const { isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    demoView,
    setDemoView,
    isFloatingPanelOpen,
    setIsFloatingPanelOpen } = useDemoState();

  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false)

  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [activeAITool, setActiveAITool] = useState<
    "model-selector" | "model-config" | "code-gen" | "knowledge-base" | "prompt-engineering" | "analytics" | null
  >("model-selector")

  const [embeddedChatView, setEmbeddedChatView] = useState<"chat" | "settings">("chat")

  // Handle theme changes using next-themes
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }


  return (
    <>
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
    </>
  )
}
