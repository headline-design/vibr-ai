import RustHeader from "@/components/layout/header/rust-header";
import ChatClient from "./chat-client";
import ActionBar from "@/components/layout/header/action-bar";
import MaxWidthWrapper from "@/components/layout/max-width-wrapper";

export default function ChatPage() {

  const page = {
    title: "Vibr Chat",
    description: "Experience our intelligent AI assistant with advanced conversation capabilities",
    metaTitle: "Vibr Chat",
    infoTooltip: false,
  };

  return (
    <>
     <RustHeader page={page} actionBar={<ActionBar page={page} />} />
      <MaxWidthWrapper className="py-6" >
      <ChatClient />
      </MaxWidthWrapper>
    </>
  );
}
