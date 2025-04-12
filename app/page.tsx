import { HeroSection } from "@/components/home/hero-section"
import { IntegrationsSection } from "@/components/home/integrations-section"
import { CTASection } from "@/components/home/cta-section"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CompactAIDiagram from "@/components/home/compact-ai-diagram"


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Integrations Section - Moved up to be right after the hero */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <IntegrationsSection />
          </div>
        </section>

        {/* Architecture Section */}
        <ArchitectureSection />

        {/* CTA Section */}
        <CTASection />
      </main>
    </div>
  )
}

function ArchitectureSection() {

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Advanced Chatbot Architecture</h2>
            <p className="text-xl text-muted-foreground mb-6">
              Our innovative architecture combines the latest in AI technology with efficient data management
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Multi-model AI Pipeline</h3>
                  <p className="text-muted-foreground">
                    Combines multiple AI models for more accurate and context-aware responses
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Real-time Database Sync</h3>
                  <p className="text-muted-foreground">
                    Supabase integration provides instant data synchronization and secure authentication
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Serverless Edge Functions</h3>
                  <p className="text-muted-foreground">
                    Deployed on Vercel's edge network for minimal latency and global availability
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Adaptive Learning System</h3>
                  <p className="text-muted-foreground">
                    Improves over time by learning from user interactions and feedback
                  </p>
                </div>
              </li>
            </ul>
            <div className="mt-8">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/chat">
                  Try the AI Chat <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl opacity-70"></div>
            <div className="bg-background z-10 relative max-w-3xl mx-auto border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
              {/* Browser chrome */}
              <div className="bg-background  border-b border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                </div>
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-md px-3 py-1 text-sm text-gray-500 dark:text-gray-400 flex items-center border border-gray-200 dark:border-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                    />
                  </svg>
                  ai-system-architecture.vercel.app
                </div>
              </div>

              {/* Content area */}
              <div className="p-4 bg-white dark:bg-black">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold dark:text-white">AI System Architecture</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Interactive diagram showing data flow and component interactions
                  </p>
                </div>

                <CompactAIDiagram />

                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                  <span>Built with React Flow</span>
                  <span>Last updated: April 11, 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



