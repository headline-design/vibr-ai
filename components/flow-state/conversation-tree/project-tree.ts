import { type ConfirmationNode, type ConversationNode, ProximityCategory } from "./tree-types"

export const projectNodes: ConversationNode[] = [
  {
    id: "create_project",
    content: "Would you like to create a new project? I can help you set that up.",
    category: ProximityCategory.PROJECT_MANAGEMENT,
    clientOnly: true,
    actions: [
      { id: "yes", label: "Yes", variant: "default" },
      { id: "no", label: "No", variant: "outline" },
    ],
  },
  {
    id: "project_description_input",
    content: "Great! What would you like to call your new project?",
    category: ProximityCategory.PROJECT_MANAGEMENT,
    clientOnly: true,
    conditions: [],
  },
  {
    id: "get_project_name",
    content: "Ok great, what would you like to call your new project?",
    category: ProximityCategory.PROJECT_MANAGEMENT,
    clientOnly: true,
    conditions: [],
  },
  {
    id: "project_created_success",
    content: (metaSession: any) =>
      `Great! Your project "${metaSession.lastProjectName}" has been created successfully. You can now access it from your projects dashboard.`,
    category: ProximityCategory.PROJECT_MANAGEMENT,
    clientOnly: true,
  },
  {
    id: "project_created_error",
    content: "I'm sorry, there was an error creating your project. Please try again or check your account settings.",
    category: ProximityCategory.PROJECT_MANAGEMENT,
    clientOnly: true,
  },
]

// These are user confirmation nodes for project-related actions

export const projectConfirmationNodes: ConfirmationNode[] = [
  {
    id: "add_project_description",
    content: "Add a project description",
  },
  {
    id: "generate_project_x_post",
    content: "Generate X post",
  },
  {
    id: "navigate_to_project",
    content: "Navigate to project",
  },
]
