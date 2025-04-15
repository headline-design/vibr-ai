"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ProjectDialog } from "./project-dialog"
import type { Project } from "@/lib/project-service"
import { FolderPlus, Edit, Trash2, Eye, MoreVertical, Wand2, MoreHorizontal } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface ProjectListProps {
  initialProjects: Project[]
  user?: User // Making user prop optional
  onProjectChange?: (projectId: string) => void
}

interface ProjectActionsProps {
  project: Project
  onDelete: (projectId: string) => void
  onEdit: () => void
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ project, onDelete, onEdit }) => {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-md hover:bg-accent hover:text-accent-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}`)}>
          <Eye className="h-4 w-4 mr-2" />
          View Project
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation()
            onEdit()
          }}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Project
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(project.id)} className="text-red-500">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ProjectList({ initialProjects, user, onProjectChange }: ProjectListProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Set the selected project from URL on initial load
  useEffect(() => {
    const projectId = searchParams.get("project")
    if (projectId) {
      setSelectedProject(projects.find((p) => p.id === projectId) || null)
    } else if (projects.length > 0) {
      setSelectedProject(projects[0])
    }
  }, [searchParams, projects])

  const handleProjectSaved = (project: Project) => {
    if (projects.find((p) => p.id === project.id)) {
      // Update existing project
      setProjects((prevProjects) => prevProjects.map((p) => (p.id === project.id ? project : p)))
    } else {
      // Add new project
      setProjects([project, ...projects])
    }
    setIsDialogOpen(false)
    // router.push("/projects")
  }

  const handleProjectDeleted = (projectId: string) => {
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId))
    setSelectedProject(null)
    router.push("/projects") // Redirect to projects page after deletion
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
        <Button onClick={() => setIsDialogOpen(true)} variant="outline" size="sm" className="gap-2">
          <FolderPlus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">No projects yet. Create one to get started!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="block">
              <Card
                className={cn(
                  "shadow-base bg-background-subtle rounded-lg group relative flex min-h-[127px] w-full min-w-0 flex-col transition-all hover:shadow-md",
                  "hover:bg-accent",
                  selectedProject?.id === project.id ? "border-primary shadow-md" : "border-border",
                  "transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:bg-accent",
                )}
              >
                <Link className="absolute inset-0 z-10 cursor-pointer overflow-hidden rounded-lg" href={`/projects/${project.id}`}>
                <span className="sr-only">View Project</span>
                </Link>

                <div className="grid flex-1 auto-rows-min items-start gap-3 p-3 text-sm">
                  <CardHeader className="p-0 pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Wand2 className="h-4 w-4 text-muted-foreground mb-1" />
                        <h3 className="font-medium text-lg">{project.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">Type: {project.type}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0"></CardContent>
                </div>
                <div data-orientation="horizontal" role="none" className="shrink-0 h-[1px] bg-border mx-3 w-auto"></div>
                <CardFooter className="flex p-6 h-11 items-center rounded-b-lg px-3 py-0">
                  <div className="flex min-w-0 items-center gap-1 text-sm leading-none text-gray-500">
                    <div className="text-xs text-muted-foreground">{project.id.substring(0, 8)}...</div>
                    <div className="text-xs text-muted-foreground">Updated {formatDate(project.updated_at)}</div>
                  </div>
                  <ProjectActions
                    project={project}
                    onDelete={handleProjectDeleted}
                    onEdit={() => {
                      setSelectedProject(project)
                      setIsDialogOpen(true)
                    }}
                  />
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}

      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        project={selectedProject}
        onSave={handleProjectSaved}
      />
    </div>
  )
}
