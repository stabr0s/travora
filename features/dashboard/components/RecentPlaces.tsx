import { MapPin } from "lucide-react";

import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { RecentPlace } from "@/features/dashboard/types/dashboard";
import { cn } from "@/lib/utils";

type RecentPlacesProps = {
  places: RecentPlace[];
};

const priorityLabels = {
  must_see: "Must see",
  recommended: "Recommended",
  optional: "Optional",
} as const;

const statusVariants = {
  planned: "default",
  idea: "outline",
  visited: "success",
} as const;

const priorityVariants = {
  must_see: "warning",
  recommended: "default",
  optional: "outline",
} as const;

export function RecentPlaces({ places }: RecentPlacesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent places</CardTitle>
        <CardDescription>Latest destinations added across your trips.</CardDescription>
      </CardHeader>

      <ul className="divide-y divide-border-subtle pt-2">
        {places.map((place) => (
          <li
            key={place.id}
            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface">
              <MapPin className="size-4 text-primary" strokeWidth={1.75} />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {place.name}
                </p>
                <Badge
                  variant={priorityVariants[place.priority]}
                  className="shrink-0"
                >
                  {priorityLabels[place.priority]}
                </Badge>
              </div>

              <p className="mt-0.5 truncate text-xs text-muted">
                {place.tripTitle} · {place.category}
              </p>
            </div>

            <Badge
              variant={statusVariants[place.status]}
              className={cn("shrink-0 capitalize")}
            >
              {place.status}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
