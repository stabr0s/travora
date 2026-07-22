import type { ChangeEvent } from "react";
import { CalendarDays, CalendarPlus, Clock3, MapPin, Wallet } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type {
  Place,
  PlacePriority,
  PlaceStatus,
} from "@/features/places/types/place";

const priorityDetails: Record<
  PlacePriority,
  { label: string; variant: "warning" | "default" | "outline" }
> = {
  "must-see": { label: "Must see", variant: "warning" },
  recommended: { label: "Recommended", variant: "default" },
  optional: { label: "Optional", variant: "outline" },
};

const statusDetails: Record<
  PlaceStatus,
  { label: string; variant: "default" | "success" | "error" | "outline" }
> = {
  idea: { label: "Idea", variant: "outline" },
  planned: { label: "Planned", variant: "default" },
  visited: { label: "Visited", variant: "success" },
  rejected: { label: "Rejected", variant: "error" },
};

type PlaceCardProps = {
  place: Place;
  isPending?: boolean;
  onDelete?: (place: Place) => void;
  onEdit?: (place: Place) => void;
  onStatusChange?: (place: Place, status: PlaceStatus) => void;
  onAddToPlan?: (place: Place) => void;
  plannedLabel?: string;
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function formatCost(cost: number, currency: string | null): string {
  if (!currency) return cost.toLocaleString("en-US");

  return cost === 0
    ? "Free"
    : new Intl.NumberFormat("en-US", {
        currency,
        maximumFractionDigits: 0,
        style: "currency",
      }).format(cost);
}

export function PlaceCard({
  place,
  isPending,
  onDelete,
  onEdit,
  onStatusChange,
  onAddToPlan,
  plannedLabel,
}: PlaceCardProps) {
  const priority = place.priority ? priorityDetails[place.priority] : null;
  const status = place.status ? statusDetails[place.status] : null;
  const location = [place.city, place.country].filter(Boolean).join(", ");
  const hasPlanningDetails =
    place.estimatedDuration !== null ||
    place.estimatedCost !== null ||
    Boolean(place.plannedDay);
  const canChangeStatus = Boolean(onStatusChange);
  const hasActions = Boolean(onAddToPlan || onEdit || onDelete);

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    onStatusChange?.(place, event.target.value as PlaceStatus);
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="space-y-2.5 p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="break-words text-base font-semibold tracking-tight text-foreground">{place.name}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-muted">
              <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{location || "Location not set"}</span>
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 capitalize">
            {place.category || "Other"}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {canChangeStatus ? (
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted">
              <span className="sr-only">Status</span>
              <select
                className="h-7 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/15 disabled:bg-surface disabled:text-muted"
                value={place.status || "idea"}
                onChange={handleStatusChange}
                disabled={isPending}
              >
                <option value="idea">Idea</option>
                <option value="planned">Planned</option>
                <option value="visited">Visited</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
          ) : status ? (
              <Badge variant={status.variant}>{status.label}</Badge>
            ) : (
              <Badge variant="outline">Status not set</Badge>
            )}
          {place.plannedDay ? <Badge variant="outline">Day {place.plannedDay}</Badge> : null}
          {plannedLabel ? <Badge variant="success">{plannedLabel}</Badge> : null}
          {priority ? <Badge variant={priority.variant}>{priority.label}</Badge> : null}
        </div>

        <p className="line-clamp-1 text-sm leading-relaxed text-muted">
          {place.notes || "No notes yet."}
        </p>

        {place.tags?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {place.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-surface px-2.5 py-1 text-xs text-muted">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {hasPlanningDetails ? (
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 border-t border-border-subtle pt-2.5 text-xs text-muted">
            {place.estimatedDuration !== null ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-muted-foreground" />
                {formatDuration(place.estimatedDuration)}
              </span>
            ) : null}
            {place.estimatedCost !== null ? (
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="size-3.5 text-muted-foreground" />
                {formatCost(place.estimatedCost, place.currency)}
              </span>
            ) : null}
            {place.plannedDay ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-muted-foreground" />
              In the plan
            </span>
            ) : null}
          </div>
        ) : null}
        {hasActions ? (
          <div className="flex flex-col gap-1.5 border-t border-border-subtle pt-2.5 sm:flex-row sm:flex-wrap">
            {onAddToPlan ? (
              <Button size="sm" variant="outline" className="h-7 w-full px-2.5 sm:w-auto" onClick={() => onAddToPlan(place)} disabled={isPending}>
                <CalendarPlus className="size-3.5" />
                Add to plan
              </Button>
            ) : null}
            {onEdit ? (
              <Button size="sm" variant="outline" className="h-7 w-full px-2.5 sm:w-auto" onClick={() => onEdit(place)} disabled={isPending}>Edit</Button>
            ) : null}
            {onDelete ? (
              <Button size="sm" variant="ghost" className="h-7 w-full px-2.5 text-error sm:w-auto" onClick={() => onDelete(place)} disabled={isPending}>Delete</Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
