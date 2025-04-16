import ActionBar from "@/components/layout/header/action-bar";
import RustHeader from "@/components/layout/header/rust-header";
import MaxWidthWrapper from "@/components/layout/max-width-wrapper";
import ChatDebugClient from "./client-page";


export default function ChatDebug() {

  const page = {
    title: "Chat Debug",
    description: "Debug and test your chat interactions with our AI assistant",
    metaTitle: "Chat Debug",
    infoTooltip: false,
  };

  return (
    <>
      <RustHeader page={page} actionBar={<ActionBar page={page} />} />
      <MaxWidthWrapper className="py-6" >

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ChatDebugClient />
        </div>
      </MaxWidthWrapper>
    </>
  )
}
