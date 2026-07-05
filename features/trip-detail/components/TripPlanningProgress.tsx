import { Check, Circle } from "lucide-react";

import { Card, Progress } from "@/components/ui";
import type { PlanningChecklistItem } from "@/features/trip-detail/types/trip-detail";

type TripPlanningProgressProps = {
  progress: number;
  checklist: PlanningChecklistItem[];
};

export function TripPlanningProgress({
  progress,
  checklist,
}: TripPlanningProgressProps) {
  const completed = checklist.filter((item) => item.completed).length;

  return (
    <Card padding="md" className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Planning progress</h2>
          <p className="mt-1 text-sm text-muted">{completed} of {checklist.length} essentials ready</p>
        </div>
        <span className="text-2xl font-semibold tracking-tight text-primary">{progress}%</span>
      </div>

      <Progress value={progress} className="mt-5 h-2.5" />

      <ul className="mt-6 space-y-3">
        {checklist.map((item) => (
          <li key={item.id} className="flex items-center gap-3 text-sm">
            <span className={item.completed ? "flex size-6 items-center justify-center rounded-full bg-success-subtle text-success" : "flex size-6 items-center justify-center rounded-full bg-surface text-muted-foreground"}>
              {item.completed ? <Check className="size-3.5" /> : <Circle className="size-3.5" />}
            </span>
            <span className={item.completed ? "text-foreground" : "text-muted"}>{item.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
