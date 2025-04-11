import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Database, Braces, Sparkles, Layers, Zap, Award } from "lucide-react"
import { FeatureCard } from "@/components/home/feature-card"
import { HeroSection } from "@/components/home/hero-section"
import { IntegrationsSection } from "@/components/home/integrations-section"
import { DemoSection } from "@/components/home/demo-section"
import { CTASection } from "@/components/home/cta-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Integrations Section - Moved up to be right after the hero */}
        <IntegrationsSection />

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Advanced Features</h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                Vibr combines cutting-edge technologies to deliver a next-generation coding assistant
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Database className="h-10 w-10 text-primary" />}
                title="Supabase Integration"
                description="Seamless database integration with Supabase for real-time data synchronization, authentication, and project management."
              />

              <FeatureCard
                icon={<Braces className="h-10 w-10 text-primary" />}
                title="Advanced Code Generation"
                description="AI-powered code generation with syntax highlighting, error detection, and intelligent suggestions."
              />

              <FeatureCard
                icon={<Sparkles className="h-10 w-10 text-primary" />}
                title="Context-Aware AI"
                description="Our AI understands your project context, providing more relevant and accurate assistance."
              />

              <FeatureCard
                icon={<Layers className="h-10 w-10 text-primary" />}
                title="Project Management"
                description="Organize your work with integrated project management tools that sync across devices."
              />

              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="Real-time Collaboration"
                description="Work together with your team in real-time with shared contexts and synchronized updates."
              />

              <FeatureCard
                icon={<Award className="h-10 w-10 text-primary" />}
                title="Next.js Optimized"
                description="Built specifically for Next.js developers with specialized tools and templates."
              />
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="py-16 bg-background">
          <div className="container px-4 md:px-6">
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
                <div className="relative bg-background border rounded-xl shadow-lg overflow-hidden">
                  <div className="p-1 bg-muted">
                    <div className="flex items-center space-x-1.5 px-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="ml-2 text-xs text-muted-foreground">Vibr Architecture</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <pre className="text-xs sm:text-sm overflow-auto p-4 bg-muted rounded-lg">
                      <code className="language-typescript">
                        {`// Vibr AI Chat Architecture
import { createAI, createStore } from '@vercel/ai';
import { supabase } from '@/lib/supabase';

// Create a store to manage chat state
const store = createStore({
  initialState: {
    messages: [],
    context: {},
    projects: [],
  },
});

// Initialize the AI with Supabase integration
export const ai = createAI({
  store,
  actions: {
    submitMessage: async (message, context) => {
      // Store message in Supabase
      await supabase
        .from('messages')
        .insert({ content: message, user_id: context.userId });

      // Process with AI pipeline
      const response = await processWithAIPipeline(message, context);

      // Update project context if needed
      if (response.projectUpdates) {
        await updateProjectData(response.projectUpdates);
      }

      return response;
    },
  },
  // Advanced configuration for Next.js integration
  nextConfig: {
    experimental: {
      serverActions: true,
      serverComponents: true,
    },
  },
});`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <DemoSection />

        {/* CTA Section */}
        <CTASection />
      </main>
    </div>
  )
}
