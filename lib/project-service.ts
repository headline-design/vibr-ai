"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Create a Supabase client for server-side operations
async function getSupabaseServer() {
  const cookieStore = await cookies()
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    auth: {
      detectSessionInUrl: false,
      persistSession: false,
      storage: {
        getItem: async (key: string) => (await cookieStore).get(key)?.value || null,
        setItem: () => Promise.resolve(),
        removeItem: () => Promise.resolve(),
      },
    },
  })
}

export interface Project {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  user_id: string
  is_archived: boolean
}

export interface ProjectInput {
  name: string
  description?: string
}

// Add exponential backoff for retries
async function fetchWithRetry(fn: () => Promise<any>, maxRetries = 3) {
  let retries = 0

  while (retries < maxRetries) {
    try {
      return await fn()
    } catch (error: any) {
      // If we hit rate limit, don't retry
      if (error.message && error.message.includes("Too Many R")) {
        throw error
      }

      retries++
      if (retries >= maxRetries) {
        throw error
      }

      // Exponential backoff
      const delay = Math.pow(2, retries) * 500
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

export async function getProjects() {
  const supabase = await getSupabaseServer()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  try {
    return await fetchWithRetry(async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching projects:", error)
        throw new Error(error.message)
      }

      return data as Project[]
    })
  } catch (error) {
    console.error("Error in getProjects:", error)
    throw error
  }
}

export async function getProject(id: string) {
  const supabase = await getSupabaseServer()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  try {
    return await fetchWithRetry(async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).eq("user_id", user.id).single()

      if (error) {
        console.error("Error fetching project:", error)
        throw new Error(error.message)
      }

      return data as Project
    })
  } catch (error) {
    console.error("Error in getProject:", error)
    throw error
  }
}

export async function createProject(project: ProjectInput) {
  const supabase = await getSupabaseServer()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  try {
    return await fetchWithRetry(async () => {
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            ...project,
            user_id: user.id,
          },
        ])
        .select()

      if (error) {
        console.error("Error creating project:", error)
        throw new Error(error.message)
      }

      return data[0] as Project
    })
  } catch (error) {
    console.error("Error in createProject:", error)
    throw error
  }
}

export async function updateProject(id: string, project: ProjectInput) {
  const supabase = await getSupabaseServer()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  try {
    return await fetchWithRetry(async () => {
      const { data, error } = await supabase
        .from("projects")
        .update({
          ...project,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()

      if (error) {
        console.error("Error updating project:", error)
        throw new Error(error.message)
      }

      return data[0] as Project
    })
  } catch (error) {
    console.error("Error in updateProject:", error)
    throw error
  }
}

export async function deleteProject(id: string) {
  const supabase = await getSupabaseServer()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  try {
    return await fetchWithRetry(async () => {
      // Instead of hard deleting, we'll archive the project
      const { error } = await supabase
        .from("projects")
        .update({
          is_archived: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error deleting project:", error)
        throw new Error(error.message)
      }

      return true
    })
  } catch (error) {
    console.error("Error in deleteProject:", error)
    throw error
  }
}
