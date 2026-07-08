"use client";

import { useActionState } from "react";
import { MapPin, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import { createPlaceAction, updatePlaceAction } from "@/features/places/actions/place-actions";
import type {
  CreatePlaceActionState,
  PersistedPlace,
} from "@/features/places/types/persisted-place";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type AddPlacePanelProps = {
  tripId: string;
  mode: "mock" | "persisted";
  place?: PersistedPlace | null;
  defaultCountry?: string;
  onClose: () => void;
};

const initialState: CreatePlaceActionState = { status: "idle" };

function parseCountryDefault(destination?: string) {
  const value = destination?.trim();
  if (!value) return "";

  if (value.includes(",")) {
    return value.split(",").at(-1)?.trim() || "";
  }

  const looksLikeCountry = value.length <= 32
    && !/\d/.test(value)
    && value.split(/\s+/).length <= 3;

  return looksLikeCountry ? value : "";
}

export function AddPlacePanel({
  tripId,
  mode,
  place,
  defaultCountry,
  onClose,
}: AddPlacePanelProps) {
  const isPersisted = mode === "persisted";
  const isEditing = Boolean(place);
  const countryDefault = isPersisted && !isEditing
    ? parseCountryDefault(defaultCountry)
    : "";
  const [actionState, formAction, isPending] = useActionState(
    isEditing ? updatePlaceAction : createPlaceAction,
    initialState,
  );

  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <form action={isPersisted ? formAction : undefined}>
        <input type="hidden" name="tripId" value={tripId} />
        {place ? <input type="hidden" name="recordId" value={place.id} /> : null}

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
              <MapPin className="size-5 text-primary" />
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{isEditing ? "Edit place" : "Add a place"}</h2>
              <p className="mt-1 text-sm text-muted">
                {isPersisted
                  ? isEditing ? "Update this saved place." : "Save a place to this trip. Map features will be connected later."
                  : "This is a preview. Mock trips do not save places."}
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close add place panel">
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Place name
            <input className={fieldClassName} defaultValue={place?.title} name="title" type="text" placeholder="e.g. Senso-ji Temple" required={isPersisted} />
          </label>
          <label className="text-sm font-medium text-foreground">
            City
            <input className={fieldClassName} defaultValue={place?.city || ""} name="city" type="text" placeholder="Tokyo" />
          </label>
          <label className="text-sm font-medium text-foreground">
            Country
            <input className={fieldClassName} defaultValue={place?.country || countryDefault} name="country" type="text" placeholder="Japan" />
            {isPersisted && !isEditing && countryDefault ? (
              <span className="mt-1 block text-xs text-muted">
                Prefilled from trip destination. You can change or clear it.
              </span>
            ) : null}
          </label>
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Address
            <input className={fieldClassName} defaultValue={place?.address || ""} name="address" type="text" placeholder="Optional street address" />
          </label>
          <label className="text-sm font-medium text-foreground">
            Category
            <select className={fieldClassName} defaultValue={place?.category || "attraction"} name="category">
              <option value="attraction">Attraction</option>
              <option value="restaurant">Restaurant</option>
              <option value="viewpoint">Viewpoint</option>
              <option value="hotel">Hotel</option>
              <option value="airport">Airport</option>
              <option value="transport">Transport</option>
              <option value="shop">Shop</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Priority
            <select className={fieldClassName} defaultValue={place?.priority || "recommended"} name="priority">
              <option value="must-see">Must see</option>
              <option value="recommended">Recommended</option>
              <option value="optional">Optional</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Status
            <select className={fieldClassName} defaultValue={place?.status || "idea"} name="status">
              <option value="idea">Idea</option>
              <option value="planned">Planned</option>
              <option value="visited">Visited</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Website
            <input className={fieldClassName} defaultValue={place?.website_url || ""} name="websiteUrl" type="url" placeholder="https://" />
          </label>
          {isPersisted ? (
            <div className="grid gap-5 sm:col-span-2 sm:grid-cols-3">
              <label className="text-sm font-medium text-foreground">
                Latitude
                <input className={fieldClassName} defaultValue={place?.latitude ?? ""} name="latitude" type="number" min="-90" max="90" step="any" placeholder="35.6762" />
              </label>
              <label className="text-sm font-medium text-foreground">
                Longitude
                <input className={fieldClassName} defaultValue={place?.longitude ?? ""} name="longitude" type="number" min="-180" max="180" step="any" placeholder="139.6503" />
              </label>
              <label className="text-sm font-medium text-foreground">
                Map order
                <input className={fieldClassName} defaultValue={place?.map_order ?? ""} name="mapOrder" type="number" min="0" step="1" placeholder="0" />
              </label>
              <p className="text-xs leading-relaxed text-muted sm:col-span-3">
                Coordinates are optional and will be used by the map later. Providing both gives the best map preview.
              </p>
            </div>
          ) : null}
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Notes
            <textarea
              className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              name="notes"
              defaultValue={place?.notes || ""}
              placeholder="What makes this place worth adding?"
            />
          </label>
        </div>

        {isPersisted && actionState.message ? (
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
          <Button type={isPersisted ? "submit" : "button"} size="md" disabled={!isPersisted || isPending}>
            {isPersisted ? (isPending ? "Saving place…" : isEditing ? "Update place" : "Save place") : "Preview only"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
