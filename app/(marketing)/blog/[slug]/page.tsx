import { notFound } from "next/navigation"
import Link from "next/link"
import { allBlogs } from "contentlayer/generated"
import { format, parseISO } from "date-fns"
import { ChevronLeft, Calendar, User, Tag } from "lucide-react"
import { Mdx } from "@/components/docs/mdx-components"
import { Badge } from "@/components/ui/badge"
import { BackToTop } from "@/components/back-to-top"
import { OgPostImage } from "@/components/blog/og-post-image"


interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return allBlogs.map((post) => ({
    slug: post.slugAsParams,
  }))
}

export async function generateMetadata({ params }) {
  const localParams = await params
  const slug = localParams.slug
  const post = allBlogs.find((post) => post.slugAsParams === slug)

  if (!post) {
    return {
      title: "Post Not Found | Vibr",
      description: "The blog post you're looking for doesn't exist",
    }
  }

  return {
    title: `${post.title} | Vibr Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://vibr.ai/blog/${post.slugAsParams}`,
      images: [
        {
          url: post.ogImage || post.image || "https://vibr.ai/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.ogImage || post.image || "https://vibr.ai/og-image.png"],
    },
  }
}

export default async function BlogPostPage({ params }) {
  const localParams = await params
  const slug = localParams.slug
  const post = allBlogs.find((post) => post.slugAsParams === slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/blog" className="text-muted-foreground hover:text-foreground flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to all posts
          </Link>
        </div>

        <article>
          <div className="mb-8">

            <div className="my-8 overflow-hidden rounded-xl border shadow-sm">
              <OgPostImage
                title={post.title}
              />
            </div>


            <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{post.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <time dateTime={post.date}>{format(parseISO(post.date), "MMMM dd, yyyy")}</time>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <Mdx code={post.body.code} />
          </div>
        </article>

        <div className="mt-12 pt-6 border-t">
          <div className="flex justify-between items-center">
            <Link href="/blog" className="text-muted-foreground hover:text-foreground flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to all posts
            </Link>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Vibr AI. All rights reserved.</p>
          </div>
        </div>
      </div>

      <BackToTop />
    </div>
  )
}
