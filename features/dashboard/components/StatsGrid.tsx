import {
  CalendarDays,
  MapPin,
  Plane,
  Wallet,
} from "lucide-react";

import { Card } from "@/components/ui";
import type { DashboardStat } from "@/features/dashboard/types/dashboard";
import { cn } from "@/lib/utils";

const statIcons = [Plane, MapPin, Wallet, CalendarDays] as const;

type StatsGridProps = {
  stats: DashboardStat[];
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = statIcons[index] ?? MapPin;

        return (
          <Card key={stat.id} padding="sm">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-muted">{stat.label}</p>
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
                {stat.change ? (
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                ) : null}
              </div>

              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-subtle",
                )}
              >
                <Icon className="size-4 text-primary" strokeWidth={1.75} />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
