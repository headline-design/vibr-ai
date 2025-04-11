import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-background rounded-md border p-4 hover:shadow-md transition-all duration-200 hover:border-primary/50">
      <div className="mb-3 bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
