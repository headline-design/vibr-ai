import { DesignSystemShowcase } from "@/components/design-system-showcase"

import ActionBar from "@/components/layout/header/action-bar";
import RustHeader from "@/components/layout/header/rust-header";
import MaxWidthWrapper from "@/components/layout/max-width-wrapper";


export default function DesignSystemPage() {

  const page = {
    title: "Design System",
    description: "Explore the components and design principles of our system",
    metaTitle: "Design System",
    infoTooltip: false,
  };

  return (
    <>
      <RustHeader page={page} actionBar={<ActionBar page={page} />} />
      <MaxWidthWrapper className="py-6" >

        <div className="space-y-6">
          <DesignSystemShowcase />
        </div>
      </MaxWidthWrapper>
    </>
  )
}
