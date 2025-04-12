"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

export function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "Vibr has completely transformed how I approach coding problems. The AI understands my project context and provides solutions that actually work.",
      author: "Alex Johnson",
      role: "Senior Developer",
      avatar: "/diverse-group-city.png",
      initials: "AJ",
    },
    {
      quote:
        "The Supabase integration is seamless. I can manage my projects and get AI assistance all in one place. Game changer for my workflow.",
      author: "Samantha Lee",
      role: "Full Stack Engineer",
      avatar: "/diverse-group-city.png",
      initials: "SL",
    },
    {
      quote:
        "As a Next.js developer, having an AI assistant that understands the framework's nuances has boosted my productivity by at least 40%.",
      author: "Michael Chen",
      role: "Frontend Developer",
      avatar: "/diverse-group-city.png",
      initials: "MC",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">What Developers Are Saying</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from developers who have integrated Vibr into their workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-muted/50 rounded-xl p-2 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <svg
                        className="h-8 w-8 text-primary/40"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                    </div>
                    <p className="text-lg mb-6 flex-1">{testimonial.quote}</p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                        <AvatarFallback>{testimonial.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
