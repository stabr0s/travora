"use client";

import { useActionState } from "react";
import { Info, UserPlus, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import {
  addParticipantAction,
  updateParticipantAction,
} from "@/features/participants/actions/participant-actions";
import type {
  ParticipantActionState,
  PersistedParticipant,
} from "@/features/participants/types/persisted-participant";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";
const initialState: ParticipantActionState = { status: "idle" };

type PersistedInviteParticipantPanelProps = {
  tripId: string;
  participant?: PersistedParticipant | null;
  onClose: () => void;
};

export function PersistedInviteParticipantPanel({
  tripId,
  participant,
  onClose,
}: PersistedInviteParticipantPanelProps) {
  const isEditing = Boolean(participant);
  const [actionState, formAction, isPending] = useActionState(
    isEditing ? updateParticipantAction : addParticipantAction,
    initialState,
  );

  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <form action={formAction}>
        <input type="hidden" name="tripId" value={tripId} />
        {participant ? <input type="hidden" name="memberId" value={participant.memberId} /> : null}

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle"><UserPlus className="size-5 text-primary" /></span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{isEditing ? "Edit trip access" : "Add existing Travora user"}</h2>
              <p className="mt-1 text-sm text-muted">{isEditing ? "Update this person's role and access status." : "Add someone who already has a registered Travora account."}</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close participant panel"><X className="size-4" /></Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {!isEditing ? (
            <label className="text-sm font-medium text-foreground sm:col-span-2">
              Email
              <input className={fieldClassName} name="email" type="email" placeholder="traveler@example.com" required />
            </label>
          ) : (
            <div className="rounded-xl bg-surface p-3.5 text-sm text-muted sm:col-span-2">{participant?.fullName || participant?.email || "Trip member"}</div>
          )}
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Role
            <select className={fieldClassName} defaultValue={participant?.role === "editor" ? "editor" : "viewer"} name="role">
              <option value="editor">Editor</option><option value="viewer">Viewer</option>
            </select>
          </label>
          {isEditing ? (
            <label className="text-sm font-medium text-foreground sm:col-span-2">
              Access status
              <select className={fieldClassName} defaultValue={participant?.status || "active"} name="status">
                <option value="active">Active</option><option value="pending">Pending</option><option value="invited">Invited</option>
              </select>
            </label>
          ) : <input type="hidden" name="status" value="active" />}
        </div>

        {!isEditing ? (
          <div className="mt-5 flex items-start gap-2 rounded-xl bg-primary-subtle p-3 text-xs text-primary">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>Email invitations are not available yet. Ask the person to create an account first, then add them here.</p>
          </div>
        ) : null}
        {actionState.message ? <p role={actionState.status === "error" ? "alert" : "status"} className={actionState.status === "error" ? "mt-5 rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error" : "mt-5 rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"}>{actionState.message}</p> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" size="md" className="w-full sm:w-auto" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="md" className="w-full sm:w-auto" disabled={isPending}>{isPending ? "Saving access…" : isEditing ? "Update access" : "Add user"}</Button>
        </div>
      </form>
    </Card>
  );
}
