"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProjectDialog } from "@/components/projects/project-dialog"
import type { Project } from "@/lib/project-service"

interface ProjectSelectorProps {
  projects: Project[]
}

export function ProjectSelector({ projects }: ProjectSelectorProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [localProjects, setLocalProjects] = useState<Project[]>(projects)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Set the selected project from URL on initial load
  useEffect(() => {
    const projectId = searchParams.get("project")
    if (projectId) {
      setSelectedProject(projectId)
    } else if (localProjects.length > 0) {
      setSelectedProject(localProjects[0].id)
    }
  }, [searchParams, localProjects])

  const handleProjectChange = (value: string) => {
    setSelectedProject(value)
    router.push(`/?project=${value}`)
  }

  const handleProjectSaved = (project: Project) => {
    setLocalProjects([project, ...localProjects])
    setSelectedProject(project.id)
    router.push(`/?project=${project.id}`)
    setIsDialogOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedProject || ""} onValueChange={handleProjectChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {localProjects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={() => setIsDialogOpen(true)} title="Create new project">
        <Plus className="h-4 w-4" />
      </Button>

      <ProjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} project={null} onSave={handleProjectSaved} />
    </div>
  )
}
