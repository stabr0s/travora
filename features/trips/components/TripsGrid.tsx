import { EmptyState } from "@/components/ui";
import { NewTripCard } from "@/features/trips/components/NewTripCard";
import { TripCard } from "@/features/trips/components/TripCard";
import type { Trip } from "@/features/trips/types/trip";
import { SearchX } from "lucide-react";

type TripsGridProps = {
  trips: Trip[];
};

export function TripsGrid({ trips }: TripsGridProps) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}

      {trips.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No trips in this view"
          description="Try another filter or create a new trip to get started."
          className="md:col-span-2 xl:col-span-2"
        />
      ) : null}

      <NewTripCard />
    </section>
  );
}
