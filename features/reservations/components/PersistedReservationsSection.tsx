"use client";

import { useActionState, useMemo, useState } from "react";
import { ReceiptText } from "lucide-react";

import { Button, Card, EmptyState } from "@/components/ui";
import { createReservationAction } from "@/features/reservations/actions/reservation-actions";
import { PersistedAddReservationPanel } from "@/features/reservations/components/PersistedAddReservationPanel";
import { PersistedReservationCard } from "@/features/reservations/components/PersistedReservationCard";
import { ReservationsFilters } from "@/features/reservations/components/ReservationsFilters";
import { ReservationsHeader } from "@/features/reservations/components/ReservationsHeader";
import type { CreateReservationActionState, PersistedReservation } from "@/features/reservations/types/persisted-reservation";
import type { ReservationFilter } from "@/features/reservations/types/reservation";

type PersistedReservationsSectionProps = {
  tripId: string;
  reservations: PersistedReservation[];
  loadError?: string;
};

const initialCreateState: CreateReservationActionState = { status: "idle" };

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
  loadError,
}: PersistedReservationsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<ReservationFilter>("all");
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [createState, createAction, isPending] = useActionState(
    createReservationAction,
    initialCreateState,
  );
  const filteredReservations = useMemo(
    () => filterReservations(reservations, activeFilter),
    [activeFilter, reservations],
  );

  return (
    <section className="space-y-6">
      <ReservationsHeader onAddReservation={() => setIsAddPanelOpen(true)} />
      {isAddPanelOpen ? (
        <PersistedAddReservationPanel
          tripId={tripId}
          actionState={createState}
          formAction={createAction}
          isPending={isPending}
          onClose={() => setIsAddPanelOpen(false)}
        />
      ) : null}
      {loadError ? <Card padding="sm" className="text-sm text-error">{loadError}</Card> : null}

      {!reservations.length ? (
        <EmptyState
          icon={ReceiptText}
          title="No reservations yet"
          description="Save the first flight, stay, ticket, or transport booking for this trip."
          action={<Button onClick={() => setIsAddPanelOpen(true)}>Add first reservation</Button>}
        />
      ) : (
        <>
          <ReservationsFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          {filteredReservations.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {filteredReservations.map((reservation) => (
                <PersistedReservationCard key={reservation.id} reservation={reservation} />
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
