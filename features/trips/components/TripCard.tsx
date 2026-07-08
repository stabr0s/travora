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
  return new Intl.NumberFormat("en-US", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

export function TripCard({ trip }: TripCardProps) {
  const status = statusDetails[trip.status];
  const role = trip.role ? roleDetails[trip.role] : null;
  const activityDate = formatTimestamp(trip.updatedAt || trip.createdAt);

  return (
    <Card padding="none" className="group flex h-full flex-col overflow-hidden">
      <div className={cn("relative flex min-h-44 flex-col justify-between bg-gradient-to-br p-5", trip.coverGradient)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/10" />
        <div className="relative flex justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {trip.isDemo ? (
              <Badge variant="outline" className="border-white/20 bg-white/85 text-slate-700">
                Demo
              </Badge>
            ) : null}
            {role ? <Badge variant={role.variant}>{role.label}</Badge> : null}
          </div>
          <div className="shrink-0">
            <Badge variant={status.variant} className={cn(trip.status !== "archived" && "border-white/20 bg-white/90")}>
              {status.label}
            </Badge>
          </div>
        </div>
        <div className="relative min-w-0">
          <p className="break-words text-sm font-medium text-white/80">{trip.country}</p>
          <h2 className="mt-1 break-words text-xl font-semibold tracking-tight text-white">{trip.title}</h2>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-5 p-5">
        <div className="space-y-2.5 text-sm text-muted">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
            {formatDateRange(trip.startDate, trip.endDate)}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              {trip.participants === null
                ? "Travelers not connected"
                : `${trip.participants} travelers`}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              {trip.placesCount === null
                ? "Places not connected"
                : `${trip.placesCount} places`}
            </span>
          </div>
        </div>

        {trip.progress === null ? (
          <div className="flex items-center justify-between rounded-xl bg-surface px-3 py-2 text-xs">
            <span className="font-medium text-foreground">Trip preparation</span>
            <span className="text-muted">Planning</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Trip preparation</span>
              <span className="text-muted">{trip.progress}%</span>
            </div>
            <Progress value={trip.progress} />
          </div>
        )}

        <div className="mt-auto border-t border-border-subtle pt-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
            <p className="text-xs text-muted">Cost per person</p>
            <p className="mt-0.5 break-words text-lg font-semibold tracking-tight text-foreground">
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
                  className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-surface sm:w-auto"
                >
                  <Settings className="size-3.5" />
                  Settings
                </Link>
              ) : null}
              <Link
                href={`/trips/${trip.id}`}
                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover sm:w-auto"
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
