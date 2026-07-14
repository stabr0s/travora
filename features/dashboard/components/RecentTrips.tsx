import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { DashboardTripSummary } from "@/features/dashboard/types/dashboard";

const statusVariants = {
  planning: "default",
  upcoming: "success",
  archived: "outline",
} as const;

const roleLabels = {
  owner: "Owner",
  editor: "Editor",
  viewer: "Viewer",
} as const;

type RecentTripsProps = {
  trips: DashboardTripSummary[];
};

export function RecentTrips({ trips }: RecentTripsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent trips</CardTitle>
        <CardDescription>Your latest saved trip workspaces.</CardDescription>
      </CardHeader>

      {trips.length === 0 ? (
        <p className="pt-4 text-sm text-muted">
          Create your first trip to see it here.
        </p>
      ) : (
        <ul className="divide-y divide-border-subtle pt-2">
          {trips.map((trip) => (
            <li key={trip.id} className="py-3 first:pt-0 last:pb-0">
              <Link
                href={`/trips/${trip.id}`}
                className="flex items-start gap-3 rounded-xl transition-colors hover:bg-surface"
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface">
                  <CalendarDays className="size-4 text-primary" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {trip.title}
                    </span>
                    <Badge variant={statusVariants[trip.status]} className="shrink-0 capitalize">
                      {trip.status}
                    </Badge>
                    {trip.role ? (
                      <Badge variant="outline" className="shrink-0">
                        {roleLabels[trip.role]}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {trip.country} · {trip.dateLabel}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
