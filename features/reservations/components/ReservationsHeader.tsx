import { Plus } from "lucide-react";

import { Button, SectionHeader } from "@/components/ui";

type ReservationsHeaderProps = {
  onAddReservation?: () => void;
};

export function ReservationsHeader({
  onAddReservation,
}: ReservationsHeaderProps) {
  return (
    <SectionHeader
      title="Reservations"
      description="Keep flights, stays, tickets, and transport details together for the whole trip."
      className="mb-0"
      action={onAddReservation ? (
        <Button size="md" onClick={onAddReservation}>
          <Plus className="size-4" />
          Add reservation
        </Button>
      ) : undefined}
    />
  );
}
