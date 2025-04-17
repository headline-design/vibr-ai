import { Metadata } from "next"

export const metadata: Metadata = {
    title: "VIBR - Vibe coding platform",
    description: "An intelligent coding platform with AI assistance",
  }


export default function AuthLayout({ children }) {
    return (
        <div className="flex flex-col  min-h-screen items-center justify-center bg-background-200 px-4 pt-28 md:pt-32 -mt-[--header-height]">
            {children}
            <div className="h-24 w-full" />
        </div>
    )
}