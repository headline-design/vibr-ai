import { getProjects } from "@/lib/project-service"
import { ProjectList } from "@/components/projects/project-list"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container py-8">
      <ProjectList initialProjects={projects} />
    </div>
  )
}
