import Link from "next/link";
import { TicketX } from "lucide-react";

import { Card } from "@/components/ui";

export function InviteUnavailableScreen() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-6 sm:px-6">
        <header>
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">Travora</Link>
        </header>
        <div className="flex flex-1 items-center py-10">
          <Card className="w-full p-8 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-surface">
              <TicketX className="size-7 text-muted" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
              This invite is not available
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              The invite may have been accepted, revoked, expired, or typed incorrectly.
              Ask the trip owner for a fresh invite link.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary-hover"
            >
              Back to Travora
            </Link>
          </Card>
        </div>
      </div>
    </main>
  );
}
