"use client";

import { useMemo, useState, useTransition } from "react";
import { ReceiptText } from "lucide-react";

import { Button, Card, EmptyState } from "@/components/ui";
import { deleteReservationAction } from "@/features/reservations/actions/reservation-actions";
import { PersistedAddReservationPanel } from "@/features/reservations/components/PersistedAddReservationPanel";
import { PersistedReservationCard } from "@/features/reservations/components/PersistedReservationCard";
import { ReservationsFilters } from "@/features/reservations/components/ReservationsFilters";
import { ReservationsHeader } from "@/features/reservations/components/ReservationsHeader";
import { useScrollIntoViewOnOpen } from "@/hooks/useScrollIntoViewOnOpen";
import type { CreateReservationActionState, PersistedReservation } from "@/features/reservations/types/persisted-reservation";
import type { ReservationFilter } from "@/features/reservations/types/reservation";
import type { PersistedTravelLink } from "@/features/travel-links/types/travel-link";

type PersistedReservationsSectionProps = {
  tripId: string;
  reservations: PersistedReservation[];
  tripCurrency?: string;
  loadError?: string;
  canEditTrip: boolean;
  travelLinks?: PersistedTravelLink[];
  travelLinksError?: string;
};

function filterReservations(reservations: PersistedReservation[], filter: ReservationFilter) {
  if (filter === "flights") return reservations.filter((item) => item.type === "flight");
  if (filter === "hotels") return reservations.filter((item) => item.type === "hotel");
  if (filter === "transport") return reservations.filter((item) => ["car", "transport"].includes(item.type || ""));
  if (filter === "tickets") return reservations.filter((item) => item.type === "ticket");
  if (filter === "unpaid") return reservations.filter((item) => item.status === "unpaid");
  return reservations;
}

export function PersistedReservationsSection({
  tripId,
  reservations,
  tripCurrency,
  loadError,
  canEditTrip,
  travelLinks = [],
  travelLinksError,
}: PersistedReservationsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<ReservationFilter>("all");
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<PersistedReservation | null>(null);
  const [message, setMessage] = useState<CreateReservationActionState | null>(null);
  const [isPending, startTransition] = useTransition();
  const panelRef = useScrollIntoViewOnOpen<HTMLDivElement>(isAddPanelOpen);
  const filteredReservations = useMemo(
    () => filterReservations(reservations, activeFilter),
    [activeFilter, reservations],
  );

  function openAddPanel() {
    setEditingReservation(null);
    setIsAddPanelOpen(true);
  }

  function handleDelete(reservation: PersistedReservation) {
    if (!window.confirm(`Delete “${reservation.title}”? This cannot be undone.`)) return;
    startTransition(async () => setMessage(await deleteReservationAction(tripId, reservation.id)));
  }

  return (
    <section className="space-y-6">
      <ReservationsHeader onAddReservation={canEditTrip ? openAddPanel : undefined} />
      {isAddPanelOpen && canEditTrip ? (
        <div ref={panelRef}>
          <PersistedAddReservationPanel
            key={editingReservation?.id || "new"}
            tripId={tripId}
            reservation={editingReservation}
            tripCurrency={tripCurrency}
            onClose={() => setIsAddPanelOpen(false)}
          />
        </div>
      ) : null}
      {loadError ? <Card padding="sm" className="text-sm text-error">{loadError}</Card> : !reservations.length ? (
        <EmptyState
          icon={ReceiptText}
          title="No reservations yet"
          description="Keep flights, stays, tickets, and transport bookings together. Add the first reservation when you book something."
          action={canEditTrip ? <Button onClick={openAddPanel}>Add first reservation</Button> : undefined}
        />
      ) : (
        <>
          {message?.message ? <Card padding="sm" className={message.status === "error" ? "text-sm text-error" : "text-sm text-success"}>{message.message}</Card> : null}
          <ReservationsFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          {filteredReservations.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {filteredReservations.map((reservation) => (
                <PersistedReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  isPending={isPending}
                  onEdit={canEditTrip ? (selected) => { setEditingReservation(selected); setIsAddPanelOpen(true); } : undefined}
                  onDelete={canEditTrip ? handleDelete : undefined}
                  canEditTrip={canEditTrip}
                  travelLinks={travelLinks.filter((link) => link.reservation_id === reservation.id)}
                  travelLinksError={travelLinksError}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ReceiptText}
              title="No reservations in this view"
              description="Choose another filter to see the rest of your saved bookings."
              className="min-h-80"
            />
          )}
        </>
      )}
    </section>
  );
}
