import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Printer } from "lucide-react";

import { Badge } from "@/components/ui";
import type { PersistedTrip } from "@/features/trips/types/persisted-trip";

type PersistedTripHeroProps = {
  trip: PersistedTrip;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  }).format(new Date(value));
}

function formatDateRange(startDate: string | null, endDate: string | null) {
  if (startDate && endDate) return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  if (startDate) return `From ${formatDate(startDate)}`;
  if (endDate) return `Until ${formatDate(endDate)}`;
  return "No dates yet";
}

export function PersistedTripHero({ trip }: PersistedTripHeroProps) {
  return (
    <section className="relative min-h-72 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-700 via-blue-600 to-cyan-400 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />
      <div className="relative flex min-h-72 flex-col justify-between p-5 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/trips"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-black/15 px-4 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/25"
            >
              <ArrowLeft className="size-4" />
              All trips
            </Link>
            <Link
              href={`/trips/${trip.id}/summary`}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-4 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              <Printer className="size-4" />
              Print summary
            </Link>
          </div>
          <Badge className="border-white/20 bg-white/90 capitalize">
            {trip.status || "planning"}
          </Badge>
        </div>
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-white/80">
            <MapPin className="size-4" />
            {trip.destination || "Destination not set"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {trip.title}
          </h1>
          {trip.description ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              {trip.description}
            </p>
          ) : null}
          <p className="mt-5 flex items-center gap-2 text-sm text-white/85">
            <CalendarDays className="size-4" />
            {formatDateRange(trip.start_date, trip.end_date)}
          </p>
        </div>
      </div>
    </section>
  );
}
