import { getHighlighter } from "@shikijs/compat"
import { defineDocumentType, defineNestedType, makeSource } from "contentlayer2/source-files"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import { codeImport } from "remark-code-import"
import remarkGfm from "remark-gfm"

/** @type {import('contentlayer2/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
}

const LinksProperties = defineNestedType(() => ({
  name: "LinksProperties",
  fields: {
    doc: {
      type: "string",
    },
    api: {
      type: "string",
    },
  },
}))

export const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: `docs/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    published: {
      type: "boolean",
      default: true,
    },
    links: {
      type: "nested",
      of: LinksProperties,
    },
    featured: {
      type: "boolean",
      default: false,
      required: false,
    },
    component: {
      type: "boolean",
      default: false,
      required: false,
    },
    toc: {
      type: "boolean",
      default: true,
      required: false,
    },
    icon: {
      type: "string",
      required: false,
    },
  },
  computedFields,
}))

export const Legal = defineDocumentType(() => ({
  name: "Legal",
  filePathPattern: `legal/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    published: {
      type: "boolean",
      default: true,
    },
    icon: {
      type: "string",
      required: false,
    },
    lastUpdated: {
      type: "string",
      required: false,
    },
  },
  computedFields,
}))

export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    date: {
      type: "date",
      required: true,
    },
    published: {
      type: "boolean",
      default: true,
    },
    image: {
      type: "string",
      required: false,
    },
    useOgImage: {
      type: "boolean",
      default: true,
      required: false,
    },
    author: {
      type: "string",
      required: true,
    },
    tags: {
      type: "list",
      of: { type: "string" },
      required: false,
    },
    featured: {
      type: "boolean",
      default: false,
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => {
        // Extract the filename without the blog/ prefix
        const pathSegments = doc._raw.flattenedPath.split("/")
        // If it's in a blog directory, remove that part
        return pathSegments.length > 1
          ? `${pathSegments.slice(1).join("/")}` // Remove the first segment (blog)
          : `${pathSegments[0]}` // If there's no blog prefix, just use the path
      },
    },
    slugAsParams: {
      type: "string",
      resolve: (doc) => {
        const pathSegments = doc._raw.flattenedPath.split("/")
        // If it's in a blog directory, remove that part for the params
        return pathSegments.length > 1
          ? pathSegments
              .slice(1)
              .join("/") // Remove the first segment (blog)
          : pathSegments[0] // If there's no blog prefix, just use the path
      },
    },
    ogImage: {
      type: "string",
      resolve: (doc) => {
        if (!doc.useOgImage) return doc.image || ""
        return `/api/og?title=${encodeURIComponent(doc.title)}&summary=${encodeURIComponent(doc.description || "")}`
      },
    },
  },
}))

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Doc, Legal, Blog],
  mdx: {
    remarkPlugins: [remarkGfm, codeImport],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          getHighlighter,
          onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }]
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("line--highlighted")
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word--highlighted"]
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
})
