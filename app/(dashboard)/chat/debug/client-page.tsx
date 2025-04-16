"use client"

import dynamic from "next/dynamic"

export default function ChatDebugClient() {

    const DebugClient = dynamic(
        () => import("@/components/debug/debug-client"),
        {
            ssr: false,
        }
    )

    return (
        <>
            <DebugClient />
        </>
    )
}
