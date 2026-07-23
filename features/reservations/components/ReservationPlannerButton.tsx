"use client";

import { useState, useTransition } from "react";
import { ListPlus } from "lucide-react";

import { Button } from "@/components/ui";
import { addReservationToPlannerAction } from "@/features/planner/actions/reservation-planner-actions";
import type { CreatePlannerItemActionState } from "@/features/planner/types/persisted-planner";
import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";

type ReservationPlannerButtonProps = {
  reservation: PersistedReservation;
};

export function ReservationPlannerButton({
  reservation,
}: ReservationPlannerButtonProps) {
  const [state, setState] = useState<CreatePlannerItemActionState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();
  const hasDate = Boolean(reservation.start_date);

  function handleAdd() {
    startTransition(async () => {
      setState(await addReservationToPlannerAction(
        reservation.trip_id,
        reservation.id,
      ));
    });
  }

  return (
    <div className="w-full sm:w-auto">
      <Button
        size="sm"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={handleAdd}
        disabled={!hasDate || isPending}
        title={hasDate
          ? "Create a regular Planner item from this reservation."
          : "Add a date to this reservation first."}
      >
        <ListPlus className="size-4" />
        {!hasDate ? "Add a date first" : isPending ? "Adding…" : "Add to planner"}
      </Button>
      {state.message ? (
        <p
          className={state.status === "error"
            ? "mt-1.5 max-w-56 text-xs leading-relaxed text-error"
            : "mt-1.5 max-w-56 text-xs leading-relaxed text-success"}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
