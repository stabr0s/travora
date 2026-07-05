import Link from "next/link";
import { ArrowLeft, ImagePlus, UserPlus } from "lucide-react";

import { Button, Card, SectionHeader } from "@/components/ui";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

export function NewTripScreen() {
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
        <form className="space-y-8" aria-label="New trip form">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="text-sm font-medium text-foreground sm:col-span-2">
              Trip name
              <input
                className={fieldClassName}
                name="tripName"
                placeholder="e.g. Japan 2027"
                type="text"
              />
            </label>

            <label className="text-sm font-medium text-foreground">
              Country
              <input
                className={fieldClassName}
                name="country"
                placeholder="Where are you going?"
                type="text"
              />
            </label>

            <label className="text-sm font-medium text-foreground">
              Currency
              <select className={fieldClassName} defaultValue="EUR" name="currency">
                <option value="EUR">EUR — Euro</option>
                <option value="USD">USD — US Dollar</option>
                <option value="PLN">PLN — Polish Zloty</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="JPY">JPY — Japanese Yen</option>
              </select>
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

          <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/trips"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-surface"
            >
              Cancel
            </Link>
            <Button type="button" size="md">
              Create trip
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
