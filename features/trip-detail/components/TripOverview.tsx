import { Route } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import { TripPlanningProgress } from "@/features/trip-detail/components/TripPlanningProgress";
import { TripSummaryCards } from "@/features/trip-detail/components/TripSummaryCards";
import { TripTimelinePreview } from "@/features/trip-detail/components/TripTimelinePreview";
import type { TripDetail } from "@/features/trip-detail/types/trip-detail";

type TripOverviewProps = {
  trip: TripDetail;
};

export function TripOverview({ trip }: TripOverviewProps) {
  return (
    <div className="space-y-6">
      <TripSummaryCards trip={trip} />

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="space-y-6 xl:col-span-3">
          <Card padding="md">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
                <Route className="size-5 text-primary" />
              </span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Main route</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  The key stops shaping this journey. Detailed day planning will be added in a future module.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {trip.mainCities.map((city, index) => (
                    <div key={city} className="flex items-center gap-2">
                      <Badge variant="outline">{city}</Badge>
                      {index < trip.mainCities.length - 1 ? (
                        <span className="text-muted-foreground">→</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <TripTimelinePreview items={trip.timelinePreview} />
        </div>

        <div className="xl:col-span-2">
          <TripPlanningProgress
            progress={trip.planningProgress}
            checklist={trip.planningChecklist}
          />
        </div>
      </div>
    </div>
  );
}
