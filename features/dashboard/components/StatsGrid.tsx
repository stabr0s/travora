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
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = statIcons[index] ?? MapPin;

        return (
          <Card key={stat.id} padding="md" className="hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted">{stat.label}</p>
                <p className="text-3xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
                {stat.change ? (
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                ) : null}
              </div>

              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle",
                )}
              >
                <Icon className="size-5 text-primary" strokeWidth={1.75} />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
