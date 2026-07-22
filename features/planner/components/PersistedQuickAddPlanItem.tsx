"use client";

import { useActionState, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button, Card } from "@/components/ui";
import { createPlannerItemAction } from "@/features/planner/actions/planner-actions";
import type { CreatePlannerItemActionState } from "@/features/planner/types/persisted-planner";
import type { PersistedPlace } from "@/features/places/types/persisted-place";

const fieldClassName =
  "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";
const initialState: CreatePlannerItemActionState = { status: "idle" };

type PersistedQuickAddPlanItemProps = {
  tripId: string;
  date: string;
  places: PersistedPlace[];
  plannedPlaceLabels?: Map<string, string>;
};

function typeFromPlace(place: PersistedPlace) {
  if (["attraction", "restaurant", "hotel", "transport", "other"].includes(place.category || "")) {
    return place.category || "other";
  }
  return "other";
}

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
    <Card padding="sm" className="border-dashed border-border bg-surface/60">
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="tripId" value={tripId} />
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="status" value="planned" />
        <input type="hidden" name="placeId" value={selectedPlaceId} />

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_9rem_10rem_10rem_auto] lg:items-end">
          <label className="text-xs font-medium text-muted">
            Quick add
            <input
              className={`${fieldClassName} mt-1.5`}
              name="title"
              placeholder="Add a plan item"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label className="text-xs font-medium text-muted">
            Time
            <input className={`${fieldClassName} mt-1.5`} name="startTime" type="time" />
          </label>
          <label className="text-xs font-medium text-muted">
            Type
            <select className={`${fieldClassName} mt-1.5`} name="type" value={type} onChange={(event) => setType(event.target.value)}>
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
          <label className="text-xs font-medium text-muted">
            Saved place
            <select className={`${fieldClassName} mt-1.5`} value={selectedPlaceId} onChange={(event) => handlePlaceChange(event.target.value)}>
              <option value="">Optional</option>
              {sortedPlaces.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.title}{plannedPlaceLabels?.get(place.id) ? ` · ${plannedPlaceLabels.get(place.id)}` : ""}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" size="md" className="w-full lg:w-auto" disabled={isPending}>
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
            Planned saved places can be added again if this place appears on another day.
          </p>
        ) : null}
      </form>
    </Card>
  );
}
