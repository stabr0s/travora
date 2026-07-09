import Link from "next/link";
import { ArrowLeft, CalendarDays, LogIn, MapPin, Printer, UserPlus, Users } from "lucide-react";

import { Badge } from "@/components/ui";
import type {
  TripDetail,
  TripDetailStatus,
} from "@/features/trip-detail/types/trip-detail";
import { cn } from "@/lib/utils";

const statusDetails: Record<
  TripDetailStatus,
  { label: string; variant: "default" | "success" | "outline" }
> = {
  planning: { label: "Planning", variant: "default" },
  upcoming: { label: "Upcoming", variant: "success" },
  archived: { label: "Archived", variant: "outline" },
};

type TripHeroProps = {
  trip: TripDetail;
};

function formatDateRange(startDate: string, endDate: string): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return `${formatter.format(new Date(startDate))} – ${formatter.format(new Date(endDate))}`;
}

export function TripHero({ trip }: TripHeroProps) {
  const status = statusDetails[trip.status];

  return (
    <section
      className={cn(
        "relative min-h-80 overflow-hidden rounded-2xl bg-gradient-to-br shadow-lg",
        trip.coverGradient,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/15" />
      <div className="relative flex min-h-80 flex-col justify-between p-5 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-black/15 px-4 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <ArrowLeft className="size-4" />
              Back to landing
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/90 px-4 text-sm font-medium text-slate-950 backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <UserPlus className="size-4" />
              Get started
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-4 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <LogIn className="size-4" />
              Sign in
            </Link>
            <Link
              href={`/trips/${trip.id}/summary`}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-4 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <Printer className="size-4" />
              Print summary
            </Link>
          </div>
          <Badge variant={status.variant} className="border-white/20 bg-white/90">
            {status.label}
          </Badge>
        </div>

        <div className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
            Demo trip
          </p>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
            <MapPin className="size-4" />
            {trip.country}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {trip.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {trip.description}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
            This is an example trip. Create an account to plan your own.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="size-4" />
              {trip.participantsCount} travelers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
