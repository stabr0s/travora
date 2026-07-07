"use client";

import { useActionState } from "react";

import { Button, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { updateTripSettingsAction } from "@/features/trips/actions/trip-settings-actions";
import type {
  PersistedTrip,
  TripSettingsActionState,
} from "@/features/trips/types/persisted-trip";

const initialState: TripSettingsActionState = { status: "idle" };
const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15 disabled:bg-surface disabled:text-muted";
const textareaClassName =
  "mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15 disabled:bg-surface disabled:text-muted";

type TripSettingsFormProps = {
  trip: PersistedTrip;
  canManageSettings: boolean;
};

export function TripSettingsForm({ trip, canManageSettings }: TripSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTripSettingsAction,
    initialState,
  );

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Trip details</CardTitle>
        <CardDescription>
          {canManageSettings
            ? "Update the basic information shown across this trip workspace."
            : "Only the trip owner can manage trip settings."}
        </CardDescription>
      </CardHeader>

      <form action={formAction} className="mt-6 space-y-6">
        <input type="hidden" name="tripId" value={trip.id} />
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Trip name
            <input
              className={fieldClassName}
              name="title"
              defaultValue={trip.title}
              disabled={!canManageSettings}
              required
            />
          </label>

          <label className="text-sm font-medium text-foreground">
            Destination
            <input
              className={fieldClassName}
              name="destination"
              defaultValue={trip.destination || ""}
              disabled={!canManageSettings}
              placeholder="Country, region, or city"
            />
          </label>

          <label className="text-sm font-medium text-foreground">
            Currency
            <input
              className={fieldClassName}
              name="currency"
              defaultValue={trip.currency || "EUR"}
              disabled={!canManageSettings}
              maxLength={3}
              placeholder="EUR"
            />
          </label>

          <label className="text-sm font-medium text-foreground">
            Start date
            <input
              className={fieldClassName}
              name="startDate"
              type="date"
              defaultValue={trip.start_date || ""}
              disabled={!canManageSettings}
            />
          </label>

          <label className="text-sm font-medium text-foreground">
            End date
            <input
              className={fieldClassName}
              name="endDate"
              type="date"
              defaultValue={trip.end_date || ""}
              disabled={!canManageSettings}
            />
          </label>

          <label className="text-sm font-medium text-foreground">
            Status
            <select
              className={fieldClassName}
              name="status"
              defaultValue={trip.status || "planning"}
              disabled={!canManageSettings}
            >
              <option value="planning">Planning</option>
              <option value="upcoming">Upcoming</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="text-sm font-medium text-foreground">
            Cover image URL
            <input
              className={fieldClassName}
              name="coverImageUrl"
              defaultValue={trip.cover_image_url || ""}
              disabled={!canManageSettings}
              placeholder="https://example.com/photo.jpg"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-foreground">
          Description
          <textarea
            className={textareaClassName}
            name="description"
            defaultValue={trip.description || ""}
            disabled={!canManageSettings}
            placeholder="What should everyone know about this trip?"
          />
        </label>

        {state.message ? (
          <p
            role="status"
            className={state.status === "success"
              ? "rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"
              : "rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error"}
          >
            {state.message}
          </p>
        ) : null}

        {canManageSettings ? (
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving settings…" : "Save settings"}
            </Button>
          </div>
        ) : null}
      </form>
    </Card>
  );
}
