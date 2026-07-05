import { Building2, Clock3, MapPinned, Route } from "lucide-react";

import { Card } from "@/components/ui";
import type { MapItem, RouteSummary } from "@/features/map/types/map";

type MapStatsProps = {
  items: MapItem[];
  route: RouteSummary;
};

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function MapStats({ items, route }: MapStatsProps) {
  const stats = [
    { label: "Total points", value: items.length, icon: MapPinned },
    {
      label: "Planned points",
      value: items.filter((item) => item.status === "planned").length,
      icon: Route,
    },
    {
      label: "Cities",
      value: new Set(items.map((item) => item.city)).size,
      icon: Building2,
    },
    {
      label: "Route time",
      value: formatDuration(route.estimatedMinutes),
      icon: Clock3,
    },
  ];

  return (
    <section aria-label="Map statistics" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} padding="sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted sm:text-sm">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{stat.value}</p>
              </div>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
                <Icon className="size-4 text-primary" strokeWidth={1.75} />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
