import { CalendarDays, MapPin } from "lucide-react";

import { Card } from "@/components/ui";
import type { TimelinePreviewItem } from "@/features/trip-detail/types/trip-detail";

type TripTimelinePreviewProps = {
  items: TimelinePreviewItem[];
};

export function TripTimelinePreview({ items }: TripTimelinePreviewProps) {
  return (
    <Card padding="md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Timeline preview</h2>
          <p className="mt-1 text-sm text-muted">A first look at the shape of your trip.</p>
        </div>
        <CalendarDays className="size-5 text-primary" />
      </div>

      <div className="mt-6 space-y-1">
        {items.map((item, index) => (
          <div key={item.id} className="relative grid grid-cols-[4.5rem_1fr] gap-4 pb-5 last:pb-0">
            {index < items.length - 1 ? (
              <span className="absolute left-[5.1rem] top-7 h-[calc(100%-0.75rem)] w-px bg-border" />
            ) : null}
            <p className="pt-0.5 text-xs font-semibold uppercase tracking-wide text-muted">
              {item.date}
            </p>
            <div className="relative pl-5">
              <span className="absolute left-0 top-1.5 size-2.5 rounded-full border-2 border-surface-elevated bg-primary ring-2 ring-primary-subtle" />
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                <MapPin className="size-3.5" />
                {item.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
