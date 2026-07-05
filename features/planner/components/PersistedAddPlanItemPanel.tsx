import { CalendarPlus, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { CreatePlannerItemActionState } from "@/features/planner/types/persisted-planner";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type PersistedAddPlanItemPanelProps = {
  tripId: string;
  actionState: CreatePlannerItemActionState;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  onClose: () => void;
};

export function PersistedAddPlanItemPanel({
  tripId,
  actionState,
  formAction,
  isPending,
  onClose,
}: PersistedAddPlanItemPanelProps) {
  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <form action={formAction}>
        <input type="hidden" name="tripId" value={tripId} />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
              <CalendarPlus className="size-5 text-primary" />
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Add plan item</h2>
              <p className="mt-1 text-sm text-muted">Add a dated or unscheduled item to this trip.</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close add item panel">
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Title
            <input className={fieldClassName} name="title" type="text" placeholder="e.g. Visit the old town" required />
          </label>
          <label className="text-sm font-medium text-foreground">
            Type
            <select className={fieldClassName} defaultValue="attraction" name="type">
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
            Date
            <input className={fieldClassName} name="date" type="date" />
          </label>
          <label className="text-sm font-medium text-foreground">
            Start time
            <input className={fieldClassName} name="startTime" type="time" />
          </label>
          <label className="text-sm font-medium text-foreground">
            End time
            <input className={fieldClassName} name="endTime" type="time" />
          </label>
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Description
            <textarea
              className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              name="description"
              placeholder="Optional details for this item"
            />
          </label>
        </div>

        {actionState.message ? (
          <p
            role={actionState.status === "error" ? "alert" : "status"}
            className={actionState.status === "error"
              ? "mt-5 rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error"
              : "mt-5 rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"}
          >
            {actionState.message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" size="md" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="md" disabled={isPending}>
            {isPending ? "Saving item…" : "Save plan item"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
