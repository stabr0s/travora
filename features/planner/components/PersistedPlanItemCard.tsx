import {
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  Clock3,
  XCircle,
} from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type { PersistedPlannerItem } from "@/features/planner/types/persisted-planner";

type PersistedPlanItemCardProps = {
  item: PersistedPlannerItem;
  isPending?: boolean;
  onDelete?: (item: PersistedPlannerItem) => void;
  onEdit?: (item: PersistedPlannerItem) => void;
};

const statusDetails = {
  planned: { label: "Planned", variant: "default" as const, icon: CircleDashed },
  completed: { label: "Completed", variant: "success" as const, icon: CheckCircle2 },
  cancelled: { label: "Cancelled", variant: "error" as const, icon: XCircle },
};

function formatTime(value: string) {
  return value.slice(0, 5);
}

export function PersistedPlanItemCard({ item, isPending, onDelete, onEdit }: PersistedPlanItemCardProps) {
  const status = statusDetails[item.status || "planned"];
  const StatusIcon = status.icon;

  return (
    <Card padding="sm">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
          <CalendarClock className="size-5 text-primary" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold tracking-tight text-foreground">{item.title}</h3>
              {item.description ? (
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.type ? <Badge variant="outline" className="capitalize">{item.type}</Badge> : null}
              <Badge variant={status.variant}>
                <StatusIcon className="mr-1 size-3" />
                {status.label}
              </Badge>
            </div>
          </div>

          {item.start_time || item.end_time ? (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
              <Clock3 className="size-3.5" />
              {item.start_time ? formatTime(item.start_time) : "No start time"}
              {item.end_time ? ` – ${formatTime(item.end_time)}` : ""}
            </div>
          ) : null}
          {onEdit && onDelete ? (
            <div className="mt-4 flex gap-2 border-t border-border-subtle pt-3">
              <Button size="sm" variant="outline" onClick={() => onEdit(item)} disabled={isPending}>Edit</Button>
              <Button size="sm" variant="ghost" className="text-error" onClick={() => onDelete(item)} disabled={isPending}>Delete</Button>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
