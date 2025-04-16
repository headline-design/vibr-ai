import ActionBar from "@/components/layout/header/action-bar";
import RustHeader from "@/components/layout/header/rust-header";
import MaxWidthWrapper from "@/components/layout/max-width-wrapper";
import ChatToolsClient from "./chat-tools-client";


export default function ChatTools() {

  const page = {
    title: "AI Tools",
    description: "Explore and utilize various AI tools to enhance your chat experience",
    metaTitle: "AI Tools",
    infoTooltip: false,
  };

  return (
    <>
      <RustHeader page={page} actionBar={<ActionBar page={page} />} />
      <MaxWidthWrapper className="py-6" >

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ChatToolsClient />
        </div>
      </MaxWidthWrapper>
    </>
  )
}
