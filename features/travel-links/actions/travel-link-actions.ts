"use server";

import { revalidatePath } from "next/cache";

import {
  createTravelLink,
  deleteTravelLink,
  updateTravelLink,
} from "@/features/travel-links/services/travel-links-service";
import type { TravelLinkActionState } from "@/features/travel-links/types/travel-link";
import { isUuid } from "@/lib/validation/is-uuid";

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function readOptionalUuid(formData: FormData, name: string) {
  const value = readField(formData, name);
  return value && isUuid(value) ? value : null;
}

function revalidateTrip(tripId: string) {
  revalidatePath(`/trips/${tripId}`);
  revalidatePath(`/trips/${tripId}/summary`);
}

export async function createTravelLinkAction(
  _previousState: TravelLinkActionState,
  formData: FormData,
): Promise<TravelLinkActionState> {
  const tripId = readField(formData, "tripId");
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };

  const result = await createTravelLink({
    tripId,
    reservationId: readOptionalUuid(formData, "reservationId"),
    title: readField(formData, "title"),
    url: readField(formData, "url"),
    linkType: readField(formData, "linkType"),
    note: readField(formData, "note"),
  });

  if (result.error) return { status: "error", message: result.error.message };
  revalidateTrip(tripId);
  return { status: "success", message: "Travel link saved." };
}

export async function updateTravelLinkAction(
  _previousState: TravelLinkActionState,
  formData: FormData,
): Promise<TravelLinkActionState> {
  const tripId = readField(formData, "tripId");
  const id = readField(formData, "recordId");
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This travel link is not available." };

  const result = await updateTravelLink({
    id,
    tripId,
    reservationId: readOptionalUuid(formData, "reservationId"),
    title: readField(formData, "title"),
    url: readField(formData, "url"),
    linkType: readField(formData, "linkType"),
    note: readField(formData, "note"),
  });

  if (result.error) return { status: "error", message: result.error.message };
  revalidateTrip(tripId);
  return { status: "success", message: "Travel link updated." };
}

export async function deleteTravelLinkAction(
  tripId: string,
  id: string,
): Promise<TravelLinkActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This travel link is not available." };

  const result = await deleteTravelLink({ tripId, id });
  if (result.error) return { status: "error", message: result.error.message };
  revalidateTrip(tripId);
  return { status: "success", message: "Travel link deleted." };
}
