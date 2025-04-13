"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowRight, X, Check, ExternalLink } from "lucide-react"
import {
  NextJsIcon,
  GrokIcon,
  SupabaseIcon,
  V0Icon,
  VercelIcon,
  OpenAiIcon,
  CursorIcon,
  TailwindIcon,
} from "../integration-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionReveal } from "@/components/home/section-reveal"

// Define the integration type
type Integration = {
  id: string
  name: string
  description: string
  longDescription?: string
  category: string
  featured: boolean
  new?: boolean
  popular?: boolean
  icon: React.ComponentType<{ className?: string }>
  benefits?: string[]
  documentation?: string
}

export function IntegrationsSection() {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [filteredIntegrations, setFilteredIntegrations] = useState<Integration[]>([])
  const [hoveredIntegration, setHoveredIntegration] = useState<string | null>(null)

  // Enhanced integrations data
  const integrations: Integration[] = [
    {
      id: "nextjs",
      name: "Next.js",
      description: "React framework with App Router support",
      longDescription:
        "Build full-stack web applications with the power of React Server Components and the App Router.",
      category: "framework",
      featured: false,
      popular: true,
      icon: NextJsIcon,
      benefits: ["Server Components", "File-based routing", "API Routes", "Image Optimization"],
      documentation: "https://nextjs.org/docs",
    },
    {
      id: "vercel",
      name: "Vercel",
      description: "Optimized for Vercel deployment and Edge Functions",
      longDescription: "Deploy instantly with zero configuration on Vercel's global edge network.",
      category: "platform",
      featured: true,
      icon: VercelIcon,
      benefits: ["Global Edge Network", "Serverless Functions", "Analytics", "Preview Deployments"],
      documentation: "https://vercel.com/docs",
    },
    {
      id: "supabase",
      name: "Supabase",
      description: "Deep integration with Supabase Auth and Database",
      longDescription: "Open source Firebase alternative with authentication, database, and storage solutions.",
      category: "database",
      featured: true,
      icon: SupabaseIcon,
      benefits: ["PostgreSQL Database", "Authentication", "Storage", "Realtime Subscriptions"],
      documentation: "https://supabase.com/docs",
    },
    {
      id: "openai",
      name: "OpenAI",
      description: "Leverages OpenAI's advanced language models",
      longDescription: "Integrate state-of-the-art AI models for natural language processing and generation.",
      category: "ai",
      featured: true,
      popular: true,
      icon: OpenAiIcon,
      benefits: ["GPT-4", "Text Generation", "Embeddings", "Function Calling"],
      documentation: "https://platform.openai.com/docs",
    },
    {
      id: "cursor",
      name: "Cursor",
      description: "Enhanced coding experience with Cursor integration",
      longDescription: "AI-powered code editor designed for pair programming with artificial intelligence.",
      category: "editor",
      featured: false,
      new: true,
      icon: CursorIcon,
      benefits: ["AI Code Completion", "Code Explanation", "Refactoring", "Chat Interface"],
      documentation: "https://cursor.sh/docs",
    },
    {
      id: "v0",
      name: "V0",
      description: "Generative AI platform for building apps",
      longDescription: "Create and deploy AI-powered applications with minimal coding required.",
      category: "ai",
      featured: false,
      new: true,
      icon: V0Icon,
      benefits: ["No-code AI", "Custom Models", "API Access", "Deployment Options"],
      documentation: "https://v0.dev/docs",
    },
    {
      id: "tailwind",
      name: "Tailwind CSS",
      description: "Beautiful UI with Tailwind CSS",
      longDescription: "Utility-first CSS framework for rapidly building custom user interfaces.",
      category: "styling",
      featured: false,
      popular: true,
      icon: TailwindIcon,
      benefits: ["Utility-first", "Responsive Design", "Dark Mode", "Custom Theming"],
      documentation: "https://tailwindcss.com/docs",
    },
    {
      id: "grok",
      name: "Grok",
      description: "AI-powered code assistant for developers",
      longDescription: "Advanced AI assistant that helps developers write, understand, and debug code faster.",
      category: "ai",
      featured: true,
      new: true,
      icon: GrokIcon,
      benefits: ["Code Generation", "Debugging", "Documentation", "Learning Resources"],
      documentation: "https://grok.ai/docs",
    },
  ]

  // Get unique categories for tabs
  const categories = ["all", "ai", "platform", "developer"]

  // Filter integrations based on search query and active category
  useEffect(() => {
    let filtered = integrations

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (integration) =>
          integration.name.toLowerCase().includes(query) ||
          integration.description.toLowerCase().includes(query) ||
          integration.category.toLowerCase().includes(query),
      )
    }

    // Filter by category
    if (activeCategory !== "all") {
      if (activeCategory === "developer") {
        // Group framework, styling, and editor under "developer"
        filtered = filtered.filter(
          (integration) =>
            integration.category === "framework" ||
            integration.category === "styling" ||
            integration.category === "editor",
        )
      } else {
        filtered = filtered.filter((integration) => integration.category === activeCategory)
      }
    }

    setFilteredIntegrations(filtered)
  }, [searchQuery, activeCategory])

  // Separate featured and non-featured integrations
  const featuredIntegrations = filteredIntegrations.filter((integration) => integration.featured)
  const otherIntegrations = filteredIntegrations.filter((integration) => !integration.featured)

  return (
    <section id="integrations" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <SectionReveal className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
            Powerful Integrations
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Seamlessly connect with the tools you already love and use
          </p>
        </SectionReveal>

        {/* Search and filter */}
        <SectionReveal className="mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between" delay={0.2}>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search integrations..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-4 gap-1">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </SectionReveal>

        {/* Featured Integrations */}
        <AnimatePresence mode="wait">
          {featuredIntegrations.length > 0 && (
            <SectionReveal key="featured" delay={0.3}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Featured Integrations</h3>
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {featuredIntegrations.map((integration, index) => (
                  <SectionReveal key={integration.id} className="relative group" delay={0.3 + index * 0.1}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      onHoverStart={() => setHoveredIntegration(integration.id)}
                      onHoverEnd={() => setHoveredIntegration(null)}
                    >
                      <Card className="h-full overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                        {(integration.new || integration.popular) && (
                          <div className="absolute top-4 right-4 z-10 flex gap-2">
                            {integration.new && (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                New
                              </Badge>
                            )}
                            {integration.popular && (
                              <Badge
                                variant="outline"
                                className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-500/20"
                              >
                                Popular
                              </Badge>
                            )}
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <div className="h-16 flex items-center justify-center mb-4">
                            <integration.icon className="h-12 w-auto text-primary transition-transform duration-300 group-hover:scale-110" />
                          </div>
                          <CardTitle className="text-xl">{integration.name}</CardTitle>
                          <CardDescription className="text-sm">{integration.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground">{integration.longDescription}</p>
                        </CardContent>
                        <CardFooter className="pt-2 flex justify-between items-center">
                          <Button variant="ghost" size="sm" className="gap-1 text-primary">
                            Learn more <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                          <Badge variant="outline" className="capitalize">
                            {integration.category}
                          </Badge>
                        </CardFooter>

                        {/* Hover details */}
                        <AnimatePresence>
                          {hoveredIntegration === integration.id && (
                            <motion.div
                              className="overflow-hidden rounded-lg absolute inset-1 bg-background/95 backdrop-blur-sm p-4 flex flex-col"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <h4 className="font-medium text-lg mb-2">{integration.name} Benefits</h4>
                              <ul className="space-y-2 flex-grow">
                                {integration.benefits?.map((benefit, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                              <Button
                                size="sm"
                                className="mt-4 w-full"
                                onClick={() => window.open(integration.documentation, "_blank")}
                              >
                                View Documentation
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  </SectionReveal>
                ))}
              </div>
            </SectionReveal>
          )}
        </AnimatePresence>

        {/* Other Integrations */}
        <AnimatePresence mode="wait">
          {otherIntegrations.length > 0 && (
            <SectionReveal key="other" delay={0.4}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">All Integrations</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {otherIntegrations.map((integration, index) => (
                  <SectionReveal key={integration.id} delay={0.4 + index * 0.05} className="group">
                    <Card className="border hover:border-primary/50 transition-all duration-300 hover:shadow-md overflow-hidden h-full">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between mb-2">
                          <integration.icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                          {integration.new && (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-xs">
                              New
                            </Badge>
                          )}
                          {integration.popular && !integration.new && (
                            <Badge
                              variant="outline"
                              className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-500/20 text-xs"
                            >
                              Popular
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-base">{integration.name}</CardTitle>
                        <CardDescription className="text-xs">{integration.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="p-4 pt-2 flex justify-between items-center">
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-primary">
                          Details
                        </Button>
                        <Badge variant="outline" className="capitalize text-xs">
                          {integration.category}
                        </Badge>
                      </CardFooter>
                    </Card>
                  </SectionReveal>
                ))}
              </div>
            </SectionReveal>
          )}
        </AnimatePresence>

        {/* No results */}
        {filteredIntegrations.length === 0 && (
          <SectionReveal className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">No integrations found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("all")
              }}
            >
              Reset Filters
            </Button>
          </SectionReveal>
        )}

        {/* CTA Section */}
        <SectionReveal className="mt-20 text-center" delay={0.5}>
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to integrate?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Get started with our powerful integrations and build your next project faster than ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Get Started</Button>
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
