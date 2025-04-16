"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, AlertCircle, Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function ErrorPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate a page refresh with a slight delay
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  return (


      <>
         <Card className="flex w-[32rem] max-w-full flex-col items-center rounded-lg bg-background-100 p-3 shadow">
            {/* Add logo in circle at the top of the card */}
            <div className="flex flex-col items-center gap-6 py-14">
              <div className="flex size-[80px] items-center justify-center border-solid border-2 border-destructive/20 bg-background p-4 rounded-full  ">
              <AlertCircle className="h-[52px] w-[52px] text-destructive" />
              </div>


          <CardHeader className="text-center pb-2">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground text-sm mt-1">We encountered an error processing your request</p>
          </CardHeader>

          <CardContent className="text-center">
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
              <p className="font-medium">Error: Unable to complete the requested action</p>
              <p className="text-sm mt-1">Please try again or contact support if the problem persists</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row w-full gap-3">
              <Button className="w-full rounded-md h-10" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Try Again
              </Button>

              <Button variant="outline" className="w-full rounded-md h-10" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              If you continue to experience issues, please contact{" "}
              <Link href="mailto:support@vibr.ai" className="text-primary hover:underline">
                support@vibr.ai
              </Link>
            </p>
          </CardFooter>
          </div>
        </Card>
      </>
  )
}
