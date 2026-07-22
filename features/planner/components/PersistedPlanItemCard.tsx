import {
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDashed,
  Clock3,
  MapPin,
  XCircle,
} from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type { PersistedPlace } from "@/features/places/types/persisted-place";
import type { PersistedPlannerItem } from "@/features/planner/types/persisted-planner";

type PersistedPlanItemCardProps = {
  item: PersistedPlannerItem;
  linkedPlace?: PersistedPlace;
  isPending?: boolean;
  onDelete?: (item: PersistedPlannerItem) => void;
  onEdit?: (item: PersistedPlannerItem) => void;
  onMoveDown?: (item: PersistedPlannerItem) => void;
  onMoveUp?: (item: PersistedPlannerItem) => void;
};

const statusDetails = {
  planned: { label: "Planned", variant: "default" as const, icon: CircleDashed },
  completed: { label: "Completed", variant: "success" as const, icon: CheckCircle2 },
  cancelled: { label: "Cancelled", variant: "error" as const, icon: XCircle },
};

function formatTime(value: string) {
  return value.slice(0, 5);
}

function formatItemTime(item: PersistedPlannerItem) {
  if (item.start_time && item.end_time) {
    return `${formatTime(item.start_time)} – ${formatTime(item.end_time)}`;
  }
  if (item.start_time) return formatTime(item.start_time);
  if (item.end_time) return `Until ${formatTime(item.end_time)}`;
  return "Flexible";
}

function formatType(value: string | null) {
  if (!value) return null;
  return value.replace("-", " ");
}

export function PersistedPlanItemCard({
  item,
  linkedPlace,
  isPending,
  onDelete,
  onEdit,
  onMoveDown,
  onMoveUp,
}: PersistedPlanItemCardProps) {
  const status = statusDetails[item.status || "planned"];
  const StatusIcon = status.icon;
  const location = linkedPlace
    ? [linkedPlace.title, linkedPlace.city].filter(Boolean).join(" · ")
    : null;

  return (
    <Card padding="sm" className="bg-background/70">
      <div className="flex flex-col gap-3 sm:flex-row">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
          <CalendarClock className="size-5 text-primary" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-foreground">
                <Clock3 className="size-3.5 text-primary" />
                {formatItemTime(item)}
              </p>
              <h3 className="mt-2 break-words text-base font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              {location ? (
                <p className="mt-1 inline-flex max-w-full items-center gap-1.5 break-words text-sm text-muted">
                  <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 break-words">{location}</span>
                </p>
              ) : null}
              {item.description ? (
                <p className="mt-2 line-clamp-3 break-words text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-wrap gap-1.5">
              {linkedPlace ? <Badge variant="outline">Saved place</Badge> : null}
              {formatType(item.type) ? (
                <Badge variant="outline" className="capitalize">{formatType(item.type)}</Badge>
              ) : null}
              <Badge variant={status.variant}>
                <StatusIcon className="mr-1 size-3" />
                {status.label}
              </Badge>
            </div>
          </div>

          {onEdit && onDelete ? (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border-subtle pt-3">
              {onMoveUp ? (
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => onMoveUp(item)} disabled={isPending}>
                  <ChevronUp className="size-4" />
                  Up
                </Button>
              ) : null}
              {onMoveDown ? (
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => onMoveDown(item)} disabled={isPending}>
                  <ChevronDown className="size-4" />
                  Down
                </Button>
              ) : null}
              <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => onEdit(item)} disabled={isPending}>Edit</Button>
              <Button size="sm" variant="ghost" className="flex-1 text-error sm:flex-none" onClick={() => onDelete(item)} disabled={isPending}>Delete</Button>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
