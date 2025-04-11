"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function TechStack() {
  const technologies = [
    {
      name: "Next.js",
      description: "React framework with hybrid static & server rendering",
      logo: "/nextjs-logo-minimal.png",
    },
    {
      name: "Supabase",
      description: "Open source Firebase alternative with PostgreSQL",
      logo: "/supabase-logo-abstract.png",
    },
    {
      name: "TypeScript",
      description: "Strongly typed programming language for JavaScript",
      logo: "/typescript-logo-abstract.png",
    },
    {
      name: "Tailwind CSS",
      description: "Utility-first CSS framework for rapid UI development",
      logo: "/tailwind-css-abstract.png",
    },
    {
      name: "Vercel",
      description: "Platform for frontend frameworks and static sites",
      logo: "/vercel-logo-minimalist.png",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built With Modern Tech</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Leveraging the latest technologies for a powerful developer experience
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="relative w-16 h-16 mb-4">
                <Image
                  src={tech.logo || "/placeholder.svg"}
                  alt={`${tech.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-medium mb-1">{tech.name}</h3>
              <p className="text-sm text-muted-foreground">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
