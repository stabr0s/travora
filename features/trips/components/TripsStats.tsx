import { Archive, CalendarClock, Map, Route } from "lucide-react";

import { Card } from "@/components/ui";
import type { Trip } from "@/features/trips/types/trip";

type TripsStatsProps = {
  trips: Trip[];
};

export function TripsStats({ trips }: TripsStatsProps) {
  const stats = [
    { label: "All trips", value: trips.length, icon: Map },
    {
      label: "Planning",
      value: trips.filter((trip) => trip.status === "planning").length,
      icon: Route,
    },
    {
      label: "Upcoming",
      value: trips.filter((trip) => trip.status === "upcoming").length,
      icon: CalendarClock,
    },
    {
      label: "Archived",
      value: trips.filter((trip) => trip.status === "archived").length,
      icon: Archive,
    },
  ];

  return (
    <section aria-label="Trip statistics" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} padding="sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted sm:text-sm">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
              </div>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle sm:size-10">
                <Icon className="size-4 text-primary sm:size-5" strokeWidth={1.75} />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
