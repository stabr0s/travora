import Link from "next/link";
import { EmptyState } from "@/components/ui";
import { NewTripCard } from "@/features/trips/components/NewTripCard";
import { TripCard } from "@/features/trips/components/TripCard";
import type { OrganizedTripGroup } from "@/features/trips/utils/trip-organization";
import { SearchX } from "lucide-react";

type TripsGridProps = {
  groups: OrganizedTripGroup[];
  showNewTripCard?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
};

export function TripsGrid({
  groups,
  showNewTripCard = true,
  emptyTitle = "No trips in this view",
  emptyDescription = "Try another filter or create a new trip to get started.",
  emptyAction,
}: TripsGridProps) {
  const tripCount = groups.reduce((total, group) => total + group.trips.length, 0);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`trip-group-${group.id}`}>
          <div className="mb-3 flex items-center gap-2">
            <h2
              id={`trip-group-${group.id}`}
              className="text-base font-semibold tracking-tight text-foreground"
            >
              {group.label}
            </h2>
            <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-muted">
              {group.trips.length}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {group.trips.map((trip) => <TripCard key={trip.id} trip={trip} />)}
          </div>
        </section>
      ))}

      {tripCount === 0 ? (
        <EmptyState
          icon={SearchX}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      ) : null}

      {showNewTripCard ? (
        <section className="grid md:grid-cols-2 xl:grid-cols-3" aria-label="Create trip">
          <NewTripCard />
        </section>
      ) : null}
    </div>
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
