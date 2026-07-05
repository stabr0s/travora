import { CalendarPlus, Info, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { PlannerDay } from "@/features/planner/types/planner";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type AddPlanItemPanelProps = {
  days: PlannerDay[];
  selectedDayId: string;
  onClose: () => void;
};

export function AddPlanItemPanel({
  days,
  selectedDayId,
  onClose,
}: AddPlanItemPanelProps) {
  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <CalendarPlus className="size-5 text-primary" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Add plan item</h2>
            <p className="mt-1 text-sm text-muted">Preview the details that will shape a day.</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close add item panel">
          <X className="size-4" />
        </Button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Title
          <input className={fieldClassName} type="text" placeholder="e.g. Visit the old town" />
        </label>

        <label className="text-sm font-medium text-foreground">
          Type
          <select className={fieldClassName} defaultValue="attraction">
            <option value="flight">Flight</option>
            <option value="hotel">Hotel</option>
            <option value="attraction">Attraction</option>
            <option value="restaurant">Restaurant</option>
            <option value="transport">Transport</option>
            <option value="activity">Activity</option>
            <option value="free-time">Free time</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          Day
          <select className={fieldClassName} defaultValue={selectedDayId}>
            {days.map((day) => (
              <option key={day.id} value={day.id}>Day {day.dayNumber} · {day.city}</option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          Time
          <input className={fieldClassName} type="time" />
        </label>

        <label className="text-sm font-medium text-foreground">
          Duration
          <select className={fieldClassName} defaultValue="60">
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
            <option value="180">3 hours</option>
          </select>
        </label>

        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Location
          <input className={fieldClassName} type="text" placeholder="Address or area" />
        </label>

        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Notes
          <textarea
            className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            placeholder="Anything useful for this stop?"
          />
        </label>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl bg-primary-subtle p-3 text-xs text-primary">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>Adding plan items will be available after database setup.</p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
        <Button variant="outline" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" disabled>Add item · Preview only</Button>
      </div>
    </Card>
  );
}
