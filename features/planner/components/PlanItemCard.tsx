import type { LucideIcon } from "lucide-react";
import {
  BedDouble,
  Clock3,
  Coffee,
  Landmark,
  MapPin,
  Plane,
  Sparkles,
  TicketCheck,
  Timer,
  TrainFront,
  Utensils,
  Wallet,
} from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type {
  PlanItem,
  PlanItemType,
} from "@/features/planner/types/planner";

const typeDetails: Record<PlanItemType, { label: string; icon: LucideIcon }> = {
  flight: { label: "Flight", icon: Plane },
  hotel: { label: "Hotel", icon: BedDouble },
  attraction: { label: "Attraction", icon: Landmark },
  restaurant: { label: "Restaurant", icon: Utensils },
  transport: { label: "Transport", icon: TrainFront },
  activity: { label: "Activity", icon: TicketCheck },
  "free-time": { label: "Free time", icon: Coffee },
  other: { label: "Other", icon: Sparkles },
};

type PlanItemCardProps = {
  item: PlanItem;
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

export function PlanItemCard({ item }: PlanItemCardProps) {
  const type = typeDetails[item.type];
  const Icon = type.icon;

  return (
    <Card padding="sm" className="hover:shadow-sm">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
          <Icon className="size-5 text-primary" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold tracking-tight text-foreground">{item.title}</h3>
              {item.description ? <p className="mt-1 text-sm text-muted">{item.description}</p> : null}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.isFixed ? <Badge variant="warning">Fixed</Badge> : null}
              <Badge variant="default" className="capitalize">{item.category}</Badge>
              <Badge variant="outline">{type.label}</Badge>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
            {item.startTime ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5" />
                {item.startTime}{item.endTime ? ` – ${item.endTime}` : ""}
              </span>
            ) : null}
            {item.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {item.location}
              </span>
            ) : null}
            {item.durationMinutes ? (
              <span className="inline-flex items-center gap-1.5">
                <Timer className="size-3.5" />
                {formatDuration(item.durationMinutes)}
              </span>
            ) : null}
            {item.cost !== undefined ? (
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="size-3.5" />
                {formatCost(item.cost, item.currency)}
              </span>
            ) : null}
          </div>

          {item.notes ? (
            <p className="mt-3 border-t border-border-subtle pt-3 text-xs leading-relaxed text-muted">
              {item.notes}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
