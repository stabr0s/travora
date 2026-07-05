import { MapPin, Plus } from "lucide-react";

import { Button, EmptyState, SectionHeader } from "@/components/ui";

export default function TripsPage() {
  return (
    <>
      <SectionHeader
        title="Trips"
        description="All your travel plans in one organized place."
        action={
          <Button size="md">
            <Plus className="size-4" />
            New trip
          </Button>
        }
      />

      <EmptyState
        icon={MapPin}
        title="No trips planned"
        description="Add a trip to begin collecting places, building itineraries, and sharing plans with others."
        action={
          <Button variant="outline" size="md">
            <Plus className="size-4" />
            Add trip
          </Button>
        }
      />
    </>
  );
}
