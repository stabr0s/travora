"use client";

import { useActionState, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui";
import { createPlannerItemAction } from "@/features/planner/actions/planner-actions";
import type { CreatePlannerItemActionState } from "@/features/planner/types/persisted-planner";
import { typeFromPlace } from "@/features/planner/utils/planner-display";
import type { PersistedPlace } from "@/features/places/types/persisted-place";

const fieldClassName =
  "h-9 w-full rounded-lg border border-border bg-background px-2.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";
const initialState: CreatePlannerItemActionState = { status: "idle" };

type PersistedQuickAddPlanItemProps = {
  tripId: string;
  date: string;
  places: PersistedPlace[];
  plannedPlaceLabels?: Map<string, string>;
};

export function PersistedQuickAddPlanItem({
  tripId,
  date,
  places,
  plannedPlaceLabels,
}: PersistedQuickAddPlanItemProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("activity");
  const sortedPlaces = useMemo(
    () => [...places].sort((a, b) => a.title.localeCompare(b.title)),
    [places],
  );
  const [actionState, formAction, isPending] = useActionState(
    createPlannerItemAction,
    initialState,
  );

  function handlePlaceChange(value: string) {
    setSelectedPlaceId(value);
    const place = sortedPlaces.find((savedPlace) => savedPlace.id === value);
    if (!place) return;
    setTitle(place.title);
    setType(typeFromPlace(place));
  }

  return (
    <div className="rounded-xl border border-dashed border-border-subtle bg-background/60 px-3 py-2.5">
      <form action={formAction} className="space-y-2.5">
        <input type="hidden" name="tripId" value={tripId} />
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="status" value="planned" />
        <input type="hidden" name="placeId" value={selectedPlaceId} />

        <div className="grid gap-2.5 md:grid-cols-[minmax(0,1.3fr)_8rem_minmax(8rem,0.75fr)_minmax(8rem,0.9fr)_auto] md:items-end">
          <label className="min-w-0 text-xs font-medium text-muted">
            Quick add
            <input
              className={`${fieldClassName} mt-1`}
              name="title"
              placeholder="Add item"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label className="text-xs font-medium text-muted">
            Time
            <input className={`${fieldClassName} mt-1`} name="startTime" type="time" />
          </label>
          <label className="text-xs font-medium text-muted">
            Type
            <select className={`${fieldClassName} mt-1`} name="type" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="activity">Activity</option>
              <option value="attraction">Attraction</option>
              <option value="restaurant">Restaurant</option>
              <option value="transport">Transport</option>
              <option value="hotel">Hotel</option>
              <option value="flight">Flight</option>
              <option value="free-time">Free time</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="min-w-0 text-xs font-medium text-muted">
            Saved place
            <select className={`${fieldClassName} mt-1`} value={selectedPlaceId} onChange={(event) => handlePlaceChange(event.target.value)}>
              <option value="">Optional</option>
              {sortedPlaces.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.title}{plannedPlaceLabels?.get(place.id) ? ` · ${plannedPlaceLabels.get(place.id)}` : ""}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" size="sm" variant="outline" className="w-full md:w-auto" disabled={isPending}>
            <Plus className="size-4" />
            {isPending ? "Adding…" : "Add"}
          </Button>
        </div>

        {actionState.message ? (
          <p role={actionState.status === "error" ? "alert" : "status"} className={actionState.status === "error" ? "text-sm text-error" : "text-sm text-success"}>
            {actionState.message}
          </p>
        ) : null}
        {sortedPlaces.length ? (
          <p className="text-xs text-muted">
            Planned places can still be added again.
          </p>
        ) : null}
      </form>
    </div>
  );
}
