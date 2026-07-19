"use client";

import { useActionState, useState, useTransition } from "react";
import { Copy, LinkIcon, XCircle } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import {
  createTripInviteAction,
  revokeTripInviteAction,
} from "@/features/invites/actions/trip-invite-actions";
import type {
  PersistedTripInvite,
  TripInviteActionState,
} from "@/features/invites/types/trip-invite";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";
const initialState: TripInviteActionState = { status: "idle" };

type TripInviteManagerProps = {
  tripId: string;
  invites: PersistedTripInvite[];
};

function InviteLink({ token }: { token: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const path = `/invite/${token}`;

  function copy() {
    navigator.clipboard.writeText(`${window.location.origin}${path}`)
      .then(() => setMessage("Copied."))
      .catch(() => setMessage("Copy the link manually."));
  }

  return (
    <div className="space-y-2">
      <code className="block break-all rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground">
        {path}
      </code>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={copy}>
          <Copy className="size-4" />
          Copy invite link
        </Button>
        {message ? <span className="text-xs text-muted">{message}</span> : null}
      </div>
    </div>
  );
}

export function TripInviteManager({ tripId, invites }: TripInviteManagerProps) {
  const [state, formAction, isCreating] = useActionState(createTripInviteAction, initialState);
  const [message, setMessage] = useState<TripInviteActionState | null>(null);
  const [isPending, startTransition] = useTransition();

  function revoke(invite: PersistedTripInvite) {
    if (!window.confirm(`Revoke invite for ${invite.email}?`)) return;
    startTransition(async () => {
      setMessage(await revokeTripInviteAction(tripId, invite.id));
    });
  }

  return (
    <Card className="space-y-5 border-primary/15">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
          <LinkIcon className="size-5 text-primary" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Create invite link</h2>
          <p className="mt-1 text-sm text-muted">
            Invite someone by email, even before they have a Travora account.
            No automatic email is sent. Copy and send this link manually.
          </p>
        </div>
      </div>

      <form action={formAction} className="grid gap-4 md:grid-cols-[1fr_180px_auto] md:items-end">
        <input type="hidden" name="tripId" value={tripId} />
        <label className="text-sm font-medium text-foreground">
          Invitee email
          <input className={fieldClassName} name="email" type="email" placeholder="traveler@example.com" required />
        </label>
        <label className="text-sm font-medium text-foreground">
          Role
          <select className={fieldClassName} name="role" defaultValue="viewer">
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
        </label>
        <Button type="submit" className="w-full md:w-auto" disabled={isCreating}>
          {isCreating ? "Creating…" : "Create link"}
        </Button>
      </form>

      {(state.message || message?.message) ? (
        <p
          role={(state.status === "error" || message?.status === "error") ? "alert" : "status"}
          className={(state.status === "error" || message?.status === "error")
            ? "rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error"
            : "rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"}
        >
          {state.message || message?.message}
        </p>
      ) : null}

      <div className="space-y-3 border-t border-border-subtle pt-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Pending invite links</h3>
          <p className="mt-1 text-xs text-muted">Accepted and revoked invites are hidden from this MVP list.</p>
        </div>
        {invites.length ? (
          <div className="space-y-3">
            {invites.map((invite) => (
              <div key={invite.id} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium text-foreground">{invite.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge variant={invite.role === "editor" ? "success" : "outline"}>
                        {invite.role === "editor" ? "Editor" : "Viewer"}
                      </Badge>
                      <Badge>Pending</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full text-error sm:w-auto" onClick={() => revoke(invite)} disabled={isPending}>
                    <XCircle className="size-4" />
                    Revoke
                  </Button>
                </div>
                <div className="mt-4">
                  <InviteLink token={invite.token} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-surface px-4 py-3 text-sm text-muted">
            No pending invite links yet. Create one when someone needs access but is not ready to be added directly.
          </p>
        )}
      </div>
    </Card>
  );
}
