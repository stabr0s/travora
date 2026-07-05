import { Clock3, Navigation, Route } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { RouteSummary } from "@/features/map/types/map";

type RouteSummaryCardProps = {
  route: RouteSummary;
  pointsCount: number;
};

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function RouteSummaryCard({
  route,
  pointsCount,
}: RouteSummaryCardProps) {
  return (
    <Card padding="md" className="hover:shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <Route className="size-5 text-primary" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold tracking-tight text-foreground">Route snapshot</h2>
              <Badge variant="outline" className="capitalize">{route.transportMode}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">A visual estimate across {pointsCount} saved points.</p>
          </div>
        </div>
        <div className="flex gap-6 sm:text-right">
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted sm:justify-end">
              <Navigation className="size-3.5" />Distance
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">{route.distanceKm} km</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted sm:justify-end">
              <Clock3 className="size-3.5" />Travel time
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">{formatDuration(route.estimatedMinutes)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
