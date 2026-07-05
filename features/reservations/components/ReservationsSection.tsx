"use client";

import { useMemo, useState } from "react";
import { ReceiptText } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { AddReservationPanel } from "@/features/reservations/components/AddReservationPanel";
import { ReservationsFilters } from "@/features/reservations/components/ReservationsFilters";
import { ReservationsHeader } from "@/features/reservations/components/ReservationsHeader";
import { ReservationsList } from "@/features/reservations/components/ReservationsList";
import { ReservationsStats } from "@/features/reservations/components/ReservationsStats";
import { SettlementPreviewCard } from "@/features/reservations/components/SettlementPreviewCard";
import { getMockReservationsByTripId } from "@/features/reservations/data/mock-reservations";
import type {
  Reservation,
  ReservationFilter,
} from "@/features/reservations/types/reservation";

type ReservationsSectionProps = {
  tripId: string;
};

function filterReservations(
  reservations: Reservation[],
  filter: ReservationFilter,
): Reservation[] {
  switch (filter) {
    case "flights":
      return reservations.filter((reservation) => reservation.type === "flight");
    case "hotels":
      return reservations.filter((reservation) => reservation.type === "hotel");
    case "transport":
      return reservations.filter((reservation) =>
        ["car", "transport"].includes(reservation.type),
      );
    case "tickets":
      return reservations.filter((reservation) => reservation.type === "ticket");
    case "unpaid":
      return reservations.filter((reservation) => reservation.status === "unpaid");
    default:
      return reservations;
  }
}

export function ReservationsSection({
  tripId,
}: ReservationsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<ReservationFilter>("all");
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const reservations = useMemo(
    () => getMockReservationsByTripId(tripId),
    [tripId],
  );
  const filteredReservations = useMemo(
    () => filterReservations(reservations, activeFilter),
    [activeFilter, reservations],
  );

  if (reservations.length === 0) {
    return (
      <section className="space-y-6">
        <ReservationsHeader onAddReservation={() => setIsAddPanelOpen(true)} />
        {isAddPanelOpen ? (
          <AddReservationPanel onClose={() => setIsAddPanelOpen(false)} />
        ) : null}
        <EmptyState
          icon={ReceiptText}
          title="No reservations yet"
          description="Flights, stays, tickets, and transport bookings will appear here."
          className="min-h-96"
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <ReservationsHeader onAddReservation={() => setIsAddPanelOpen(true)} />

      {isAddPanelOpen ? (
        <AddReservationPanel onClose={() => setIsAddPanelOpen(false)} />
      ) : null}

      <ReservationsStats reservations={reservations} />
      <SettlementPreviewCard reservations={reservations} />
      <ReservationsFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <ReservationsList reservations={filteredReservations} />
    </section>
  );
}
