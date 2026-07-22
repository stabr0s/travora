import { Card } from "@/components/ui";
import type { Place } from "@/features/places/types/place";

type PlacesStatsProps = {
  places: Place[];
};

export function PlacesStats({ places }: PlacesStatsProps) {
  const stats = [
    { label: "Total", value: places.length },
    {
      label: "Must see",
      value: places.filter((place) => place.priority === "must-see").length,
    },
    {
      label: "Planned",
      value: places.filter((place) => place.status === "planned").length,
    },
    {
      label: "Visited",
      value: places.filter((place) => place.status === "visited").length,
    },
  ];

  return (
    <Card padding="none" className="overflow-hidden">
      <section aria-label="Place statistics" className="grid grid-cols-2 divide-y divide-border-subtle sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between gap-3 px-3 py-2.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
            <p className="text-base font-semibold tracking-tight text-foreground">{stat.value}</p>
          </div>
        ))}
      </section>
    </Card>
  );
}
