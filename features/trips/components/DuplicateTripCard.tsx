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

const copyOptions = [
  {
    name: "copyPlaces",
    label: "Places",
    description: "Saved places without historical map fields.",
    defaultChecked: true,
  },
  {
    name: "copyPlanner",
    label: "Planner",
    description: "Day plans, dates, and times copied as-is.",
    defaultChecked: true,
  },
  {
    name: "copyPacking",
    label: "Packing items",
    description: "Checklist items with packed progress reset.",
    defaultChecked: true,
  },
  {
    name: "copyImportantInfo",
    label: "Important Info",
    description: "Private trip notes and reference details.",
    defaultChecked: true,
  },
  {
    name: "copyReservations",
    label: "Reservations",
    description: "Booking details and dates copied as-is.",
    defaultChecked: false,
  },
  {
    name: "copyBudget",
    label: "Budget expenses",
    description: "Expenses without payer or split references.",
    defaultChecked: false,
  },
  {
    name: "copyTravelLinks",
    label: "Trip-level Travel Links",
    description: "Only copy reusable links, such as a Google My Maps link or planning folder.",
    defaultChecked: false,
  },
] as const;

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
            <CardTitle>Use as template</CardTitle>
            <CardDescription>
              Create a new trip from this one.
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

        <fieldset>
          <legend className="text-sm font-semibold text-foreground">
            Choose what to copy into the new trip
          </legend>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {copyOptions.map((option) => (
              <label
                key={option.name}
                className="flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border border-border-subtle bg-surface px-3.5 py-3"
              >
                <input
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                  type="checkbox"
                  name={option.name}
                  defaultChecked={option.defaultChecked}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="space-y-1.5 rounded-xl bg-surface px-4 py-3 text-sm leading-relaxed text-muted">
          <p>Dates and times are copied as-is and may need manual adjustment.</p>
          <p>Reservations and Budget are usually trip-specific, so they are off by default.</p>
          <p>Members, invites, public share links, and personal packing progress are never copied.</p>
          <p>Reservation links require both Reservations and Travel Links to be selected.</p>
        </div>

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
            {isPending ? "Creating trip…" : "Create trip from template"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
