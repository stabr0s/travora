"use client";

import { useActionState } from "react";
import { CalendarPlus, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import { createPlannerItemAction } from "@/features/planner/actions/planner-actions";
import type { CreatePlannerItemActionState } from "@/features/planner/types/persisted-planner";
import {
  descriptionFromPlace,
  typeFromPlace,
} from "@/features/planner/utils/planner-display";
import type { PersistedPlace } from "@/features/places/types/persisted-place";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type AddPlaceToPlanPanelProps = {
  tripId: string;
  place: PersistedPlace;
  tripStartDate?: string | null;
  tripEndDate?: string | null;
  onClose: () => void;
};

const initialState: CreatePlannerItemActionState = { status: "idle" };

function toDateInput(value?: string | null) {
  return value ? value.slice(0, 10) : undefined;
}

export function AddPlaceToPlanPanel({
  tripId,
  place,
  tripStartDate,
  tripEndDate,
  onClose,
}: AddPlaceToPlanPanelProps) {
  const [actionState, formAction, isPending] = useActionState(
    createPlannerItemAction,
    initialState,
  );

  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <form action={formAction}>
        <input type="hidden" name="tripId" value={tripId} />
        <input type="hidden" name="placeId" value={place.id} />
        <input type="hidden" name="title" value={place.title} />
        <input type="hidden" name="type" value={typeFromPlace(place)} />
        <input type="hidden" name="status" value="planned" />
        <input type="hidden" name="description" value={descriptionFromPlace(place)} />

        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
              <CalendarPlus className="size-5 text-primary" />
            </span>
            <div className="min-w-0">
              <h2 className="break-words text-lg font-semibold tracking-tight text-foreground">
                Add “{place.title}” to plan
              </h2>
              <p className="mt-1 text-sm text-muted">
                Pick the exact day for this saved place. You can refine the item later in Plan.
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close add to plan panel">
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground">
            Date
            <input
              className={fieldClassName}
              name="date"
              type="date"
              min={toDateInput(tripStartDate)}
              max={toDateInput(tripEndDate)}
              required
            />
          </label>
          <label className="text-sm font-medium text-foreground">
            Start time
            <input className={fieldClassName} name="startTime" type="time" />
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
          <Button type="button" variant="outline" size="md" className="w-full sm:w-auto" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="md" className="w-full sm:w-auto" disabled={isPending}>
            {isPending ? "Adding to plan…" : "Add to selected day"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
