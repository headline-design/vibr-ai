import { DesignSystemShowcase } from "@/components/design-system-showcase"

export default function DesignSystemPage() {
  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Design System</h1>
          <p className="text-muted-foreground mt-2">A unified design system for the Vibr chat interface</p>
        </div>

        <DesignSystemShowcase />
      </div>
    </div>
  )
}
