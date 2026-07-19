"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Mail, ShieldCheck, TicketCheck } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import { acceptTripInviteAction } from "@/features/invites/actions/trip-invite-actions";
import type {
  TripInviteActionState,
  TripInviteAuthState,
  TripInvitePreview,
} from "@/features/invites/types/trip-invite";

const initialState: TripInviteActionState = { status: "idle" };

type InviteAcceptScreenProps = {
  token: string;
  invite: TripInvitePreview;
  authState: TripInviteAuthState;
};

export function InviteAcceptScreen({
  token,
  invite,
  authState,
}: InviteAcceptScreenProps) {
  const [state, formAction, isPending] = useActionState(acceptTripInviteAction, initialState);
  const nextPath = `/invite/${token}`;
  const encodedNext = encodeURIComponent(nextPath);
  const signedInEmail = authState.email?.trim().toLowerCase() || null;
  const invitedEmail = invite.invitedEmail.trim().toLowerCase();
  const isMatchingEmail = Boolean(signedInEmail && signedInEmail === invitedEmail);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">Travora</Link>
          <Badge>Trip invite</Badge>
        </header>

        <div className="flex flex-1 items-center py-10">
          <Card className="w-full space-y-6 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-subtle">
                <TicketCheck className="size-6 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">You were invited to</p>
                <h1 className="mt-2 break-words text-3xl font-semibold tracking-tight text-foreground">
                  {invite.tripTitle}
                </h1>
                <p className="mt-2 text-sm text-muted">
                  {invite.tripDestination || "Destination not set"}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Invited email</p>
                <p className="mt-2 flex items-start gap-2 break-words text-sm font-medium text-foreground">
                  <Mail className="mt-0.5 size-4 shrink-0 text-muted" />
                  {invite.invitedEmail}
                </p>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Role</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-medium capitalize text-foreground">
                  <ShieldCheck className="size-4 text-muted" />
                  {invite.invitedRole}
                </p>
              </div>
            </div>

            {!authState.isSignedIn ? (
              <div className="space-y-4 rounded-2xl border border-border bg-background p-4">
                <p className="text-sm leading-relaxed text-muted">
                  Sign in or create an account with <span className="font-medium text-foreground">{invite.invitedEmail}</span> to accept this invite.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground shadow-xs hover:bg-surface" href={`/login?next=${encodedNext}`}>
                    Sign in
                  </Link>
                  <Link className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary-hover" href={`/register?next=${encodedNext}`}>
                    Create account
                  </Link>
                </div>
              </div>
            ) : !isMatchingEmail ? (
              <div className="rounded-2xl bg-error-subtle p-4 text-sm leading-relaxed text-error">
                This invite is for another email address. Sign in with {invite.invitedEmail} to accept it.
              </div>
            ) : (
              <form action={formAction} className="space-y-4">
                <input type="hidden" name="token" value={token} />
                <p className="rounded-2xl bg-primary-subtle p-4 text-sm leading-relaxed text-primary">
                  You are signed in with the invited email. Accepting will add you to this trip as {invite.invitedRole === "editor" ? "an editor" : "a viewer"}.
                </p>
                {state.message ? (
                  <p role="alert" className="rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error">
                    {state.message}
                  </p>
                ) : null}
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                  {isPending ? "Accepting…" : "Accept invite"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
