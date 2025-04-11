import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function DemoSection() {
  return (
    <section className="py-12 bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">See Vibr in Action</h2>
          <p className="mt-2 text-xl text-muted-foreground max-w-2xl mx-auto">
            See how Vibr transforms the coding workflow with AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-xl p-2 flex flex-col">
            <div className="aspect-video bg-muted rounded-lg mb-2 flex items-center justify-center">
              <div className="text-muted-foreground">AI Code Generation</div>
            </div>
            <h3 className="text-sm font-medium mb-1">Smart Code Generation</h3>
            <p className="text-xs text-muted-foreground mb-2 flex-1">
              Watch how Vibr generates code based on your requirements.
            </p>
            <Button asChild variant="outline" className="mt-auto text-xs">
              <Link href="/chat">
                Try it yourself <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </div>

          <div className="bg-muted/50 rounded-xl p-2 flex flex-col">
            <div className="aspect-video bg-muted rounded-lg mb-2 flex items-center justify-center">
              <div className="text-muted-foreground">Project Management</div>
            </div>
            <h3 className="text-sm font-medium mb-1">Project Organization</h3>
            <p className="text-xs text-muted-foreground mb-2 flex-1">
              See how Vibr helps you organize your coding projects.
            </p>
            <Button asChild variant="outline" className="mt-auto text-xs">
              <Link href="/projects">
                Explore projects <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </div>

          <div className="bg-muted/50 rounded-xl p-2 flex flex-col">
            <div className="aspect-video bg-muted rounded-lg mb-2 flex items-center justify-center">
              <div className="text-muted-foreground">Team Collaboration</div>
            </div>
            <h3 className="text-sm font-medium mb-1">Team Collaboration</h3>
            <p className="text-xs text-muted-foreground mb-2 flex-1">
              Experience how teams can collaborate in real-time.
            </p>
            <Button asChild variant="outline" className="mt-auto text-xs">
              <Link href="/chat">
                See it in action <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
