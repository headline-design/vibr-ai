"use server"

import { generateText } from "ai"
import { openai } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set

interface TweetGenerationParams {
  projectName: string
  projectDescription: string
}

export async function getLLMResponse(prompt: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: 'You are a helpful assistant!',
      prompt,
      temperature: 0.7,
      maxTokens: 150,
    })
    return text.trim()
  }
  catch (error) {
    console.error("Error generating LLM response:", error)
    return `Failed to generate response. Please try again later.`
  }
}

export async function generateTweet({ projectName, projectDescription }: TweetGenerationParams): Promise<string> {
  try {
    const prompt = `
      Generate a high-engagement tweet for a coding project with the following details:

      Project Name: ${projectName}
      Project Description: ${projectDescription}

      The tweet should:
      - Be concise (max 280 characters)
      - Include relevant hashtags
      - Be exciting and engaging
      - Highlight the key value proposition
      - Encourage clicks/engagement

      Format the tweet ready to post (no quotation marks or additional text).
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: 'You are a friendly assistant!',
      prompt,
      temperature: 0.7,
      maxTokens: 150,
    })

    return text.trim()
  } catch (error) {
    console.error("Error generating tweet:", error)
    return `Failed to generate tweet. Please try again later.`
  }
}

export async function regenerateTweet(params: TweetGenerationParams): Promise<string> {
  // Add some variation to ensure we get a different result
  return generateTweet({
    ...params,
    projectDescription: `${params.projectDescription} (Please provide a different variation)`,
  })
}
