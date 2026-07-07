"use client";

import { AlertTriangle } from "lucide-react";
import { useActionState, useState } from "react";

import { Button, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { deleteTripAction } from "@/features/trips/actions/trip-settings-actions";
import type {
  PersistedTrip,
  TripSettingsActionState,
} from "@/features/trips/types/persisted-trip";

const initialState: TripSettingsActionState = { status: "idle" };
const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type DeleteTripDangerZoneProps = {
  trip: PersistedTrip;
};

export function DeleteTripDangerZone({ trip }: DeleteTripDangerZoneProps) {
  const [confirmation, setConfirmation] = useState("");
  const [state, formAction, isPending] = useActionState(
    deleteTripAction,
    initialState,
  );
  const canDelete = confirmation === trip.title && !isPending;

  return (
    <Card padding="lg" className="border-error/30 bg-error-subtle/40">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-error-subtle text-error">
            <AlertTriangle className="size-5" />
          </span>
          <div>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Delete this trip permanently. In this MVP there is no archive,
              restore, or undo flow.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="tripId" value={trip.id} />
        <input type="hidden" name="tripTitle" value={trip.title} />
        <p className="text-sm leading-relaxed text-muted">
          Deleting this trip also removes related module rows through the
          existing database cascade: places, planner items, reservations,
          budget expenses, packing items, and participants.
        </p>

        <label className="block text-sm font-medium text-foreground">
          Type <span className="font-semibold">{trip.title}</span> to confirm
          <input
            className={fieldClassName}
            name="confirmation"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder={trip.title}
            autoComplete="off"
          />
        </label>

        {state.message ? (
          <p role="alert" className="rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error">
            {state.message}
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={!canDelete} className="bg-error text-white hover:bg-error/90">
            {isPending ? "Deleting trip…" : "Delete trip permanently"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
