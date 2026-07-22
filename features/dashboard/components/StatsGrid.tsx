import { Card } from "@/components/ui";
import type { DashboardStat } from "@/features/dashboard/types/dashboard";

type StatsGridProps = {
  stats: DashboardStat[];
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <section className="grid divide-y divide-border-subtle sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.id} className="px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-xl font-semibold tracking-tight text-foreground">{stat.value}</p>
              {stat.change ? <p className="truncate text-xs text-muted">{stat.change}</p> : null}
            </div>
          </div>
        ))}
      </section>
    </Card>
  );
}
