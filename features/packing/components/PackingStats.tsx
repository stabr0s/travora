import { CheckCheck, ListChecks, PackageCheck, Users } from "lucide-react";

import { Card } from "@/components/ui";
import type { PackingItem } from "@/features/packing/types/packing";

type PackingStatsProps = {
  items: PackingItem[];
  mode?: "shared" | "personal";
};

export function PackingStats({ items, mode = "shared" }: PackingStatsProps) {
  const packedCount = items.filter((item) => item.isPacked).length;
  const completion = items.length
    ? Math.round((packedCount / items.length) * 100)
    : 0;
  const stats = [
    { label: "Total items", value: items.length, icon: ListChecks },
    { label: mode === "personal" ? "Packed by you" : "Packed", value: packedCount, icon: PackageCheck },
    { label: "Shared items", value: items.filter((item) => item.isShared).length, icon: Users },
    { label: mode === "personal" ? "Your completion" : "Completion", value: `${completion}%`, icon: CheckCheck },
  ];

  return (
    <section aria-label="Packing statistics" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
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
