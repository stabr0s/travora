import { Map } from "lucide-react";

import { EmptyState, SectionHeader } from "@/components/ui";

export default function MapPage() {
  return (
    <>
      <SectionHeader
        title="Map"
        description="Visualize destinations, routes, and day-by-day plans on an interactive map."
      />

      <EmptyState
        icon={Map}
        title="Map view coming soon"
        description="Select a trip to explore places, routes, and travel anchors on the map."
      />
    </>
  );
}
