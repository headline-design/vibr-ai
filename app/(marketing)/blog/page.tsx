import type { Metadata } from "next"
import Link from "next/link"
import { allBlogs } from "contentlayer/generated"
import { compareDesc } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { BackToTop } from "@/components/back-to-top"
import { OgCardImage } from "@/components/blog/og-card-image"

export const metadata: Metadata = {
  title: "Blog | Vibr",
  description: "Latest news, updates, and insights from the Vibr team",
}

export default function BlogPage() {
  const posts = allBlogs
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))



  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Vibr Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Latest news, updates, and insights from the Vibr team
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Card key={post.slug} className="overflow-hidden flex flex-col h-full">
                <div className="aspect-video relative overflow-hidden">
                  <OgCardImage
                    title={post.title}
                    description={post.description}
                    fallbackImage={"/placeholder.svg?height=400&width=600"}
                    width={600}
                    height={340}
                    className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    alt={post.title}
                  />
                  </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {post.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.featured && (
                      <Badge variant="default" className="bg-primary text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>5 min read</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/blog/${post.slugAsParams}`}
                    className="text-primary font-medium flex items-center hover:underline"
                  >
                    Read more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No posts yet</h2>
            <p className="text-muted-foreground">Check back soon for new content!</p>
          </div>
        )}
      </div>

      <BackToTop />
    </div>
  )
}
