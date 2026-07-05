import { Luggage } from "lucide-react";

import { EmptyState, SectionHeader } from "@/components/ui";

export default function PackingPage() {
  return (
    <>
      <SectionHeader
        title="Packing"
        description="Shared and personal packing lists to prepare for every trip."
      />

      <EmptyState
        icon={Luggage}
        title="No packing lists"
        description="Create a trip to start building shared and personal packing checklists."
      />
    </>
  );
}
