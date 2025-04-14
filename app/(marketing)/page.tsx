"use client"

import { HeroSection } from "@/components/home/hero-section"
import { SolutionSection } from "@/components/home/solution-section"
import { IntegrationsSection } from "@/components/home/integrations-section"
import { ArchitectureSection } from "@/components/home/architecture-section"
import { CTASection } from "@/components/home/cta-section"
import { SectionIndicator } from "@/components/home/section-indicator"
import { AccuracyCalloutSection } from "@/components/home/accuracy-callout-section"

export default function Page() {
  const sections = [
    { id: "hero", label: "Home" },
    { id: "solutions", label: "Features" },
    { id: "integrations", label: "Integrations" },
    { id: "architecture", label: "Architecture" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <section id="hero">
        <HeroSection />
      </section>
      <SolutionSection />
      <IntegrationsSection />
      <AccuracyCalloutSection />
      <ArchitectureSection />
      <CTASection />
      <SectionIndicator sections={sections} />
    </main>
  )
}
