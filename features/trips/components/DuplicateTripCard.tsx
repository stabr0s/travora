"use client";

import { Copy } from "lucide-react";
import { useActionState } from "react";

import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { duplicateTripAction } from "@/features/trips/actions/trip-settings-actions";
import type {
  PersistedTrip,
  TripSettingsActionState,
} from "@/features/trips/types/persisted-trip";

const initialState: TripSettingsActionState = { status: "idle" };
const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type DuplicateTripCardProps = {
  trip: PersistedTrip;
};

export function DuplicateTripCard({ trip }: DuplicateTripCardProps) {
  const [state, formAction, isPending] = useActionState(
    duplicateTripAction,
    initialState,
  );

  return (
    <Card padding="lg">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <Copy className="size-5" />
          </span>
          <div>
            <CardTitle>Duplicate trip</CardTitle>
            <CardDescription>
              Use this trip as a starting point for a new one.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form action={formAction} className="mt-6 space-y-5">
        <input type="hidden" name="tripId" value={trip.id} />

        <label className="block text-sm font-medium text-foreground">
          New trip name
          <input
            className={fieldClassName}
            name="title"
            defaultValue={`Copy of ${trip.title}`}
            required
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-foreground">
            Start date
            <input
              className={fieldClassName}
              name="startDate"
              type="date"
              defaultValue={trip.start_date || ""}
            />
          </label>
          <label className="block text-sm font-medium text-foreground">
            End date
            <input
              className={fieldClassName}
              name="endDate"
              type="date"
              defaultValue={trip.end_date || ""}
            />
          </label>
        </div>

        <p className="rounded-xl bg-surface px-4 py-3 text-sm leading-relaxed text-muted">
          Places, planner items, reservations, budget expenses, and packing
          items will be copied. Members, invites, public share links, and
          personal packing progress will not be copied.
        </p>

        {state.message ? (
          <p
            role="alert"
            className="rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error"
          >
            {state.message}
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
            {isPending ? "Duplicating trip…" : "Duplicate trip"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
