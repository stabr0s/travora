"use client";

import { useActionState, useState } from "react";
import { LayoutTemplate, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import { addPlannerPresetAction } from "@/features/planner/actions/planner-preset-actions";
import type { CreatePlannerItemActionState } from "@/features/planner/types/persisted-planner";
import { plannerDayPresets } from "@/features/planner/utils/planner-presets";

const initialState: CreatePlannerItemActionState = { status: "idle" };

type PersistedPlannerPresetPickerProps = {
  tripId: string;
  date: string;
};

export function PersistedPlannerPresetPicker({
  tripId,
  date,
}: PersistedPlannerPresetPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [actionState, formAction, isPending] = useActionState(
    addPlannerPresetAction,
    initialState,
  );

  if (!isOpen) {
    return (
      <Button size="sm" variant="ghost" className="text-muted" onClick={() => setIsOpen(true)}>
        <LayoutTemplate className="size-4" />
        Add preset
      </Button>
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
            Append a lightweight day template after existing items.
          </p>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={() => setIsOpen(false)} aria-label="Close presets">
          <X className="size-4" />
        </Button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {plannerDayPresets.map((preset) => (
          <form key={preset.id} action={formAction} className="rounded-xl border border-border-subtle bg-background p-3">
            <input type="hidden" name="tripId" value={tripId} />
            <input type="hidden" name="date" value={date} />
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
              <Button type="submit" size="sm" variant="outline" className="w-full" disabled={isPending}>
                {isPending ? "Adding…" : "Add"}
              </Button>
            </div>
          </form>
        ))}
      </div>

      {actionState.message ? (
        <p role={actionState.status === "error" ? "alert" : "status"} className={actionState.status === "error" ? "mt-3 text-sm text-error" : "mt-3 text-sm text-success"}>
          {actionState.message}
        </p>
      ) : null}
    </Card>
  );
}
