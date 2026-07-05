import { ReceiptText } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { ReservationCard } from "@/features/reservations/components/ReservationCard";
import type { Reservation } from "@/features/reservations/types/reservation";

type ReservationsListProps = {
  reservations: Reservation[];
};

export function ReservationsList({
  reservations,
}: ReservationsListProps) {
  if (reservations.length === 0) {
    return (
      <EmptyState
        icon={ReceiptText}
        title="No reservations in this view"
        description="Choose another filter or open the add reservation preview."
        className="min-h-80"
      />
    );
  }

  return (
    <section className="grid gap-5 xl:grid-cols-2">
      {reservations.map((reservation) => (
        <ReservationCard key={reservation.id} reservation={reservation} />
      ))}
    </section>
  );
}
