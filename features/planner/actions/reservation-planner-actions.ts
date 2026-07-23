"use server";

import { revalidatePath } from "next/cache";

import { addReservationToPlanner } from "@/features/planner/services/reservation-planner-service";
import type { CreatePlannerItemActionState } from "@/features/planner/types/persisted-planner";
import { isUuid } from "@/lib/validation/is-uuid";

export async function addReservationToPlannerAction(
  tripId: string,
  reservationId: string,
): Promise<CreatePlannerItemActionState> {
  if (!isUuid(tripId) || !isUuid(reservationId)) {
    return { status: "error", message: "This reservation is not available." };
  }

  const result = await addReservationToPlanner({ tripId, reservationId });
  if (result.error) {
    return { status: "error", message: result.error.message };
  }

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Reservation added to Planner." };
}
