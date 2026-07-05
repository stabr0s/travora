import { CalendarDays, Clock3, MapPin, Wallet } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type {
  Place,
  PlacePriority,
  PlaceStatus,
} from "@/features/places/types/place";
import { cn } from "@/lib/utils";

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
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function formatCost(cost: number, currency: string): string {
  return cost === 0
    ? "Free"
    : new Intl.NumberFormat("en-US", {
        currency,
        maximumFractionDigits: 0,
        style: "currency",
      }).format(cost);
}

export function PlaceCard({ place }: PlaceCardProps) {
  const priority = priorityDetails[place.priority];
  const status = statusDetails[place.status];

  return (
    <Card padding="none" className="overflow-hidden">
      <div className={cn("relative flex min-h-36 flex-col justify-between bg-gradient-to-br p-5", place.coverGradient)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/10" />
        <div className="relative flex flex-wrap gap-2">
          <Badge variant="outline" className="border-white/20 bg-white/90 capitalize">
            {place.category}
          </Badge>
          <Badge variant={priority.variant} className="border-white/20 bg-white/90">
            {priority.label}
          </Badge>
        </div>
        <div className="relative">
          <p className="flex items-center gap-1.5 text-xs font-medium text-white/80">
            <MapPin className="size-3.5" />
            {place.city}, {place.country}
          </p>
          <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-white">{place.name}</h3>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={status.variant}>{status.label}</Badge>
          {place.plannedDay ? <Badge variant="outline">Day {place.plannedDay}</Badge> : null}
        </div>

        <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-muted">{place.notes}</p>

        {place.tags?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {place.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-surface px-2.5 py-1 text-xs text-muted">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border-subtle pt-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5 text-muted-foreground" />
            {formatDuration(place.estimatedDuration)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Wallet className="size-3.5 text-muted-foreground" />
            {formatCost(place.estimatedCost, place.currency)}
          </span>
          {place.plannedDay ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-muted-foreground" />
              In the plan
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
