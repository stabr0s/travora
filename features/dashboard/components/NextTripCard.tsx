import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type { NextTrip } from "@/features/dashboard/types/dashboard";
import { cn } from "@/lib/utils";

type NextTripCardProps = {
  trip: NextTrip;
};

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  const yearFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric" });

  return `${formatter.format(start)} – ${formatter.format(end)}, ${yearFormatter.format(end)}`;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function NextTripCard({ trip }: NextTripCardProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="grid lg:grid-cols-5">
        <div
          className={cn(
            "relative flex min-h-48 flex-col justify-end bg-gradient-to-br p-6 lg:col-span-2 lg:min-h-full",
            trip.coverGradient,
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative space-y-2">
            <Badge variant="outline" className="border-white/30 bg-white/15 text-white">
              Next trip
            </Badge>
            <p className="text-sm font-medium text-white/80">{trip.country}</p>
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              {trip.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 p-6 lg:col-span-3">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4 shrink-0 text-muted-foreground" />
                {formatDateRange(trip.startDate, trip.endDate)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4 shrink-0 text-muted-foreground" />
                {trip.participants} travelers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                {trip.placesCount} places
              </span>
            </div>

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
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Cost per person
              </p>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {formatCurrency(trip.costPerPerson, trip.currency)}
              </p>
              <p className="mt-1 text-sm text-muted">
                {trip.daysUntil} days until departure
              </p>
            </div>

            <Button size="md" className="w-full sm:w-auto">
              View trip
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
