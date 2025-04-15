"use client"

import { createProject, updateProject } from "@/lib/project-service"
import { setPendingIntent } from "./intent-conditions"
import { projectConfirmationNodes } from "../project-tree"

// First, add the import for our AI service at the top of the file
import { generateTweet } from "@/lib/ai-service"

// State management for project-related conditions

let waitingForProjectName = false
let waitingForXPost = false
let waitingForDescriptionForProject: { id: string; name: string } | null = null
let lastProjectData: any = null

// Main entry point for handling all project-related conditions
export async function handleProjectConditions(
  message: string,
  context: {
    metaSession: any
    updateMetaSession: (updates: any) => void
    toast: any
    metadata?: any // Optional metadata
    addMessage?: any
    updateMessage?: any
  },
) {
  const { metaSession, updateMetaSession, toast, addMessage, updateMessage } = context
  let confirmationNode
  const normalizedMessage = message.toLowerCase().trim()
  console.log("Handling project conditions for message:", normalizedMessage)

  if (projectConfirmationNodes.some((node) => node.content.toLowerCase().includes(normalizedMessage))) {
    confirmationNode = projectConfirmationNodes.find((node) => node.content.toLowerCase().includes(normalizedMessage))
    if (!confirmationNode) return null
    handleProjectActionState(confirmationNode.id, lastProjectData, context)
  }

  // Check if we are waiting for a project description
  if (waitingForDescriptionForProject && !confirmationNode) {
    const result = await handleProjectDescriptionInput(message, waitingForDescriptionForProject, toast)
    waitingForDescriptionForProject = null

    if (result && result.projectData) {
      lastProjectData = result.projectData
    }

    return result
  }

  // Check if we are waiting for a project name
  if (waitingForProjectName) {
    const result = await handleProjectNameInput(message, updateMetaSession, toast)

    if (result) {
      waitingForProjectName = false

      if (result.projectData) {
        lastProjectData = result.projectData
      }

      return result
    }
  }

  // Check if we are waiting for a project X post
  if (waitingForXPost) {
    const projectName = lastProjectData?.name
    const projectDescription = lastProjectData?.description
    const result = await generateProjectTweet(projectName, projectDescription, context)
    waitingForXPost = false

    return result
  }

  // No project-specific conditions matched
  return null
}

// Handle project creation intent
export function handleProjectCreationIntent() {
  console.log("Handling create_project intent")
  waitingForProjectName = true

  return {
    response: "Great! What would you like to call the new project?",
    isClientOnly: true,
  }
}

// Handle project name input
async function handleProjectNameInput(
  message: string,
  updateMetaSession: (updates: any) => void,
  toast: any,
) {
  console.log("Creating project with name:", message)
  try {
    // Call the project service to create the project
    const project = await createProject({
      name: message,
      description: "",
      type: "web",
    })

    toast({
      title: "Success",
      description: `Project "${message}" created successfully!`,
    })

    // Update meta session with the project name
    updateMetaSession({ lastProjectName: message })

    // Return response with action buttons
    return {
      response: `Great! I've created a project called "${message}". What would you like to do next?`,
      isClientOnly: true,
      actions: [
        {
          id: "navigate_to_project",
          label: "Navigate to project",
          variant: "default",
          type: "local",
          route: `/projects/${project.id}`,
        },
        { id: "add_project_description", label: "Add a project description", variant: "outline" },
        { id: "do_something_else", label: "Do something else", variant: "outline" },
      ],
      projectData: project, // Pass the project data for use in action handlers
    }
  } catch (error) {
    console.error("Error creating project:", error)
    toast({
      title: "Error",
      description: "Failed to create project. Please try again.",
      variant: "destructive",
    })
    return {
      response: "Sorry, I failed to create the project. Please try again.",
      isClientOnly: true,
    }
  }
}

// Handle project action clicks for state management
// Do not execute actions here, just set the state
export async function handleProjectActionState(actionId: string, projectData: any, context: any) {
  if (!projectData) {
    projectData = lastProjectData
  } else {
    lastProjectData = projectData
  }

  console.log("ACTION_ID:", actionId)

  if (actionId === "navigate_to_project") {
    return {
      response: `Navigating to project "${projectData.name}"...`,
      isClientOnly: true,
    }
  }
  else if (actionId === "add_project_description") {
    console.log("Waiting for project description input")
    console.log("Project data for description:", projectData)
    // Set state to indicate we're waiting for a description for this project
    waitingForDescriptionForProject = { id: projectData.id, name: projectData.name }

    // Set the pending intent with the expected action ID
    setPendingIntent({
      intent: "add_project_description",
      confirmationMessage: `Ok, please provide a short description for "${projectData.name}":`,
      isConfirmation: true,
      originalMessage: `Add a description for "${projectData.name}"`,
      expectedActionId: "add_project_description", // Store the action ID
    })

    return {
      response: `Ok, please provide a short description for "${projectData.name}":`,
      isClientOnly: true,
    }
  }
  switch (actionId) {
    case "generate_project_x_post":

    waitingForXPost = true
    return {
      response: `Generating a tweet for "${projectData.name}"...`,
      isClientOnly: true,
    }

    case "copy_tweet":
      try {
        const tweet = context.metadata?.tweet || ""
        if (tweet) {
          await navigator.clipboard.writeText(tweet)
          context.toast?.({
            title: "Tweet copied to clipboard",
            description: "You can now paste it wherever you need.",
          })
        }
      } catch (error) {
        console.error("Failed to copy tweet:", error)
        context.toast?.({
          title: "Failed to copy tweet",
          description: "Please try again or copy it manually.",
          variant: "destructive",
        })
      }
      return null

    case "regenerate_project_x_post":
      const regen_projectName = context.metadata?.projectName || context.metaSession?.lastProjectName || ""
      const regen_projectDescription =
        context.metadata?.projectDescription || context.metaSession?.lastProjectDescription || ""

      if (!regen_projectName || !regen_projectDescription) {
        return {
          response: "I need both a project name and description to regenerate a tweet. Please provide those first.",
          isClientOnly: true,
        }
      }

      return generateProjectTweet(regen_projectName, regen_projectDescription, context)
  }

  return null
}

// Handle project description input
async function handleProjectDescriptionInput(message: string, projectInfo: { id: string; name: string }, toast: any) {
  console.log("handleProjectDescriptionInput called with message:", message) // ADDED
  console.log("Incoming message:", message)
  try {
    // Update the project with the new description
    await updateProject(projectInfo.id, { description: message })

    toast({
      title: "Description updated",
      description: `Description for "${projectInfo.name}" has been updated.`,
    })

    setPendingIntent(null) // Clear the pending intent

    return {
      response: `Thanks! I've updated the description for "${projectInfo.name}".`,
      isClientOnly: true,
      actions: [
        {
          id: "navigate_to_project",
          label: "Navigate to project",
          variant: "default",
          type: "local",
          route: `/projects/${projectInfo.id}`,
        },
        { id: "generate_project_x_post", label: "Generate X post", variant: "outline" },
      ],
      projectData: { ...projectInfo, description: message },
    }
  } catch (error) {
    console.error("Error updating project description:", error)
    toast({
      title: "Error",
      description: "Failed to update project description. Please try again.",
      variant: "destructive",
    })

    return {
      response: "Sorry, I couldn't update the project description. Please try again.",
      isClientOnly: true,
    }
  }
}

// Add a new function to handle the actual tweet generation
// This will be called from the conversation tree provider when it detects the thinking state

export async function generateProjectTweet(projectName: string, projectDescription: string, context: any) {
  console.log(`Attempting to generate tweet for project "${projectName}" with description: "${projectDescription}"`) // ADDED
  console.log(`Generating tweet with projectName: ${projectName} and projectDescription: ${projectDescription}`)
  try {
    const tweet = await generateTweet({ projectName, projectDescription })
    console.log("Generated tweet:", tweet)

    return {
      response: `Here's a tweet for your project "${projectName}":

${tweet}`,
      isClientOnly: true,
      actions: [
        { id: "copy", type: "local", label: "Copy Post", variant: "default" },
        { id: "regenerate_project_x_post", label: "Regenerate", variant: "outline" },
      ],
      metadata: { tweet, projectName, projectDescription },
    }
  } catch (error: any) {
    console.error("Error generating tweet:", error)
    console.error("Tweet generation error:", error)
    return {
      response: "Sorry, I encountered an error while generating your tweet. Please try again.",
      isClientOnly: true,
    }
  }
}
