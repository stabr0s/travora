import Link from "next/link";
import { ReceiptText } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import {
  formatPublicShareDateRange,
  PublicShareContentSections,
} from "@/features/public-share/components/PublicShareContentSections";
import type { PublicSharedTrip } from "@/features/public-share/types/public-share";

type PublicShareScreenProps = {
  share: PublicSharedTrip;
};

export function PublicShareScreen({ share }: PublicShareScreenProps) {
  const { trip } = share;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            Travora
          </Link>
          <nav className="flex flex-col gap-2 sm:flex-row">
            <Link className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground shadow-xs hover:bg-surface" href="/login">
              Sign in
            </Link>
            <Link className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary-hover" href="/register">
              Create your own trip
            </Link>
          </nav>
        </header>

        <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(74,144,226,0.28),_transparent_34%),linear-gradient(135deg,_#111827,_#1f2937_52%,_#334155)] p-6 text-white shadow-lg sm:p-8">
          <Badge className="bg-white/15 text-white">Shared trip</Badge>
          <h1 className="mt-5 max-w-3xl break-words text-4xl font-semibold tracking-tight sm:text-6xl">
            {trip.title}
          </h1>
          <div className="mt-6 grid gap-3 text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-4">
            <p><span className="text-white">Destination:</span> {trip.destination || "Not set"}</p>
            <p><span className="text-white">Dates:</span> {formatPublicShareDateRange(trip.startDate, trip.endDate)}</p>
            <p><span className="text-white">Status:</span> {trip.status || "planning"}</p>
            <p><span className="text-white">Currency:</span> {trip.currency || "Not set"}</p>
          </div>
          {trip.description ? <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/80">{trip.description}</p> : null}
          <p className="mt-6 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80">
            This public page is read-only. Sign in or create an account to plan your own trip in Travora.
          </p>
        </section>

        <PublicShareContentSections share={share} />

        <Card padding="sm" className="flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2"><ReceiptText className="size-4" /> Public links are read-only. Participant details and internal IDs are hidden.</span>
          <Link href="/register" className="font-medium text-primary hover:text-primary-hover">Start planning in Travora</Link>
        </Card>
      </div>
    </main>
  );
}
