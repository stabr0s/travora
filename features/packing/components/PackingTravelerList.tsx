import { UserRound } from "lucide-react";

import { Badge, Card, Progress } from "@/components/ui";
import type {
  PackingItem,
  PackingTraveler,
} from "@/features/packing/types/packing";

type PackingTravelerListProps = {
  travelers: PackingTraveler[];
  items: PackingItem[];
};

export function PackingTravelerList({
  travelers,
  items,
}: PackingTravelerListProps) {
  return (
    <Card padding="md" className="hover:shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
          <UserRound className="size-5 text-primary" />
        </span>
        <div>
          <h2 className="font-semibold tracking-tight text-foreground">Travelers</h2>
          <p className="mt-1 text-sm text-muted">Personal item assignments at a glance.</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {travelers.map((traveler) => {
          const assignedItems = items.filter((item) => item.assignedTo === traveler.id);
          const packedItems = assignedItems.filter((item) => item.isPacked).length;
          const percentage = assignedItems.length
            ? Math.round((packedItems / assignedItems.length) * 100)
            : 0;

          return (
            <div key={traveler.id} className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-surface text-xs font-semibold text-primary">
                    {traveler.name.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{traveler.name}</p>
                    <p className="text-xs text-muted">{packedItems}/{assignedItems.length} packed</p>
                  </div>
                </div>
                {traveler.role ? <Badge variant="outline">{traveler.role}</Badge> : null}
              </div>
              <Progress value={percentage} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
