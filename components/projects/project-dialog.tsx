"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createProject, updateProject, type Project } from "@/lib/project-service"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
  onSave: (project: Project) => void
}

export function ProjectDialog({ open, onOpenChange, project, onSave }: ProjectDialogProps) {
  const [name, setName] = useState(project?.name || "")
  const [description, setDescription] = useState(project?.description || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const isEditing = !!project

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      let savedProject: Project

      if (isEditing && project) {
        savedProject = await updateProject(project.id, {
          name,
          description: description || undefined,
        })
        toast({
          title: "Project updated",
          description: "Your project has been updated successfully.",
        })
      } else {
        savedProject = await createProject({
          name,
          description: description || undefined,
        })
        toast({
          title: "Project created",
          description: "Your new project has been created successfully.",
        })
      }

      onSave(savedProject)
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} the project. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open && project) {
      setName(project.name)
      setDescription(project.description || "")
    } else if (open) {
      setName("")
      setDescription("")
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Project" : "Create Project"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update your project details below." : "Add a new project to organize your conversations."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project description (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
