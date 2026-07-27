"use client";

import { useState, useTransition } from "react";
import { Link2 } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import { deleteTravelLinkAction } from "@/features/travel-links/actions/travel-link-actions";
import { TravelLinkForm } from "@/features/travel-links/components/TravelLinkForm";
import { TravelLinkItem } from "@/features/travel-links/components/TravelLinkItem";
import type {
  PersistedTravelLink,
  TravelLinkActionState,
} from "@/features/travel-links/types/travel-link";

type TravelLinksCardProps = {
  tripId: string;
  reservationId?: string | null;
  links: PersistedTravelLink[];
  loadError?: string;
  canEditTrip: boolean;
  compact?: boolean;
};

export function TravelLinksCard({
  tripId,
  reservationId,
  links,
  loadError,
  canEditTrip,
  compact,
}: TravelLinksCardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<PersistedTravelLink | null>(null);
  const [message, setMessage] = useState<TravelLinkActionState | null>(null);
  const [isPending, startTransition] = useTransition();
  const isReservationLevel = Boolean(reservationId);
  const title = isReservationLevel
    ? "Reservation documents & links"
    : "Trip documents & links";
  const description = isReservationLevel
    ? "Keep confirmation pages, tickets, vouchers, and check-in links with this booking."
    : "Keep insurance, visa guidance, itineraries, maps, and shared folders useful for the whole trip.";
  const emptyDescription = isReservationLevel
    ? "No documents or links for this reservation yet."
    : "No trip documents yet. Add a useful link when insurance, entry guidance, an itinerary, map, or shared folder is ready.";

  function openForm(link?: PersistedTravelLink) {
    setEditingLink(link || null);
    setIsFormOpen(true);
  }

  function handleDelete(link: PersistedTravelLink) {
    if (!window.confirm(`Delete “${link.title}”? This cannot be undone.`)) return;
    startTransition(async () => setMessage(await deleteTravelLinkAction(tripId, link.id)));
  }

  const content = (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {!compact ? (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
              <Link2 className="size-5 text-primary" />
            </span>
          ) : null}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className={compact ? "font-semibold tracking-tight text-foreground" : "text-lg font-semibold tracking-tight text-foreground"}>
                {title}
              </h2>
              <Badge variant="outline">{links.length}</Badge>
            </div>
            {!compact ? (
              <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
            ) : null}
          </div>
        </div>
        {canEditTrip && !isFormOpen ? (
          <Button type="button" size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => openForm()}>
            {isReservationLevel ? "Add reservation link" : "Add trip link"}
          </Button>
        ) : null}
      </div>

      {loadError ? <p className="rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error">{loadError}</p> : null}
      {message?.message ? (
        <p className={message.status === "error" ? "rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error" : "rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"}>
          {message.message}
        </p>
      ) : null}
      {isFormOpen && canEditTrip ? (
        <TravelLinkForm
          tripId={tripId}
          reservationId={reservationId || editingLink?.reservation_id || null}
          link={editingLink}
          onClose={() => setIsFormOpen(false)}
        />
      ) : null}
      {links.length ? (
        <div className={compact ? "space-y-2" : "space-y-3"}>
          {links.map((link) => (
            <TravelLinkItem
              key={link.id}
              link={link}
              compact={compact}
              canEditTrip={canEditTrip}
              isPending={isPending}
              onEdit={openForm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : !loadError && !isFormOpen ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-4 py-5 text-sm text-muted">
          {emptyDescription}
        </div>
      ) : null}
    </>
  );

  return compact ? (
    <div className="space-y-3 rounded-2xl border border-border-subtle bg-surface px-3 py-3">{content}</div>
  ) : (
    <Card padding="md" className="space-y-5">{content}</Card>
  );
}
