import { CalendarDays, Clock3, MapPin, Wallet } from "lucide-react";

import { Badge } from "@/components/ui";
import type { MapItem } from "@/features/map/types/map";

const statusVariants: Record<
  MapItem["status"],
  "default" | "success" | "error" | "outline"
> = {
  idea: "outline",
  planned: "default",
  visited: "success",
  rejected: "error",
};

type MapPlaceCardProps = {
  item: MapItem;
  pinNumber: number;
};

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (!hours) return `${minutes} min`;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

function formatCost(cost: number, currency?: string): string {
  if (!currency) return `${cost}`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cost);
}

export function MapPlaceCard({ item, pinNumber }: MapPlaceCardProps) {
  return (
    <article className="rounded-xl border border-border bg-background p-4 transition-shadow hover:shadow-sm">
      <div className="flex gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm">
          {pinNumber}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold tracking-tight text-foreground">{item.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                <MapPin className="size-3.5" />{item.city}
              </p>
            </div>
            <Badge variant={statusVariants[item.status]} className="capitalize">{item.status}</Badge>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant="outline" className="capitalize">{item.category}</Badge>
            {item.priority === "must-see" ? <Badge variant="warning">Must see</Badge> : null}
            {item.plannedDay ? <Badge variant="outline">Day {item.plannedDay}</Badge> : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
            {item.estimatedDuration ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5" />{formatDuration(item.estimatedDuration)}
              </span>
            ) : null}
            {item.estimatedCost !== undefined ? (
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="size-3.5" />{item.estimatedCost === 0 ? "Free" : formatCost(item.estimatedCost, item.currency)}
              </span>
            ) : null}
            {item.plannedDay ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />In plan
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
