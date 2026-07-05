import { CalendarX2, Hotel } from "lucide-react";

import { Badge, Card, EmptyState } from "@/components/ui";
import { DayLoadIndicator } from "@/features/planner/components/DayLoadIndicator";
import { PlanItemCard } from "@/features/planner/components/PlanItemCard";
import type { PlannerDay } from "@/features/planner/types/planner";

type DayPlanCardProps = {
  day: PlannerDay;
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function DayPlanCard({ day }: DayPlanCardProps) {
  const items =
    day.mode === "scheduled"
      ? [...day.items].sort((a, b) =>
          (a.startTime ?? "99:99").localeCompare(b.startTime ?? "99:99"),
        )
      : day.items;

  return (
    <Card padding="md" className="hover:shadow-sm">
      <div className="flex flex-col gap-5 border-b border-border-subtle pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Day {day.dayNumber} · {day.city}
            </h2>
            <Badge variant="outline">
              {day.mode === "scheduled" ? "Scheduled" : "Ordered"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted">{formatDate(day.date)}</p>
          {day.baseLocation ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
              <Hotel className="size-3.5" />
              Base: {day.baseLocation}
            </p>
          ) : null}
        </div>
        <DayLoadIndicator value={day.loadPercentage} />
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          title="This day is wide open"
          description="Add the first place, meal, or travel anchor when you are ready to shape this day."
          className="mt-6 min-h-72"
        />
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-[3.5rem_1fr] gap-3 sm:grid-cols-[4.5rem_1fr]">
              <div className="relative pt-4 text-right">
                {index < items.length - 1 ? (
                  <span className="absolute right-[-0.7rem] top-8 h-[calc(100%+0.75rem)] w-px bg-border" />
                ) : null}
                <span className="text-xs font-semibold text-muted">
                  {day.mode === "scheduled" ? item.startTime ?? "Anytime" : `Stop ${index + 1}`}
                </span>
                <span className="absolute right-[-0.95rem] top-[1.15rem] size-2.5 rounded-full border-2 border-surface-elevated bg-primary ring-2 ring-primary-subtle" />
              </div>
              <PlanItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
