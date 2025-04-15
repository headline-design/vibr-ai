import type { NextRequest } from "next/server"

// Helper to get search params from a request URL
export function getSearchParams(url: string): Record<string, string> {
  const searchParams = new URL(url).searchParams
  const params: Record<string, string> = {}

  searchParams.forEach((value, key) => {
    params[key] = value
  })

  return params
}

// Middleware for public routes
export function withPublic(handler: any) {
  return async (req: NextRequest, { params: localParams }) => {
const params = await localParams
    const searchParams = getSearchParams(req.url)
    return handler({ req, params, searchParams, headers: {} })
  }
}
