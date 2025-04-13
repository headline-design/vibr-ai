"use client"

import { HeroSection } from "@/components/home/hero-section"
import { SolutionSection } from "@/components/home/solution-section"
import { IntegrationsSection } from "@/components/home/integrations-section"
import { ArchitectureSection } from "@/components/home/architecture-section"
import { CTASection } from "@/components/home/cta-section"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <SolutionSection />
      <IntegrationsSection />
      <ArchitectureSection />
      <CTASection />
    </main>
  )
}
