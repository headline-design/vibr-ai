"use client"

import dynamic from "next/dynamic"

export default function ChatSettingsClient() {

    const SettingsClient = dynamic(
        () => import("@/components/settings/settings-client"),
        {
            ssr: false,
        }
    )

    return (
        <>
            <SettingsClient />
        </>
    )
}
