import Link from "next/link";
import { EmptyState } from "@/components/ui";
import { NewTripCard } from "@/features/trips/components/NewTripCard";
import { TripCard } from "@/features/trips/components/TripCard";
import type { Trip } from "@/features/trips/types/trip";
import { SearchX } from "lucide-react";

type TripsGridProps = {
  trips: Trip[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
};

export function TripsGrid({
  trips,
  emptyTitle = "No trips in this view",
  emptyDescription = "Try another filter or create a new trip to get started.",
  emptyAction,
}: TripsGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}

      {trips.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={emptyTitle}
          description={emptyDescription}
          className="md:col-span-2 xl:col-span-2"
          action={emptyAction}
        />
      ) : null}

      <NewTripCard />
    </section>
  );
}

export function createFirstTripAction() {
  return (
    <Link
      href="/trips/new"
      className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
    >
      Create your first trip
    </Link>
  );
}
