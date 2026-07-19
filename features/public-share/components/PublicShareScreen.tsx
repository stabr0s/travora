import Link from "next/link";
import {
  CalendarDays,
  CircleDollarSign,
  Luggage,
  MapPin,
  Plane,
  ReceiptText,
} from "lucide-react";

import { Badge, Card, SectionHeader } from "@/components/ui";
import type { PublicSharedTrip } from "@/features/public-share/types/public-share";

type PublicShareScreenProps = {
  share: PublicSharedTrip;
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value.length === 10 ? `${value}T00:00:00Z` : value));
}

function formatDateRange(start: string | null, end: string | null) {
  const startLabel = formatDate(start);
  const endLabel = formatDate(end);
  if (startLabel && endLabel) return `${startLabel} – ${endLabel}`;
  return startLabel || endLabel || "Dates not set";
}

function formatMoney(amount: number | null, currency: string | null) {
  if (amount == null) return null;
  return `${Number(amount).toFixed(2)} ${(currency || "EUR").toUpperCase()}`;
}

function PublicSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <SectionHeader
        title={title}
        description="Shared in read-only mode."
        action={<Icon className="size-5 text-muted" />}
      />
      {children}
    </section>
  );
}

function EmptyCopy({ label }: { label: string }) {
  return (
    <Card padding="sm" className="text-sm text-muted">
      No {label} shared yet.
    </Card>
  );
}

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
            <p><span className="text-white">Dates:</span> {formatDateRange(trip.startDate, trip.endDate)}</p>
            <p><span className="text-white">Status:</span> {trip.status || "planning"}</p>
            <p><span className="text-white">Currency:</span> {trip.currency || "Not set"}</p>
          </div>
          {trip.description ? <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/80">{trip.description}</p> : null}
          <p className="mt-6 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80">
            This public page is read-only. Sign in or create an account to plan your own trip in Travora.
          </p>
        </section>

        <PublicSection title="Places" icon={MapPin}>
          {share.places.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {share.places.map((place, index) => (
                <Card key={`${place.title}-${index}`} padding="sm" className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="break-words font-medium text-foreground">{place.title}</h3>
                    {place.category ? <Badge variant="outline">{place.category}</Badge> : null}
                    {place.status ? <Badge>{place.status}</Badge> : null}
                  </div>
                  <p className="text-sm text-muted">{[place.address, place.city, place.country].filter(Boolean).join(", ") || "Location not set"}</p>
                  {place.website ? <p className="break-words text-sm text-muted">{place.website}</p> : null}
                  {place.notes ? <p className="text-sm leading-relaxed text-muted">{place.notes}</p> : null}
                </Card>
              ))}
            </div>
          ) : <EmptyCopy label="places" />}
        </PublicSection>

        <PublicSection title="Planner" icon={CalendarDays}>
          {share.planner.length ? (
            <div className="space-y-3">
              {share.planner.map((item, index) => (
                <Card key={`${item.title}-${index}`} padding="sm">
                  <p className="font-medium text-foreground">{[item.startTime?.slice(0, 5), item.endTime?.slice(0, 5)].filter(Boolean).join(" – ") || "Flexible"} · {item.title}</p>
                  <p className="mt-1 text-sm text-muted">{[formatDate(item.date) || "Unscheduled", item.type, item.place?.title].filter(Boolean).join(" · ")}</p>
                  {item.description ? <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p> : null}
                </Card>
              ))}
            </div>
          ) : <EmptyCopy label="planner items" />}
        </PublicSection>

        <div className="grid gap-6 lg:grid-cols-2">
          <PublicSection title="Reservations" icon={Plane}>
            {share.reservations.length ? (
              <div className="space-y-3">
                {share.reservations.map((reservation, index) => (
                  <Card key={`${reservation.title}-${index}`} padding="sm">
                    <p className="font-medium text-foreground">{reservation.title}</p>
                    <p className="mt-1 text-sm text-muted">{[reservation.type, reservation.provider, reservation.status].filter(Boolean).join(" · ")}</p>
                    <p className="mt-1 text-sm text-muted">{formatDateRange(reservation.startDate, reservation.endDate)}{formatMoney(reservation.price, reservation.currency) ? ` · ${formatMoney(reservation.price, reservation.currency)}` : ""}</p>
                    {reservation.notes ? <p className="mt-2 text-sm leading-relaxed text-muted">{reservation.notes}</p> : null}
                  </Card>
                ))}
              </div>
            ) : <EmptyCopy label="reservations" />}
          </PublicSection>

          <PublicSection title="Budget" icon={CircleDollarSign}>
            {share.budget.length ? (
              <div className="space-y-3">
                {share.budget.map((expense, index) => (
                  <Card key={`${expense.title}-${index}`} padding="sm" className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="break-words font-medium text-foreground">{expense.title}</p>
                      <p className="text-sm text-muted">{[expense.category, expense.status, formatDate(expense.date)].filter(Boolean).join(" · ")}</p>
                    </div>
                    <p className="font-semibold text-foreground">{formatMoney(expense.amount, expense.currency) || "Not set"}</p>
                  </Card>
                ))}
              </div>
            ) : <EmptyCopy label="budget expenses" />}
          </PublicSection>
        </div>

        <PublicSection title="Packing" icon={Luggage}>
          {share.packing.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {share.packing.map((item, index) => (
                <Card key={`${item.name}-${index}`} padding="sm">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="mt-1 text-sm text-muted">{[item.category, item.priority].filter(Boolean).join(" · ") || "Packing item"}</p>
                  {item.notes ? <p className="mt-2 text-sm leading-relaxed text-muted">{item.notes}</p> : null}
                </Card>
              ))}
            </div>
          ) : <EmptyCopy label="packing items" />}
        </PublicSection>

        <Card padding="sm" className="flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2"><ReceiptText className="size-4" /> Public links are read-only. Participant details and internal IDs are hidden.</span>
          <Link href="/register" className="font-medium text-primary hover:text-primary-hover">Start planning in Travora</Link>
        </Card>
      </div>
    </main>
  );
}
