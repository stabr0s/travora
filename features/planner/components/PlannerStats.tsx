import { CalendarDays, Clock3, ListChecks, LockKeyhole } from "lucide-react";

import { Card } from "@/components/ui";
import type { PlannerDay } from "@/features/planner/types/planner";

type PlannerStatsProps = {
  days: PlannerDay[];
};

export function PlannerStats({ days }: PlannerStatsProps) {
  const items = days.flatMap((day) => day.items);
  const totalMinutes = items.reduce(
    (total, item) => total + (item.durationMinutes ?? 0),
    0,
  );
  const stats = [
    { label: "Trip days", value: days.length, icon: CalendarDays },
    { label: "Planned items", value: items.length, icon: ListChecks },
    {
      label: "Fixed items",
      value: items.filter((item) => item.isFixed).length,
      icon: LockKeyhole,
    },
    {
      label: "Estimated time",
      value: `${Math.round(totalMinutes / 60)}h`,
      icon: Clock3,
    },
  ];

  return (
    <section aria-label="Planner statistics" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
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
