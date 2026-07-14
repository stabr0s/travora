"use client";

import { useActionState } from "react";
import { Copy } from "lucide-react";

import { Button, Card } from "@/components/ui";
import { copyPlannerDayAction } from "@/features/planner/actions/planner-usability-actions";
import type { CreatePlannerItemActionState } from "@/features/planner/types/persisted-planner";

const fieldClassName =
  "mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";
const initialState: CreatePlannerItemActionState = { status: "idle" };

type CopyDayOption = {
  date: string;
  label: string;
  count: number;
};

type PersistedCopyDayPanelProps = {
  tripId: string;
  days: CopyDayOption[];
};

export function PersistedCopyDayPanel({
  tripId,
  days,
}: PersistedCopyDayPanelProps) {
  const [actionState, formAction, isPending] = useActionState(
    copyPlannerDayAction,
    initialState,
  );

  if (!days.length) return null;

  return (
    <Card padding="sm">
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="tripId" value={tripId} />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <Copy className="size-4 text-primary" />
              Copy day
            </h2>
            <p className="mt-1 text-sm text-muted">
              Duplicate a planned day into another date. Existing target-day items stay in place.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_auto] lg:max-w-2xl">
            <label className="text-xs font-medium text-muted">
              Source day
              <select className={fieldClassName} name="sourceDate" required>
                {days.map((day) => (
                  <option key={day.date} value={day.date}>
                    {day.label} · {day.count} {day.count === 1 ? "item" : "items"}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-muted">
              Target date
              <input className={fieldClassName} name="targetDate" type="date" required />
            </label>
            <Button type="submit" size="md" className="w-full sm:self-end" disabled={isPending}>
              {isPending ? "Copying…" : "Copy day"}
            </Button>
          </div>
        </div>

        {actionState.message ? (
          <p role={actionState.status === "error" ? "alert" : "status"} className={actionState.status === "error" ? "text-sm text-error" : "text-sm text-success"}>
            {actionState.message}
          </p>
        ) : null}
      </form>
    </Card>
  );
}
