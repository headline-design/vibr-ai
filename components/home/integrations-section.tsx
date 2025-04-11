"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function IntegrationsSection() {
  const integrations = [
    {
      name: "Next.js",
      description: "React framework with App Router support",
      logo: "/nextjs-logo-minimal.png",
      category: "framework",
      featured: true,
    },
    {
      name: "Vercel",
      description: "Optimized for Vercel deployment and Edge Functions",
      logo: "/vercel-logo-minimalist.png",
      category: "platform",
      featured: true,
    },
    {
      name: "Supabase",
      description: "Deep integration with Supabase Auth and Database",
      logo: "/supabase-logo-abstract.png",
      category: "database",
      featured: true,
    },
    {
      name: "OpenAI",
      description: "Leverages OpenAI's advanced language models",
      logo: "/abstract-geometric-network.png",
      category: "ai",
      featured: true,
    },
    {
      name: "Cursor",
      description: "Enhanced coding experience with Cursor integration",
      logo: "/minimal-cursor-logo.png",
      category: "editor",
      featured: false,
    },
    {
      name: "Tailwind CSS",
      description: "Beautiful UI with Tailwind CSS",
      logo: "/tailwind-css-abstract.png",
      category: "styling",
      featured: false,
    },
    {
      name: "TypeScript",
      description: "Type-safe development with TypeScript",
      logo: "/typescript-logo-abstract.png",
      category: "language",
      featured: false,
    },
    {
      name: "shadcn/ui",
      description: "Elegant components with shadcn/ui",
      logo: "/minimal-shadcn-logo.png",
      category: "ui",
      featured: false,
    },
  ]

  // Filter featured integrations to show at the top
  const featuredIntegrations = integrations.filter((integration) => integration.featured)
  const otherIntegrations = integrations.filter((integration) => !integration.featured)

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Powerful Integrations</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Built on top of the best tools in the industry
          </p>
        </div>

        {/* Featured Integrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredIntegrations.map((integration, index) => (
            <motion.div
              key={index}
              className="bg-background border rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative w-16 h-16 mb-4">
                <Image
                  src={integration.logo || "/placeholder.svg"}
                  alt={`${integration.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-medium mb-2">{integration.name}</h3>
              <p className="text-sm text-muted-foreground">{integration.description}</p>
              <div className="mt-4 inline-flex items-center text-primary text-sm font-medium">
                Learn more <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Integrations */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {otherIntegrations.map((integration, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div className="relative w-10 h-10 mb-2">
                <Image
                  src={integration.logo || "/placeholder.svg"}
                  alt={`${integration.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xs font-medium">{integration.name}</h3>
              <p className="text-[0.6rem] text-muted-foreground">{integration.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
