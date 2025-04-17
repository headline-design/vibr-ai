"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Palette, Type, Ruler, Square, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

export function DesignSystemShowcase() {
  const [activeTab, setActiveTab] = useState("colors")
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  const getTabDetails = (tab: string) => {
    switch (tab) {
      case "colors":
        return {
          title: "Colors",
          description: "Explore the primary, neutral, and semantic color palettes used in the design system."
        }
      case "typography":
        return {
          title: "Typography",
          description: "View the font families, sizes, weights, and styles used across the application."
        }
      case "spacing":
        return {
          title: "Spacing",
          description: "Understand the spacing scale and how to apply consistent margins and paddings."
        }
      case "components":
        return {
          title: "Components",
          description: "See examples of reusable UI components like buttons, inputs, and badges."
        }
      default:
        return { title: "", description: "" }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{getTabDetails(activeTab).title || "Design System Showcase"}</CardTitle>
        <CardDescription>{getTabDetails(activeTab).description || "Explore the components and design principles of our system."}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid h-auto grid-cols-2 sm:grid-cols-4 mb-6">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4 hidden md:block" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="h-4 w-4 hidden md:block" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-2">
              <Ruler className="h-4 w-4  hidden md:block" />
              Spacing
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Square className="h-4 w-4 hidden md:block" />
              Components
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Primary Colors</h3>
              <div className="grid grid-cols-5 gap-4">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => (
                  <div key={weight} className="space-y-1.5">
                    <div
                      className={`h-12 rounded-md bg-primary-${weight} flex items-end p-2`}
                      onClick={() => copyToClipboard(`bg-primary-${weight}`)}
                    >
                      {copied === `bg-primary-${weight}` && (
                        <Badge variant="outline" className="bg-white text-xs">
                          Copied!
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">{weight}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(`bg-primary-${weight}`)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Neutral Colors</h3>
              <div className="grid grid-cols-5 gap-4">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => (
                  <div key={weight} className="space-y-1.5">
                    <div
                      className={`h-12 rounded-md bg-neutral-${weight} flex items-end p-2`}
                      onClick={() => copyToClipboard(`bg-neutral-${weight}`)}
                    >
                      {copied === `bg-neutral-${weight}` && (
                        <Badge variant="outline" className="bg-white text-xs">
                          Copied!
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">{weight}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(`bg-neutral-${weight}`)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Semantic Colors</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { name: "success", icon: <CheckCircle className="h-4 w-4" /> },
                  { name: "warning", icon: <AlertTriangle className="h-4 w-4" /> },
                  { name: "error", icon: <AlertCircle className="h-4 w-4" /> },
                  { name: "info", icon: <Info className="h-4 w-4" /> },
                ].map((color) => (
                  <div key={color.name} className="space-y-1.5">
                    <div
                      className={`h-12 rounded-md bg-${color.name} flex items-end p-2 text-${color.name}-foreground`}
                      onClick={() => copyToClipboard(`bg-${color.name}`)}
                    >
                      <div className="flex items-center gap-1">
                        {color.icon}
                        <span className="text-xs font-medium capitalize">{color.name}</span>
                      </div>
                    </div>
                    <div
                      className={`h-8 rounded-md bg-${color.name}-light flex items-center justify-center`}
                      onClick={() => copyToClipboard(`bg-${color.name}-light`)}
                    >
                      <span className="text-xs font-medium">{color.name}-light</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Font Family</h3>
              <div className="font-showcase">
                <div className="font-showcase-title">Geist Sans</div>
                <p className="font-showcase-sample">The quick brown fox jumps over the lazy dog. 1234567890</p>
                <p className="font-showcase-details">Primary font for all UI elements and text content</p>
              </div>
              <div className="font-showcase">
                <div className="font-showcase-title">Monospace</div>
                <p className="font-showcase-sample font-mono">
                  The quick brown fox jumps over the lazy dog. 1234567890
                </p>
                <p className="font-showcase-details">Used for code blocks and technical content</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Headings</h3>
              <div className="space-y-4 border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <h1>Heading 1</h1>
                  <Badge variant="outline" className="text-xs">
                    text-4xl font-bold
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <h2>Heading 2</h2>
                  <Badge variant="outline" className="text-xs">
                    text-3xl font-semibold
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <h3>Heading 3</h3>
                  <Badge variant="outline" className="text-xs">
                    text-2xl font-semibold
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <h4>Heading 4</h4>
                  <Badge variant="outline" className="text-xs">
                    text-xl font-semibold
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <h5>Heading 5</h5>
                  <Badge variant="outline" className="text-xs">
                    text-lg font-medium
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <h6>Heading 6</h6>
                  <Badge variant="outline" className="text-xs">
                    text-base font-medium
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Body Text</h3>
              <div className="space-y-4 border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <p className="body-text">Body Text</p>
                  <Badge variant="outline" className="text-xs">
                    text-base font-normal
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="body-sm">Body Small</p>
                  <Badge variant="outline" className="text-xs">
                    text-sm font-normal
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="caption">Caption</p>
                  <Badge variant="outline" className="text-xs">
                    text-sm font-medium text-muted-foreground
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="caption-sm">Caption Small</p>
                  <Badge variant="outline" className="text-xs">
                    text-xs font-medium text-muted-foreground
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Font Weights</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { name: "Normal", weight: "font-normal", value: "400" },
                  { name: "Medium", weight: "font-medium", value: "500" },
                  { name: "Semibold", weight: "font-semibold", value: "600" },
                  { name: "Bold", weight: "font-bold", value: "700" },
                ].map((font) => (
                  <div key={font.weight} className="font-weight-sample">
                    <p className={font.weight}>{font.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {font.weight} ({font.value})
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Letter Spacing</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "Tighter", class: "tracking-tighter", value: "-0.05em" },
                  { name: "Tight", class: "tracking-tight", value: "-0.025em" },
                  { name: "Normal", class: "tracking-normal", value: "0" },
                  { name: "Wide", class: "tracking-wide", value: "0.025em" },
                  { name: "Wider", class: "tracking-wider", value: "0.05em" },
                  { name: "Widest", class: "tracking-widest", value: "0.1em" },
                ].map((spacing) => (
                  <div key={spacing.class} className="border rounded-md p-3">
                    <p className={`${spacing.class} text-base`}>The quick brown fox</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {spacing.class} ({spacing.value})
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Line Heights</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Tight", class: "leading-tight", value: "1.2" },
                  { name: "Snug", class: "leading-snug", value: "1.375" },
                  { name: "Normal", class: "leading-normal", value: "1.5" },
                  { name: "Relaxed", class: "leading-relaxed", value: "1.625" },
                  { name: "Loose", class: "leading-loose", value: "2" },
                ].map((leading) => (
                  <div key={leading.class} className="border rounded-md p-3">
                    <p className={`${leading.class} text-base`}>
                      The quick brown fox jumps over the lazy dog. This text demonstrates the line height with multiple
                      lines of content to show spacing between lines.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {leading.class} ({leading.value})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Spacing Tab */}
          <TabsContent value="spacing" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Spacing Scale</h3>
              <div className="space-y-4 border rounded-md p-4">
                {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32].map((space) => (
                  <div key={space} className="flex items-center gap-4">
                    <div
                      className={`h-6 bg-primary-200 dark:bg-primary-800`}
                      style={{ width: `${space * 0.25}rem` }}
                    ></div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {space}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {space * 0.25}rem ({space * 4}px)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Border Radius</h3>
              <div className="grid grid-cols-5 gap-4">
                {[
                  { name: "none", value: "0" },
                  { name: "sm", value: "0.25rem" },
                  { name: "md", value: "0.375rem" },
                  { name: "lg", value: "0.5rem" },
                  { name: "xl", value: "0.75rem" },
                  { name: "2xl", value: "1rem" },
                  { name: "3xl", value: "1.5rem" },
                  { name: "full", value: "9999px" },
                ].map((radius) => (
                  <div key={radius.name} className="space-y-2">
                    <div
                      className={`h-16 w-16 bg-primary-200 dark:bg-primary-800 rounded-${radius.name === "none" ? "" : radius.name}`}
                    ></div>
                    <div className="text-xs font-medium">rounded-{radius.name}</div>
                    <div className="text-xs text-muted-foreground">{radius.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Buttons</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Button>Default</Button>
                  <p className="text-xs text-muted-foreground">Primary action</p>
                </div>
                <div className="space-y-2">
                  <Button variant="secondary">Secondary</Button>
                  <p className="text-xs text-muted-foreground">Secondary action</p>
                </div>
                <div className="space-y-2">
                  <Button variant="outline">Outline</Button>
                  <p className="text-xs text-muted-foreground">Subtle action</p>
                </div>
                <div className="space-y-2">
                  <Button variant="ghost">Ghost</Button>
                  <p className="text-xs text-muted-foreground">Minimal emphasis</p>
                </div>
                <div className="space-y-2">
                  <Button variant="destructive">Destructive</Button>
                  <p className="text-xs text-muted-foreground">Dangerous action</p>
                </div>
                <div className="space-y-2">
                  <Button variant="link">Link</Button>
                  <p className="text-xs text-muted-foreground">Navigational</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Form Elements</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Badges</h3>
              <div className="flex flex-wrap gap-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-success text-success-foreground">Success</Badge>
                <Badge className="bg-warning text-warning-foreground">Warning</Badge>
                <Badge className="bg-info text-info-foreground">Info</Badge>
                <Badge className="bg-error text-error-foreground">Error</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Status Indicators</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="status-dot online"></div>
                  <span className="text-sm">Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="status-dot away"></div>
                  <span className="text-sm">Away</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="status-dot offline"></div>
                  <span className="text-sm">Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="status-dot error"></div>
                  <span className="text-sm">Error</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
