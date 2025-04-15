"use server"

import { createClient } from "@/utils/supabase/server"

// Project interface
export interface Project {
  id: string
  name: string
  description: string
  type: string
  created_at: string
  updated_at: string
  user_id: string
}

// Create a new project
export async function createProject(projectData: {
  name: string
  description: string
  type: string
}): Promise<Project> {
  try {
    const supabase = createClient()
    // Get the current user
    const {
      data: { user },
    } = await (await supabase).auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Insert the project into the database
    const { data, error } = await (await supabase)
      .from("projects")
      .insert({
        name: projectData.name,
        description: projectData.description,
        type: projectData.type,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error)
      throw error
    }

    return data as Project
  } catch (error) {
    console.error("Error in createProject:", error)
    throw error
  }
}

// Get all projects for the current user
export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = createClient()
    // Get the current user
    const {
      data: { user },
    } = await (await supabase).auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Get all projects for the user
    const { data, error } = await (await supabase)
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error getting user projects:", error)
      throw error
    }

    return data as Project[]
  } catch (error) {
    console.error("Error in getProjects:", error)
    throw error
  }
}

// Get a project by ID
export async function getProjectById(id: string): Promise<Project> {
  try {
    const supabase = createClient()
    // Get the project
    const { data, error } = await (await supabase).from("projects").select("*").eq("id", id).single()

    if (error) {
      console.error("Error getting project:", error)
      throw error
    }

    return data as Project
  } catch (error) {
    console.error("Error in getProjectById:", error)
    throw error
  }
}

// Update a project
export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  try {
    const supabase = createClient()
    // Update the project
    const { data, error } = await (await supabase).from("projects").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating project:", error)
      throw error
    }

    return data as Project
  } catch (error) {
    console.error("Error in updateProject:", error)
    throw error
  }
}

// Delete a project
export async function deleteProject(id: string): Promise<void> {
  try {
    const supabase = createClient()
    // Delete the project
    const { error } = await (await supabase).from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      throw error
    }
  } catch (error) {
    console.error("Error in deleteProject:", error)
    throw error
  }
}
