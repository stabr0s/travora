"use client";

import { useActionState, useState } from "react";
import { Info, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import { saveImportantInfoAction } from "@/features/trip-detail/actions/important-info-actions";
import type {
  ImportantInfoActionState,
  TripImportantInfo,
} from "@/features/trip-detail/types/important-info";

type PersistedImportantInfoCardProps = {
  tripId: string;
  importantInfo: TripImportantInfo | null;
  loadError?: string;
  canEditTrip: boolean;
};

const initialState: ImportantInfoActionState = { status: "idle" };
const textareaClassName =
  "mt-3 min-h-44 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

export function PersistedImportantInfoCard({
  tripId,
  importantInfo,
  loadError,
  canEditTrip,
}: PersistedImportantInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(
    async (previousState: ImportantInfoActionState, formData: FormData) => {
      const nextState = await saveImportantInfoAction(previousState, formData);
      if (nextState.status === "success") setIsEditing(false);
      return nextState;
    },
    initialState,
  );
  const content = importantInfo?.content?.trim() || "";

  return (
    <Card padding="md" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <Info className="size-5 text-primary" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Important Info</h2>
            <p className="mt-1 text-sm text-muted">
              Keep addresses, check-in details, emergency contacts, useful links, and group notes in one place.
            </p>
          </div>
        </div>
        {canEditTrip && !isEditing ? (
          <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(true)}>
            {content ? "Edit" : "Add info"}
          </Button>
        ) : null}
      </div>

      {loadError ? <p className="rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error">{loadError}</p> : null}

      {isEditing && canEditTrip ? (
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="tripId" value={tripId} />
          <label className="block text-sm font-medium text-foreground">
            Notes
            <textarea
              className={textareaClassName}
              name="content"
              defaultValue={content}
              placeholder="Accommodation address, check-in details, emergency contacts, group notes…"
            />
          </label>
          <p className="text-xs text-muted">
            This is visible only to trip members. Public share links do not include Important Info.
          </p>
          {state.message ? (
            <p
              role={state.status === "error" ? "alert" : "status"}
              className={state.status === "error"
                ? "rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error"
                : "rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"}
            >
              {state.message}
            </p>
          ) : null}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setIsEditing(false)}>
              <X className="size-4" />
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      ) : content ? (
        <div className="whitespace-pre-line break-words rounded-2xl bg-surface px-4 py-4 text-sm leading-relaxed text-foreground">
          {content}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-4 py-5 text-sm text-muted">
          Keep addresses, check-in details, emergency contacts, useful links, and group notes in one place.
        </div>
      )}
    </Card>
  );
}
