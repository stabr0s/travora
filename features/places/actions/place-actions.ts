"use server";

import { revalidatePath } from "next/cache";

import { createPlace, deletePlace, updatePlace } from "@/features/places/services/places-service";
import type { CreatePlaceActionState } from "@/features/places/types/persisted-place";
import type { PlaceCategory, PlacePriority, PlaceStatus } from "@/features/places/types/place";
import { isUuid } from "@/lib/validation/is-uuid";

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function createPlaceAction(
  _previousState: CreatePlaceActionState,
  formData: FormData,
): Promise<CreatePlaceActionState> {
  const tripId = readField(formData, "tripId");
  const title = readField(formData, "title");

  if (!isUuid(tripId)) {
    return { status: "error", message: "This saved trip is not available." };
  }

  if (!title) {
    return { status: "error", message: "Enter a name for this place." };
  }

  const result = await createPlace({
    tripId,
    title,
    category: readField(formData, "category") as PlaceCategory,
    address: readField(formData, "address"),
    city: readField(formData, "city"),
    country: readField(formData, "country"),
    status: readField(formData, "status") as PlaceStatus,
    priority: readField(formData, "priority") as PlacePriority,
    notes: readField(formData, "notes"),
    websiteUrl: readField(formData, "websiteUrl"),
  });

  if (result.error) {
    return { status: "error", message: result.error.message };
  }

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Place saved to this trip." };
}

export async function updatePlaceAction(
  _previousState: CreatePlaceActionState,
  formData: FormData,
): Promise<CreatePlaceActionState> {
  const tripId = readField(formData, "tripId");
  const id = readField(formData, "recordId");
  const title = readField(formData, "title");

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This place is not available." };
  if (!title) return { status: "error", message: "Enter a name for this place." };

  const result = await updatePlace({
    id,
    tripId,
    title,
    category: readField(formData, "category") as PlaceCategory,
    address: readField(formData, "address"),
    city: readField(formData, "city"),
    country: readField(formData, "country"),
    status: readField(formData, "status") as PlaceStatus,
    priority: readField(formData, "priority") as PlacePriority,
    notes: readField(formData, "notes"),
    websiteUrl: readField(formData, "websiteUrl"),
  });

  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Place updated." };
}

export async function deletePlaceAction(
  tripId: string,
  id: string,
): Promise<CreatePlaceActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This place is not available." };

  const result = await deletePlace({ tripId, id });
  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Place deleted." };
}
