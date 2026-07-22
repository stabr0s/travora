import {
  CalendarDays,
  CircleDollarSign,
  Luggage,
  MapPin,
  Plane,
  ReceiptText,
} from "lucide-react";

import { Badge, Card, EmptyState, SectionHeader } from "@/components/ui";
import type { PublicSharedTrip } from "@/features/public-share/types/public-share";

export function formatPublicShareDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value.length === 10 ? `${value}T00:00:00Z` : value));
}

export function formatPublicShareDateRange(start: string | null, end: string | null) {
  const startLabel = formatPublicShareDate(start);
  const endLabel = formatPublicShareDate(end);
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
      No {label} are included in this read-only share yet.
    </Card>
  );
}

export function PublicShareContentSections({ share }: { share: PublicSharedTrip }) {
  const hasEnabledContent = [
    share.sections.places,
    share.sections.planner,
    share.sections.reservations,
    share.sections.budget,
    share.sections.packing,
  ].some(Boolean);

  return (
    <>
      {!hasEnabledContent ? (
        <EmptyState
          icon={ReceiptText}
          title="This public share has no sections enabled yet."
          description="The trip owner can choose which read-only sections guests can see."
        />
      ) : null}

      {share.sections.places ? (
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
      ) : null}

      {share.sections.planner ? (
        <PublicSection title="Planner" icon={CalendarDays}>
          {share.planner.length ? (
            <div className="space-y-3">
              {share.planner.map((item, index) => (
                <Card key={`${item.title}-${index}`} padding="sm">
                  <p className="font-medium text-foreground">{[item.startTime?.slice(0, 5), item.endTime?.slice(0, 5)].filter(Boolean).join(" – ") || "Flexible"} · {item.title}</p>
                  <p className="mt-1 text-sm text-muted">{[formatPublicShareDate(item.date) || "Unscheduled", item.type, item.place?.title].filter(Boolean).join(" · ")}</p>
                  {item.description ? <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p> : null}
                </Card>
              ))}
            </div>
          ) : <EmptyCopy label="planner items" />}
        </PublicSection>
      ) : null}

      {share.sections.reservations || share.sections.budget ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {share.sections.reservations ? (
            <PublicSection title="Reservations" icon={Plane}>
              {share.reservations.length ? (
                <div className="space-y-3">
                  {share.reservations.map((reservation, index) => (
                    <Card key={`${reservation.title}-${index}`} padding="sm">
                      <p className="font-medium text-foreground">{reservation.title}</p>
                      <p className="mt-1 text-sm text-muted">{[reservation.type, reservation.provider, reservation.status].filter(Boolean).join(" · ")}</p>
                      <p className="mt-1 text-sm text-muted">{formatPublicShareDateRange(reservation.startDate, reservation.endDate)}{formatMoney(reservation.price, reservation.currency) ? ` · ${formatMoney(reservation.price, reservation.currency)}` : ""}</p>
                      {reservation.notes ? <p className="mt-2 text-sm leading-relaxed text-muted">{reservation.notes}</p> : null}
                    </Card>
                  ))}
                </div>
              ) : <EmptyCopy label="reservations" />}
            </PublicSection>
          ) : null}

          {share.sections.budget ? (
            <PublicSection title="Budget" icon={CircleDollarSign}>
              {share.budget.length ? (
                <div className="space-y-3">
                  {share.budget.map((expense, index) => (
                    <Card key={`${expense.title}-${index}`} padding="sm" className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="break-words font-medium text-foreground">{expense.title}</p>
                        <p className="text-sm text-muted">{[expense.category, expense.status, formatPublicShareDate(expense.date)].filter(Boolean).join(" · ")}</p>
                      </div>
                      <p className="font-semibold text-foreground">{formatMoney(expense.amount, expense.currency) || "Not set"}</p>
                    </Card>
                  ))}
                </div>
              ) : <EmptyCopy label="budget expenses" />}
            </PublicSection>
          ) : null}
        </div>
      ) : null}

      {share.sections.packing ? (
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
      ) : null}
    </>
  );
}
