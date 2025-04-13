import { allBlogs, allLegals } from "contentlayer/generated"
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vibr.ai"

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ]

  // Blog routes
  const blogRoutes = allBlogs.map((post) => ({
    url: `${baseUrl}/blog/${post.slugAsParams}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Legal routes
  const legalRoutes = allLegals.map((doc) => ({
    url: `${baseUrl}/legal/${doc.slugAsParams}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...blogRoutes, ...legalRoutes]
}
