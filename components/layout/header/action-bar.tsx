"use client";

import {Button} from "@/components/ui/button";

export default function ActionBar({ page }: { page: any }) {

  const DomainsActionBar = () => {
    return (
      <Button onClick={() => alert(true)} variant="default">
        Add Domain
      </Button>
    );
  };



  if (page?.title === "Domains") return <DomainsActionBar />;
  if (page?.title === "Overview" || page?.metaTitle === "Overview")
    return <DomainsActionBar />;

  return (
    <div className="inline-flex h-10 items-center justify-center space-x-2 whitespace-nowrap rounded px-4 py-2 text-sm opacity-0 transition-all" />
  );
}
