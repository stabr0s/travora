import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { NextTrip } from "@/features/dashboard/types/dashboard";

type NextTripCardProps = {
  trip: NextTrip;
};

function formatDateRange(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  const yearFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: "UTC" });

  if (!endDate) return `From ${formatter.format(start)}, ${yearFormatter.format(start)}`;

  const end = new Date(endDate);
  return `${formatter.format(start)} – ${formatter.format(end)}, ${yearFormatter.format(end)}`;
}

function formatCurrency(amount: number | null, currency: string): string {
  if (amount === null) return "Budget not set";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("en-US")} ${currency}`;
  }
}

export function NextTripCard({ trip }: NextTripCardProps) {
  return (
    <Card padding="none" className="relative overflow-hidden">
      <Link
        href={`/trips/${trip.id}`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
        aria-label={`Open ${trip.title}`}
      />

      <div className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">Current trip</Badge>
              <span className="text-xs font-medium text-muted">{trip.country}</span>
            </div>
            <h3 className="mt-2 break-words text-xl font-semibold tracking-tight text-foreground">
              {trip.title}
            </h3>
          </div>
          <Link
            href={`/trips/${trip.id}`}
            className="relative z-20 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover sm:w-auto"
          >
            View trip
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-4 grid gap-3 border-t border-border-subtle pt-3 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4 shrink-0 text-muted-foreground" />
                {formatDateRange(trip.startDate, trip.endDate)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4 shrink-0 text-muted-foreground" />
                {trip.participants === null ? "Travelers not connected" : `${trip.participants} travelers`}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                {trip.placesCount === null ? "Places not connected" : `${trip.placesCount} places`}
              </span>
            </div>

            {trip.progress === null ? (
              <div className="rounded-lg bg-surface px-3 py-2 text-sm text-muted">
                Trip preparation is connected inside the trip workspace.
              </div>
            ) : (
              <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Trip preparation</span>
                <span className="text-muted">{trip.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${trip.progress}%` }}
                />
              </div>
            </div>
            )}
          </div>

          <div className="rounded-lg border border-border-subtle bg-surface px-3 py-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Cost per person
            </p>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {formatCurrency(trip.costPerPerson, trip.currency)}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {trip.daysUntil === null ? "Flexible dates" : `${trip.daysUntil} days until departure`}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
