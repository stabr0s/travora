"use client";

import { useActionState } from "react";
import { CalendarPlus, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import {
  createPlannerItemAction,
  updatePlannerItemAction,
} from "@/features/planner/actions/planner-actions";
import type {
  CreatePlannerItemActionState,
  PersistedPlannerItem,
} from "@/features/planner/types/persisted-planner";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type PersistedAddPlanItemPanelProps = {
  tripId: string;
  item?: PersistedPlannerItem | null;
  onClose: () => void;
};

const initialState: CreatePlannerItemActionState = { status: "idle" };

export function PersistedAddPlanItemPanel({
  tripId,
  item,
  onClose,
}: PersistedAddPlanItemPanelProps) {
  const isEditing = Boolean(item);
  const [actionState, formAction, isPending] = useActionState(
    isEditing ? updatePlannerItemAction : createPlannerItemAction,
    initialState,
  );

  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <form action={formAction}>
        <input type="hidden" name="tripId" value={tripId} />
        {item ? <input type="hidden" name="recordId" value={item.id} /> : null}
        <input type="hidden" name="orderIndex" value={item?.order_index ?? 0} />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
              <CalendarPlus className="size-5 text-primary" />
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{isEditing ? "Edit plan item" : "Add plan item"}</h2>
              <p className="mt-1 text-sm text-muted">{isEditing ? "Update this saved itinerary item." : "Add a dated or unscheduled item to this trip."}</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close add item panel">
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Title
            <input className={fieldClassName} defaultValue={item?.title} name="title" type="text" placeholder="e.g. Visit the old town" required />
          </label>
          <label className="text-sm font-medium text-foreground">
            Type
            <select className={fieldClassName} defaultValue={item?.type || "attraction"} name="type">
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
            <input className={fieldClassName} defaultValue={item?.date || ""} name="date" type="date" />
          </label>
          <label className="text-sm font-medium text-foreground">
            Start time
            <input className={fieldClassName} defaultValue={item?.start_time?.slice(0, 5) || ""} name="startTime" type="time" />
          </label>
          <label className="text-sm font-medium text-foreground">
            End time
            <input className={fieldClassName} defaultValue={item?.end_time?.slice(0, 5) || ""} name="endTime" type="time" />
          </label>
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Status
            <select className={fieldClassName} defaultValue={item?.status || "planned"} name="status">
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Description
            <textarea
              className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              name="description"
              defaultValue={item?.description || ""}
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
            {isPending ? "Saving item…" : isEditing ? "Update plan item" : "Save plan item"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
