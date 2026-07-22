"use client";

import { useActionState, useState } from "react";
import { LayoutTemplate, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import { addPlannerPresetAction } from "@/features/planner/actions/planner-preset-actions";
import type { CreatePlannerItemActionState } from "@/features/planner/types/persisted-planner";
import { plannerDayPresets } from "@/features/planner/utils/planner-presets";

const initialState: CreatePlannerItemActionState = { status: "idle" };

export type PlannerPresetDayOption = {
  date: string;
  label: string;
  count: number;
};

type PersistedPlannerPresetPickerProps = {
  tripId: string;
  days: PlannerPresetDayOption[];
};

export function PersistedPlannerPresetPicker({
  tripId,
  days,
}: PersistedPlannerPresetPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetDate, setTargetDate] = useState("");
  const [actionState, formAction, isPending] = useActionState(
    addPlannerPresetAction,
    initialState,
  );

  if (!isOpen) {
    return (
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border-subtle bg-background px-3.5 py-3 text-left transition-colors hover:bg-surface sm:w-auto sm:min-w-80"
        onClick={() => setIsOpen(true)}
      >
        <span className="min-w-0">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <LayoutTemplate className="size-4 text-muted" />
            Add preset
          </span>
          <span className="mt-0.5 block text-xs text-muted">
            Add a ready-made block to a selected day
          </span>
        </span>
        <span className="text-xs font-medium text-primary">Open</span>
      </button>
    );
  }

  return (
    <Card padding="sm" className="bg-surface/60">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <LayoutTemplate className="size-4 text-primary" />
            Add preset
          </h3>
          <p className="mt-1 text-xs text-muted">
            Choose a day and append a lightweight travel block after existing items.
          </p>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={() => setIsOpen(false)} aria-label="Close presets">
          <X className="size-4" />
        </Button>
      </div>

      {!days.length ? (
        <p className="mt-3 rounded-xl border border-border-subtle bg-background px-3 py-2 text-sm text-muted">
          Create a dated planner item first, then presets can be added to that day.
        </p>
      ) : (
        <label className="mt-3 block text-xs font-medium text-muted">
          Target day
          <select
            className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-xs outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            value={targetDate}
            onChange={(event) => setTargetDate(event.target.value)}
            required
          >
            <option value="">Choose a day</option>
            {days.map((day) => (
              <option key={day.date} value={day.date}>
                {day.label} · {day.count} {day.count === 1 ? "item" : "items"}
              </option>
            ))}
          </select>
        </label>
      )}

      {days.length ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {plannerDayPresets.map((preset) => (
            <form key={preset.id} action={formAction} className="rounded-xl border border-border-subtle bg-background p-3">
              <input type="hidden" name="tripId" value={tripId} />
              <input type="hidden" name="targetDate" value={targetDate} />
              <input type="hidden" name="presetId" value={preset.id} />
              <div className="flex h-full flex-col gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="break-words text-sm font-semibold text-foreground">
                      {preset.label}
                    </h4>
                    <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted">
                      {preset.items.length} items
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {preset.description}
                  </p>
                </div>
                <Button type="submit" size="sm" variant="outline" className="w-full" disabled={isPending || !targetDate}>
                  {isPending ? "Adding…" : "Add to day"}
                </Button>
              </div>
            </form>
          ))}
        </div>
      ) : null}

      {actionState.message ? (
        <p role={actionState.status === "error" ? "alert" : "status"} className={actionState.status === "error" ? "mt-3 text-sm text-error" : "mt-3 text-sm text-success"}>
          {actionState.message}
        </p>
      ) : null}
    </Card>
  );
}
