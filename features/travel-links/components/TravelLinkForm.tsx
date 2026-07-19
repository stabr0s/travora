"use client";

import { useActionState } from "react";
import { Link2, X } from "lucide-react";

import { Button } from "@/components/ui";
import {
  createTravelLinkAction,
  updateTravelLinkAction,
} from "@/features/travel-links/actions/travel-link-actions";
import type {
  PersistedTravelLink,
  TravelLinkActionState,
} from "@/features/travel-links/types/travel-link";
import { travelLinkTypes } from "@/features/travel-links/types/travel-link";

type TravelLinkFormProps = {
  tripId: string;
  reservationId?: string | null;
  link?: PersistedTravelLink | null;
  onClose: () => void;
};

const initialState: TravelLinkActionState = { status: "idle" };
const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";
const textareaClassName =
  "mt-2 min-h-24 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

function labelForType(type: string) {
  return type.replace("_", " ");
}

export function TravelLinkForm({
  tripId,
  reservationId,
  link,
  onClose,
}: TravelLinkFormProps) {
  const isEditing = Boolean(link);
  const [state, formAction, isPending] = useActionState(
    async (previousState: TravelLinkActionState, formData: FormData) => {
      const nextState = isEditing
        ? await updateTravelLinkAction(previousState, formData)
        : await createTravelLinkAction(previousState, formData);
      if (nextState.status === "success") onClose();
      return nextState;
    },
    initialState,
  );

  return (
    <form action={formAction} className="rounded-2xl border border-primary/15 bg-surface p-4">
      <input type="hidden" name="tripId" value={tripId} />
      {reservationId ? <input type="hidden" name="reservationId" value={reservationId} /> : null}
      {link ? <input type="hidden" name="recordId" value={link.id} /> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <Link2 className="size-4 text-primary" />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold tracking-tight text-foreground">
              {isEditing ? "Edit travel link" : "Add travel link"}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              URL-only for now. File uploads and automatic email parsing are planned for later.
            </p>
          </div>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={onClose} aria-label="Close travel link form">
          <X className="size-4" />
        </Button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-foreground">
          Title
          <input className={fieldClassName} name="title" defaultValue={link?.title || ""} placeholder="Hotel booking page" required />
        </label>
        <label className="text-sm font-medium text-foreground">
          Type
          <select className={fieldClassName} name="linkType" defaultValue={link?.link_type || "other"}>
            {travelLinkTypes.map((type) => (
              <option key={type} value={type} className="capitalize">
                {labelForType(type)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-foreground sm:col-span-2">
          URL
          <input
            className={fieldClassName}
            name="url"
            defaultValue={link?.url || ""}
            placeholder="https://example.com/booking"
            type="url"
            required
          />
          <span className="mt-1 block text-xs text-muted">Only http and https links are supported.</span>
        </label>
        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Note
          <textarea className={textareaClassName} name="note" defaultValue={link?.note || ""} placeholder="Optional context for the group" />
        </label>
      </div>

      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={state.status === "error"
            ? "mt-4 rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error"
            : "mt-4 rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"}
        >
          {state.message}
        </p>
      ) : null}
      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? "Saving…" : isEditing ? "Update link" : "Save link"}
        </Button>
      </div>
    </form>
  );
}
