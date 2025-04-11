import { withPublic } from "@/lib/auth"
import { generateSvgAvatar } from "@/lib/generators/avatar-generator"
import sharp from "sharp"
import type { NextRequest } from "next/server"

interface RouteParams {
  req: NextRequest
  params: { id: string[] }
  searchParams: Record<string, string>
  headers: Record<string, string>
}

// GET /api/www/avatar/[id] – Generate an avatar based on file extension or default to a generic image
export const GET = withPublic(async ({ params, searchParams }: RouteParams) => {
  const requestedPath = Array.isArray(params.id) ? params.id.join("/") : params.id
  const lastIndex = requestedPath.lastIndexOf(".")
  const id = lastIndex !== -1 ? requestedPath.substring(0, lastIndex) : requestedPath
  const ext = lastIndex !== -1 ? requestedPath.substring(lastIndex + 1).toLowerCase() : "generic"

  const size = Number.parseInt(searchParams.s || "80", 10)

  if (ext === "svg") {
    const svgContent = generateSvgAvatar(id, size)
    return new Response(svgContent, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } else if (ext === "png") {
    const svgContent = generateSvgAvatar(id, size)
    const pngBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer()
    return new Response(pngBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } else {
    // Default to serving a PNG but with a generic image content type
    const svgContent = generateSvgAvatar(id, size)
    const pngBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer()
    return new Response(pngBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    })
  }
})
