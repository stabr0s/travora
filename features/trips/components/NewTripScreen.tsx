"use client";

import Link from "next/link";
import { ArrowLeft, ImagePlus, UserPlus } from "lucide-react";
import { useActionState } from "react";

import { Button, Card, SectionHeader } from "@/components/ui";
import { createTripAction } from "@/features/trips/actions/trip-actions";
import type { CreateTripActionState } from "@/features/trips/types/persisted-trip";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

const initialState: CreateTripActionState = { status: "idle" };

type NewTripScreenProps = {
  isSignedIn: boolean;
};

export function NewTripScreen({ isSignedIn }: NewTripScreenProps) {
  const [state, formAction, isPending] = useActionState(
    createTripAction,
    initialState,
  );

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/trips"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to trips
      </Link>

      <SectionHeader
        title="New trip"
        description="Add the essentials now. You can fill in the details as your plans take shape."
      />

      <Card padding="lg">
        <form action={formAction} className="space-y-8" aria-label="New trip form">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="text-sm font-medium text-foreground sm:col-span-2">
              Trip name
              <input
                className={fieldClassName}
                name="title"
                placeholder="e.g. Japan 2027"
                type="text"
                required
              />
            </label>

            <label className="text-sm font-medium text-foreground">
              Country
              <input
                className={fieldClassName}
                name="destination"
                placeholder="Where are you going?"
                type="text"
              />
            </label>

            <label className="text-sm font-medium text-foreground">
              Currency
              <input
                className={fieldClassName}
                defaultValue="EUR"
                list="trip-currency-options"
                maxLength={12}
                name="currency"
                placeholder="EUR"
                type="text"
              />
              <datalist id="trip-currency-options">
                <option value="EUR" />
                <option value="USD" />
                <option value="PLN" />
                <option value="JOD" />
                <option value="CNY" />
                <option value="MAD" />
              </datalist>
              <span className="mt-1 block text-xs text-muted">Use a currency code like EUR, PLN, JOD, CNY, or MAD.</span>
            </label>

            <label className="text-sm font-medium text-foreground">
              Start date
              <input className={fieldClassName} name="startDate" type="date" />
            </label>

            <label className="text-sm font-medium text-foreground">
              End date
              <input className={fieldClassName} name="endDate" type="date" />
            </label>
          </div>

          <label className="block text-sm font-medium text-foreground">
            Description
            <textarea
              className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              name="description"
              placeholder="What kind of journey are you planning?"
            />
          </label>

          <div>
            <p className="text-sm font-medium text-foreground">Cover image</p>
            <button
              type="button"
              className="mt-2 flex min-h-40 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 text-center transition-colors hover:border-primary/30 hover:bg-primary-subtle/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-surface-elevated shadow-xs">
                <ImagePlus className="size-5 text-primary" />
              </span>
              <span className="mt-3 text-sm font-medium text-foreground">Add a cover image</span>
              <span className="mt-1 text-xs text-muted">Image upload will be available later</span>
            </button>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Participants</p>
            <button
              type="button"
              className="mt-2 flex w-full items-center gap-3 rounded-xl border border-dashed border-border bg-background p-4 text-left transition-colors hover:border-primary/30 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
                <UserPlus className="size-5 text-primary" />
              </span>
              <span>
                <span className="block text-sm font-medium text-foreground">Invite travelers</span>
                <span className="mt-0.5 block text-xs text-muted">Participant management will be added later</span>
              </span>
            </button>
          </div>

          <div className="border-t border-border-subtle pt-6">
            {isSignedIn ? (
              <p className="mb-4 text-sm text-muted">
                Your trip and owner membership will be saved to your account.
              </p>
            ) : (
              <div className="mb-4 rounded-xl bg-primary-subtle p-4 text-sm text-foreground">
                <p>Sign in to create and save this trip.</p>
                <div className="mt-2 flex gap-3 text-xs font-medium text-primary">
                  <Link href="/login">Login</Link>
                  <Link href="/register">Register</Link>
                </div>
              </div>
            )}

            {state.message ? (
              <p role="alert" className="mb-4 rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error">
                {state.message}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/trips"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-surface"
              >
                Cancel
              </Link>
              <Button type="submit" size="md" disabled={!isSignedIn || isPending}>
                {isPending ? "Creating trip…" : "Create trip"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
