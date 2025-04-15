"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProject } from "@/lib/project-service"
import { useToast } from "@/components/ui/use-toast"

interface ProjectCreationFormProps {
  onComplete: (success: boolean, projectName?: string) => void
  onCancel: () => void
}

export function ProjectCreationForm({ onComplete, onCancel }: ProjectCreationFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [projectType, setProjectType] = useState("web")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Creating project:", { name, description, projectType })

      // Call the project service to create the project
      const project = await createProject({
        name,
        description,
        type: projectType,
      })

      toast({
        title: "Success",
        description: `Project "${name}" created successfully!`,
      })

      onComplete(true, name)
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
      onComplete(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Project"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of your project"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Project Type</Label>
        <Select value={projectType} onValueChange={setProjectType}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="web">Web Application</SelectItem>
            <SelectItem value="mobile">Mobile App</SelectItem>
            <SelectItem value="api">API</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  )
}
