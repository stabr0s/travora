import Link from "next/link";
import { CalendarDays, MapPin, Settings, Users } from "lucide-react";

import { Badge, Card, Progress } from "@/components/ui";
import type { Trip, TripRole, TripStatus } from "@/features/trips/types/trip";
import { cn } from "@/lib/utils";

const statusDetails: Record<TripStatus, { label: string; variant: "default" | "success" | "outline" }> = {
  planning: { label: "Planning", variant: "default" },
  upcoming: { label: "Upcoming", variant: "success" },
  archived: { label: "Archived", variant: "outline" },
};

const roleDetails: Record<TripRole, { label: string; variant: "default" | "warning" | "outline" }> = {
  owner: { label: "Owner", variant: "default" },
  editor: { label: "Editor", variant: "warning" },
  viewer: { label: "Viewer", variant: "outline" },
};

type TripCardProps = {
  trip: Trip;
};

function formatDateRange(startDate: string | null, endDate: string | null): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  if (startDate && endDate) {
    return `${formatter.format(new Date(startDate))} – ${formatter.format(new Date(endDate))}`;
  }

  if (startDate) {
    return `From ${formatter.format(new Date(startDate))}`;
  }

  if (endDate) {
    return `Until ${formatter.format(new Date(endDate))}`;
  }

  return "No dates yet";
}

function formatTimestamp(value: string | null | undefined): string | null {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      currency,
      maximumFractionDigits: 0,
      style: "currency",
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("en-US")} ${currency}`;
  }
}

export function TripCard({ trip }: TripCardProps) {
  const status = statusDetails[trip.status];
  const role = trip.role ? roleDetails[trip.role] : null;
  const activityDate = formatTimestamp(trip.updatedAt || trip.createdAt);

  return (
    <Card padding="none" className="group relative flex h-full flex-col overflow-hidden">
      <Link
        href={`/trips/${trip.id}`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
        aria-label={`Open ${trip.title}`}
      />

      <div className={cn("h-1 bg-gradient-to-r", trip.coverGradient)} />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="break-words text-base font-semibold tracking-tight text-foreground">{trip.title}</h2>
            <p className="mt-1 break-words text-xs font-medium text-muted">{trip.country}</p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
            {trip.isDemo ? <Badge variant="outline">Demo</Badge> : null}
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </div>

        <div className="mt-3 space-y-2 text-sm text-muted">
          <p className="flex items-center gap-2 leading-snug">
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
            {formatDateRange(trip.startDate, trip.endDate)}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
            {role ? <Badge variant={role.variant}>{role.label}</Badge> : null}
            <span className="inline-flex items-center gap-2">
              <Users className="size-3.5 text-muted-foreground" />
              {trip.participants === null
                ? "Travelers not connected"
                : `${trip.participants} travelers`}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-3.5 text-muted-foreground" />
              {trip.placesCount === null
                ? "Places not connected"
                : `${trip.placesCount} places`}
            </span>
          </div>
        </div>

        {trip.progress === null ? (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-xs">
            <span className="font-medium text-foreground">Trip preparation</span>
            <span className="text-muted">Planning</span>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Trip preparation</span>
              <span className="text-muted">{trip.progress}%</span>
            </div>
            <Progress value={trip.progress} />
          </div>
        )}

        <div className="mt-3 border-t border-border-subtle pt-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
            <p className="text-xs text-muted">Cost per person</p>
            <p className="mt-0.5 break-words text-base font-semibold tracking-tight text-foreground">
              {trip.costPerPerson === null
                ? "Budget not set"
                : formatCurrency(trip.costPerPerson, trip.currency)}
            </p>
              {activityDate ? (
                <p className="mt-1 text-xs text-muted">Updated {activityDate}</p>
              ) : (
                <p className="mt-1 text-xs text-muted">{trip.currency}</p>
              )}
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              {trip.role === "owner" ? (
                <Link
                  href={`/trips/${trip.id}?tab=settings`}
                  className="relative z-20 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-surface sm:w-auto"
                >
                  <Settings className="size-3.5" />
                  Settings
                </Link>
              ) : null}
              <Link
                href={`/trips/${trip.id}`}
                className="relative z-20 inline-flex h-9 w-full items-center justify-center rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover sm:w-auto"
              >
                Open trip
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
