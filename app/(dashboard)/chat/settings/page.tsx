import ActionBar from "@/components/layout/header/action-bar"
import RustHeader from "@/components/layout/header/rust-header"
import MaxWidthWrapper from "@/components/layout/max-width-wrapper"
import ChatSettingsClient from "./client-page"

export default function ChatSettings() {


  const page = {
    title: "Chat Settings",
    description: "Configure your chat settings and preferences",
    metaTitle: "Chat Settings",
    infoTooltip: false,
  };


  return (
    <>
      <RustHeader page={page} actionBar={<ActionBar page={page} />} />
      <MaxWidthWrapper className="py-6" >

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ChatSettingsClient />
        </div>
      </MaxWidthWrapper>
    </>
  )
}
