"use client";

import { useActionState, useMemo, useState } from "react";
import { CalendarPlus, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import {
  createPlannerItemAction,
  updatePlannerItemAction,
} from "@/features/planner/actions/planner-actions";
import {
  descriptionFromPlace,
  typeFromPlace,
} from "@/features/planner/utils/planner-display";
import type {
  CreatePlannerItemActionState,
  PersistedPlannerItem,
} from "@/features/planner/types/persisted-planner";
import type { PersistedPlace } from "@/features/places/types/persisted-place";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type PersistedAddPlanItemPanelProps = {
  tripId: string;
  item?: PersistedPlannerItem | null;
  places?: PersistedPlace[];
  plannedPlaceLabels?: Map<string, string>;
  onClose: () => void;
};

const initialState: CreatePlannerItemActionState = { status: "idle" };

export function PersistedAddPlanItemPanel({
  tripId,
  item,
  places = [],
  plannedPlaceLabels,
  onClose,
}: PersistedAddPlanItemPanelProps) {
  const isEditing = Boolean(item);
  const [selectedPlaceId, setSelectedPlaceId] = useState(item?.place_id || "");
  const [title, setTitle] = useState(item?.title || "");
  const [type, setType] = useState(item?.type || "attraction");
  const [description, setDescription] = useState(item?.description || "");
  const sortedPlaces = useMemo(
    () => [...places].sort((a, b) => a.title.localeCompare(b.title)),
    [places],
  );
  const [actionState, formAction, isPending] = useActionState(
    isEditing ? updatePlannerItemAction : createPlannerItemAction,
    initialState,
  );
  const fields = actionState.fields;
  const formKey = fields
    ? Object.values(fields).join("|")
    : item?.id || "new";

  function handlePlaceChange(value: string) {
    setSelectedPlaceId(value);
    const place = sortedPlaces.find((savedPlace) => savedPlace.id === value);
    if (!place) return;

    setTitle(place.title);
    setType(typeFromPlace(place));
    setDescription(descriptionFromPlace(place));
  }

  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <form key={formKey} action={formAction}>
        <input type="hidden" name="tripId" value={tripId} />
        {item ? <input type="hidden" name="recordId" value={item.id} /> : null}
        {item ? <input type="hidden" name="orderIndex" value={item.order_index ?? 0} /> : null}
        <input type="hidden" name="placeId" value={selectedPlaceId} />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
              <CalendarPlus className="size-5 text-primary" />
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{isEditing ? "Edit plan item" : "Add plan item"}</h2>
              <p className="mt-1 text-sm text-muted">
                {isEditing ? "Update the day, time, saved place, and details." : "Create a dated item or keep it unscheduled for later."}
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close add item panel">
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {sortedPlaces.length ? (
            <label className="text-sm font-medium text-foreground sm:col-span-2">
              Use saved place
              <select
                className={fieldClassName}
                value={selectedPlaceId}
                onChange={(event) => handlePlaceChange(event.target.value)}
              >
                <option value="">No saved place</option>
                {sortedPlaces.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.title}{place.city ? ` · ${place.city}` : ""}{plannedPlaceLabels?.get(place.id) ? ` · ${plannedPlaceLabels.get(place.id)}` : ""}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-xs text-muted">
                Planned places can still be added again.
              </span>
            </label>
          ) : null}
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Title
            <input
              className={fieldClassName}
              name="title"
              type="text"
              placeholder="e.g. Visit the old town"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-foreground">
            Type
            <select
              className={fieldClassName}
              name="type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
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
            <input className={fieldClassName} defaultValue={fields?.date ?? item?.date ?? ""} name="date" type="date" />
          </label>
          <label className="text-sm font-medium text-foreground">
            Start time
            <input className={fieldClassName} defaultValue={fields?.startTime ?? item?.start_time?.slice(0, 5) ?? ""} name="startTime" type="time" />
          </label>
          <label className="text-sm font-medium text-foreground">
            End time
            <input className={fieldClassName} defaultValue={fields?.endTime ?? item?.end_time?.slice(0, 5) ?? ""} name="endTime" type="time" />
          </label>
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Status
            <select className={fieldClassName} defaultValue={fields?.status ?? item?.status ?? "planned"} name="status">
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
              placeholder="Optional details for this item"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
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
          <Button type="button" variant="outline" size="md" className="w-full sm:w-auto" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="md" className="w-full sm:w-auto" disabled={isPending}>
            {isPending ? "Saving item…" : isEditing ? "Update plan item" : "Save plan item"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
