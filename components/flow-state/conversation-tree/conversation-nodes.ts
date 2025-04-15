"use client"

import { projectNodes } from "./project-tree"
import { type ConversationNode, ProximityCategory } from "./tree-types"

// Create a comprehensive conversation tree
export const conversationNodes: ConversationNode[] = [
  //=============================================================================
  // HIGH PROXIMITY NODES (Client-side handling)
  //=============================================================================

  //-------------------------
  // App-specific context
  //-------------------------
  {
    id: "hello_flux_greeting",
    content: (metaSession) =>
      `Hello ${metaSession.userName !== "Guest" ? metaSession.userName : "user"}, welcome to the grid.`,
    clientOnly: true,
    category: ProximityCategory.APP_SPECIFIC,
    conditions: [],
  },
  {
    id: "general_greeting",
    content: (metaSession) => {
      const greetings = [
        `Hi there, ${metaSession.userName}! How can I assist you today?`,
        `Hello! What can I help you with today?`,
        `Hey ${metaSession.userName}! What's on your mind?`,
        `Greetings! How can I be of service today?`,
      ]
      return greetings[Math.floor(Math.random() * greetings.length)]
    },
    clientOnly: true,
    category: ProximityCategory.INTERACTION_SPECIFIC,
    conditions: [],
  },
  {
    id: "gratitude_response",
    content: (metaSession) => {
      const responses = [
        "You're welcome! Is there anything else I can help with?",
        "Happy to help! Let me know if you need anything else.",
        "No problem at all! What else would you like to know?",
        "Glad I could assist! Anything else on your mind?",
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    },
    clientOnly: true,
    category: ProximityCategory.INTERACTION_SPECIFIC,
    conditions: [],
  },
  {
    id: "farewell_response",
    content: (metaSession) => {
      const responses = [
        "Goodbye! Feel free to come back if you have more questions.",
        "See you later! I'll be here when you need assistance.",
        "Until next time! Have a great day.",
        "Bye for now! Looking forward to our next conversation.",
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    },
    clientOnly: true,
    category: ProximityCategory.INTERACTION_SPECIFIC,
    conditions: [],
  },
  {
    id: "app_introduction",
    content: (metaSession) =>
      `Flux is your AI coding assistant. I can help with coding questions, provide examples, and assist with debugging. What would you like to work on today, ${metaSession.userName}?`,
    clientOnly: true,
    category: ProximityCategory.APP_SPECIFIC,
    conditions: [],
  },
  {
    id: "app_capabilities",
    content: `Here's what I can help you with:

      1. Answer coding questions
      2. Generate code examples
      3. Explain programming concepts
      4. Help debug issues
      5. Provide best practices

      What would you like assistance with?`,
    clientOnly: true,
    category: ProximityCategory.APP_SPECIFIC,
    conditions: [],
  },
  {
    id: "app_help",
    content: `To use Flux effectively:

      - Type your questions in natural language
      - Be specific about programming languages or frameworks
      - Share code snippets for debugging help
      - Use the "Debug" tab to see how responses are generated

      Is there something specific you'd like help with?`,
    clientOnly: true,
    category: ProximityCategory.APP_SPECIFIC,
    conditions: [],
  },
  {
    id: "feature_inquiry",
    content: `This application offers several features including:

      1. AI-powered coding assistance
      2. Project management tools
      3. Collaborative editing
      4. Version control integration
      5. Automated testing and deployment

      Which feature would you like to learn more about?`,
    clientOnly: true,
    category: ProximityCategory.APP_SPECIFIC,
    conditions: [],
  },
  {
    id: "help_request",
    content: `I'd be happy to help you use this application. Here are some common tasks:

      1. Creating a new project
      2. Inviting team members
      3. Setting up integrations
      4. Configuring your workspace
      5. Using the AI assistant

      What would you like help with specifically?`,
    clientOnly: true,
    category: ProximityCategory.APP_SPECIFIC,
    conditions: [],
  },

  //-------------------------
  // User-specific context
  //-------------------------
  {
    id: "user_preferences",
    content: (metaSession) =>
      `Based on your preferences, I'll focus on ${metaSession.preferredLanguages.join(", ")} examples when relevant. Would you like to adjust your preferences?`,
    clientOnly: true,
    category: ProximityCategory.USER_SPECIFIC,
    conditions: [],
  },
  {
    id: "user_history",
    content: (metaSession) =>
      `I see you've been working on ${metaSession.lastTopics[0] || "coding topics"}. Would you like to continue with that or start something new?`,
    clientOnly: true,
    category: ProximityCategory.USER_SPECIFIC,
    conditions: [{ key: "lastTopics", operator: "contains", value: "code" }],
  },
  {
    id: "billing_inquiry",
    content: (metaSession) =>
      `I can help you with your billing information. Your next payment is due on the 15th of this month. Would you like to see your payment history or update your payment method?`,
    clientOnly: true,
    category: ProximityCategory.USER_SPECIFIC,
    conditions: [],
    actions: [
      { id: "history", label: "See payment history" },
      { id: "update", label: "Update payment method" },
    ],
  },
  {
    id: "account_inquiry",
    content: (metaSession) =>
      `Your account settings are accessible from the profile menu. You can update your email, password, and notification preferences there. Would you like me to guide you through any specific settings?`,
    clientOnly: true,
    category: ProximityCategory.USER_SPECIFIC,
    conditions: [],
  },
  {
    id: "project_inquiry",
    content: (metaSession) =>
      `Your current project is 65% complete with 3 tasks remaining. The next deadline is in 5 days. Would you like to see the task details or team activity?`,
    clientOnly: true,
    category: ProximityCategory.USER_SPECIFIC,
    conditions: [],
  },

  //-------------------------
  // Session-specific context
  //-------------------------
  {
    id: "greeting_time_specific",
    content: (metaSession) => {
      if (metaSession.timeOfDay === "Morning") {
        return `Good morning, ${metaSession.userName}! Ready for a productive coding session?`
      } else if (metaSession.timeOfDay === "Evening") {
        return `Good evening, ${metaSession.userName}! Getting some late-night coding done?`
      } else {
        return `Good afternoon, ${metaSession.userName}! How's your coding going today?`
      }
    },
    clientOnly: true,
    category: ProximityCategory.SESSION_SPECIFIC,
    conditions: [],
  },
  {
    id: "device_specific",
    content: (metaSession) =>
      `I notice you're using a ${metaSession.deviceType} device. I'll optimize my responses accordingly.`,
    clientOnly: true,
    category: ProximityCategory.SESSION_SPECIFIC,
    conditions: [],
  },
  {
    id: "session_duration",
    content: (metaSession) => {
      const minutes = Math.floor(metaSession.sessionDuration / 60000)
      if (minutes > 30) {
        return `You've been coding for over ${minutes} minutes. Remember to take breaks for optimal productivity!`
      }
      return ""
    },
    clientOnly: true,
    category: ProximityCategory.SESSION_SPECIFIC,
    conditions: [{ key: "sessionDuration", operator: "greaterThan", value: 1800000 }], // 30 minutes
  },

  //-------------------------
  // Interaction-specific context
  //-------------------------
  {
    id: "greeting_new_user",
    content: (metaSession) =>
      `Good ${metaSession.timeOfDay}, ${metaSession.userName}! I'm Flux, your coding assistant. How can I help you today?`,
    clientOnly: true,
    category: ProximityCategory.INTERACTION_SPECIFIC,
    conditions: [{ key: "interactionCount", operator: "lessThan", value: 3 }],
  },
  {
    id: "greeting_returning_user",
    content: (metaSession) =>
      `Welcome back, ${metaSession.userName}! Ready to continue working on your ${metaSession.lastTopics[0] || "project"}?`,
    clientOnly: true,
    category: ProximityCategory.INTERACTION_SPECIFIC,
    conditions: [
      { key: "interactionCount", operator: "greaterThan", value: 3 },
      { key: "lastTopics", operator: "contains", value: "code" },
    ],
  },
  {
    id: "interaction_frequency",
    content: (metaSession) =>
      `It's good to see you engaging with Flux! You've had ${metaSession.interactionCount} interactions so far.`,
    clientOnly: true,
    category: ProximityCategory.INTERACTION_SPECIFIC,
    conditions: [{ key: "interactionCount", operator: "greaterThan", value: 10 }],
  },
  {
    id: "confirmation_response",
    content: "Great! I'll help you with that right away.",
    clientOnly: true,
    category: ProximityCategory.INTERACTION_SPECIFIC,
    conditions: [],
  },
  {
    id: "denial_response",
    content: "I see. Let me try to better understand what you're looking for.",
    clientOnly: true,
    category: ProximityCategory.INTERACTION_SPECIFIC,
    conditions: [],
  },

  //-------------------------
  // Project management nodes
  //-------------------------

  ...projectNodes,

  //=============================================================================
  // LOW PROXIMITY NODES (LLM handling with client-side enhancement)
  //=============================================================================

  //-------------------------
  // Domain knowledge (programming)
  //-------------------------
  {
    id: "react_introduction",
    content:
      "React is a JavaScript library for building user interfaces. Here's a simple React component example:\n\n```jsx\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n```\n\nWould you like to learn more about React components, hooks, or state management?",
    clientOnly: false, // Let LLM enhance this
    category: ProximityCategory.DOMAIN_KNOWLEDGE,
    conditions: [{ key: "lastTopics", operator: "contains", value: "react" }],
  },
  {
    id: "typescript_introduction",
    content:
      "TypeScript is a strongly typed programming language that builds on JavaScript. Here's a basic example:\n\n```typescript\ninterface User {\n  name: string;\n  id: number;\n}\n\nfunction greetUser(user: User) {\n  return `Hello, ${user.name}!`;\n}\n\nconst user: User = {\n  name: 'John',\n  id: 1\n};\n\nconsole.log(greetUser(user));\n```\n\nWould you like to learn more about TypeScript interfaces, types, or generics?",
    clientOnly: false, // Let LLM enhance this
    category: ProximityCategory.DOMAIN_KNOWLEDGE,
    conditions: [{ key: "lastTopics", operator: "contains", value: "typescript" }],
  },
  {
    id: "javascript_introduction",
    content:
      "JavaScript is a versatile programming language primarily used for web development. Here's a simple example:\n\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('World'));\n```\n\nWould you like to learn about JavaScript functions, objects, or asynchronous programming?",
    clientOnly: false, // Let LLM enhance this
    category: ProximityCategory.DOMAIN_KNOWLEDGE,
    conditions: [{ key: "lastTopics", operator: "contains", value: "javascript" }],
  },

  //-------------------------
  // Career advice
  //-------------------------
  {
    id: "career_advice",
    content:
      "For a successful career in web development, consider:\n\n1. Building a strong portfolio of projects\n2. Contributing to open source\n3. Learning in-demand frameworks like React, Vue, or Angular\n4. Developing both frontend and backend skills\n5. Practicing data structures and algorithms for interviews\n\nWhat specific career advice are you looking for?",
    clientOnly: false, // Let LLM enhance this
    category: ProximityCategory.CAREER_ADVICE,
    conditions: [{ key: "lastTopics", operator: "contains", value: "career" }],
  },

  //-------------------------
  // General knowledge
  //-------------------------
  {
    id: "debugging_tips",
    content:
      "Here are some debugging tips for web development:\n\n1. Use `console.log()` to inspect variables\n2. Set breakpoints in your browser's DevTools\n3. Check for errors in the console\n4. Use the React DevTools extension for React apps\n5. Try isolating the problem by commenting out code\n\nWhat specific issue are you debugging?",
    clientOnly: false, // Let LLM enhance this
    category: ProximityCategory.GENERAL_KNOWLEDGE,
    conditions: [{ key: "lastTopics", operator: "contains", value: "debug" }],
  },

  //-------------------------
  // Fallback nodes
  //-------------------------
  {
    id: "fallback_client",
    content: "I'm not sure I understand your question about the app. Could you provide more details or rephrase it?",
    clientOnly: true,
    category: ProximityCategory.APP_SPECIFIC,
    conditions: [],
  },
  {
    id: "fallback_llm",
    content: "Let me think about that...",
    clientOnly: false, // This will be replaced by LLM response
    category: ProximityCategory.GENERAL_KNOWLEDGE,
    conditions: [],
  },
]
