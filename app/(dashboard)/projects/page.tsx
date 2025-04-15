import { getProjects } from "@/lib/project-service"
import { ProjectList } from "@/components/project/project-list"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <main className="container py-10">
      <div className="mb-8">
        <Breadcrumbs segments={[{ label: "Projects", href: "/projects" }]} />
        <header className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage your projects and organize your conversations.</p>
        </header>
      </div>
      <ProjectList initialProjects={projects} />
    </main>
  )
}
