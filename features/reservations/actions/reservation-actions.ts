"use server";

import { revalidatePath } from "next/cache";

import { createBudgetExpense } from "@/features/budget/services/budget-service";
import type { BudgetCategory } from "@/features/budget/types/budget";
import {
  createReservation,
  deleteReservation,
  updateReservation,
} from "@/features/reservations/services/reservations-service";
import type {
  ReservationStatus,
  ReservationType,
} from "@/features/reservations/types/reservation";
import type { CreateReservationActionState } from "@/features/reservations/types/persisted-reservation";
import { isUuid } from "@/lib/validation/is-uuid";

const validStatuses: ReservationStatus[] = ["paid", "deposit", "unpaid"];

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function shouldAddToBudget(formData: FormData) {
  return formData.get("addToBudget") === "on";
}

function mapReservationTypeToBudgetCategory(type: string): BudgetCategory {
  const reservationType = type as ReservationType;

  if (reservationType === "hotel") return "hotels";
  if (reservationType === "flight") return "flights";
  if (reservationType === "transport" || reservationType === "car") return "transport";
  if (reservationType === "ticket") return "attractions";
  if (reservationType === "insurance") return "insurance";
  return "other";
}

function toExpenseDate(timestamp: number | undefined) {
  return timestamp === undefined
    ? undefined
    : new Date(timestamp).toISOString().slice(0, 10);
}

export async function createReservationAction(
  _previousState: CreateReservationActionState,
  formData: FormData,
): Promise<CreateReservationActionState> {
  const tripId = readField(formData, "tripId");
  const title = readField(formData, "title");
  const startDate = readField(formData, "startDate");
  const endDate = readField(formData, "endDate");
  const totalPriceValue = readField(formData, "totalPrice");
  const requestedStatus = readField(formData, "status") as ReservationStatus;

  if (!isUuid(tripId)) {
    return { status: "error", message: "This saved trip is not available." };
  }

  if (!title) {
    return { status: "error", message: "Enter a title for this reservation." };
  }

  const totalPrice = totalPriceValue ? Number(totalPriceValue) : undefined;
  if (totalPrice !== undefined && (!Number.isFinite(totalPrice) || totalPrice < 0)) {
    return { status: "error", message: "Enter a valid reservation price." };
  }

  const startTimestamp = startDate ? Date.parse(startDate) : undefined;
  const endTimestamp = endDate ? Date.parse(endDate) : undefined;

  if ((startTimestamp !== undefined && Number.isNaN(startTimestamp))
    || (endTimestamp !== undefined && Number.isNaN(endTimestamp))) {
    return { status: "error", message: "Enter valid reservation dates." };
  }

  if (startTimestamp !== undefined && endTimestamp !== undefined && endTimestamp < startTimestamp) {
    return { status: "error", message: "End date cannot be earlier than start date." };
  }

  const result = await createReservation({
    tripId,
    title,
    type: readField(formData, "type"),
    provider: readField(formData, "provider"),
    reservationNumber: readField(formData, "reservationNumber"),
    startDate: startTimestamp !== undefined ? new Date(startTimestamp).toISOString() : undefined,
    endDate: endTimestamp !== undefined ? new Date(endTimestamp).toISOString() : undefined,
    location: readField(formData, "location"),
    totalPrice,
    currency: readField(formData, "currency") || "EUR",
    status: validStatuses.includes(requestedStatus) ? requestedStatus : "unpaid",
    payerName: readField(formData, "payerName"),
    notes: readField(formData, "notes"),
  });

  if (result.error) {
    return { status: "error", message: result.error.message };
  }

  if (shouldAddToBudget(formData) && totalPrice !== undefined && totalPrice > 0) {
    const budgetResult = await createBudgetExpense({
      tripId,
      title: `Reservation: ${title}`,
      amount: totalPrice,
      category: mapReservationTypeToBudgetCategory(readField(formData, "type")),
      currency: (readField(formData, "currency") || "EUR").toUpperCase(),
      paidByName: readField(formData, "payerName"),
      participantsCount: 1,
      status: validStatuses.includes(requestedStatus) ? requestedStatus : "unpaid",
      expenseDate: toExpenseDate(startTimestamp),
      notes: "Created from a reservation. Reservation edits and deletes do not update this budget expense automatically.",
    });

    revalidatePath(`/trips/${tripId}`);

    if (budgetResult.error) {
      return {
        status: "success",
        message: "Reservation saved, but the budget expense could not be created.",
      };
    }

    return {
      status: "success",
      message: "Reservation saved and budget expense created.",
    };
  }

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Reservation saved to this trip." };
}

export async function updateReservationAction(
  _previousState: CreateReservationActionState,
  formData: FormData,
): Promise<CreateReservationActionState> {
  const tripId = readField(formData, "tripId");
  const id = readField(formData, "recordId");
  const title = readField(formData, "title");
  const startDate = readField(formData, "startDate");
  const endDate = readField(formData, "endDate");
  const totalPriceValue = readField(formData, "totalPrice");
  const requestedStatus = readField(formData, "status") as ReservationStatus;

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This reservation is not available." };
  if (!title) return { status: "error", message: "Enter a title for this reservation." };

  const totalPrice = totalPriceValue ? Number(totalPriceValue) : undefined;
  if (totalPrice !== undefined && (!Number.isFinite(totalPrice) || totalPrice < 0)) {
    return { status: "error", message: "Enter a valid reservation price." };
  }
  const startTimestamp = startDate ? Date.parse(startDate) : undefined;
  const endTimestamp = endDate ? Date.parse(endDate) : undefined;
  if ((startTimestamp !== undefined && Number.isNaN(startTimestamp))
    || (endTimestamp !== undefined && Number.isNaN(endTimestamp))) {
    return { status: "error", message: "Enter valid reservation dates." };
  }
  if (startTimestamp !== undefined && endTimestamp !== undefined && endTimestamp < startTimestamp) {
    return { status: "error", message: "End date cannot be earlier than start date." };
  }

  const result = await updateReservation({
    id,
    tripId,
    title,
    type: readField(formData, "type"),
    provider: readField(formData, "provider"),
    reservationNumber: readField(formData, "reservationNumber"),
    startDate: startTimestamp !== undefined ? new Date(startTimestamp).toISOString() : undefined,
    endDate: endTimestamp !== undefined ? new Date(endTimestamp).toISOString() : undefined,
    location: readField(formData, "location"),
    totalPrice,
    currency: readField(formData, "currency") || "EUR",
    status: validStatuses.includes(requestedStatus) ? requestedStatus : "unpaid",
    payerName: readField(formData, "payerName"),
    notes: readField(formData, "notes"),
  });

  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Reservation updated." };
}

export async function deleteReservationAction(
  tripId: string,
  id: string,
): Promise<CreateReservationActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This reservation is not available." };

  const result = await deleteReservation({ tripId, id });
  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Reservation deleted." };
}
