import { CheckCircle2, Eye, MapPin, Star } from "lucide-react";

import { Card } from "@/components/ui";
import type { Place } from "@/features/places/types/place";

type PlacesStatsProps = {
  places: Place[];
};

export function PlacesStats({ places }: PlacesStatsProps) {
  const stats = [
    { label: "Total places", value: places.length, icon: MapPin },
    {
      label: "Must see",
      value: places.filter((place) => place.priority === "must-see").length,
      icon: Star,
    },
    {
      label: "Planned",
      value: places.filter((place) => place.status === "planned").length,
      icon: Eye,
    },
    {
      label: "Visited",
      value: places.filter((place) => place.status === "visited").length,
      icon: CheckCircle2,
    },
  ];

  return (
    <section aria-label="Place statistics" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} padding="sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted sm:text-sm">{stat.label}</p>
                <p className="mt-0.5 text-xl font-semibold tracking-tight text-foreground">{stat.value}</p>
              </div>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-subtle">
                <Icon className="size-4 text-primary" strokeWidth={1.75} />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
