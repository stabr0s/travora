"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { duplicateTrip } from "@/features/trips/services/trip-duplicate-service";
import { deleteTrip, updateTrip } from "@/features/trips/services/trip-settings-service";
import type {
  TripSettingsActionState,
  TripStatus,
} from "@/features/trips/types/persisted-trip";
import { isUuid } from "@/lib/validation/is-uuid";

const statuses: TripStatus[] = ["planning", "upcoming", "archived"];

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function isValidDate(value: string) {
  if (!value) return true;
  const parsed = new Date(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(parsed.getTime())
    && parsed.toISOString().slice(0, 10) === value;
}

function isValidCoverUrl(value: string) {
  if (!value) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeCurrency(value: string) {
  return (value.trim() || "EUR").toUpperCase();
}

export async function updateTripSettingsAction(
  _previousState: TripSettingsActionState,
  formData: FormData,
): Promise<TripSettingsActionState> {
  const tripId = readField(formData, "tripId");
  const title = readField(formData, "title");
  const startDate = readField(formData, "startDate");
  const endDate = readField(formData, "endDate");
  const coverImageUrl = readField(formData, "coverImageUrl");
  const status = readField(formData, "status") as TripStatus;
  const currency = normalizeCurrency(readField(formData, "currency"));

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (title.length < 2) return { status: "error", message: "Trip name must be at least 2 characters." };
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return { status: "error", message: "Enter valid trip dates." };
  }
  if (startDate && endDate && endDate < startDate) {
    return { status: "error", message: "End date must be the same as or later than start date." };
  }
  if (!isValidCoverUrl(coverImageUrl)) {
    return { status: "error", message: "Cover image URL must start with http:// or https://." };
  }
  if (!statuses.includes(status)) {
    return { status: "error", message: "Choose a valid trip status." };
  }
  if (currency.length > 12) {
    return { status: "error", message: "Currency should be 12 characters or fewer." };
  }

  const result = await updateTrip({
    tripId,
    title,
    destination: readField(formData, "destination"),
    startDate,
    endDate,
    description: readField(formData, "description"),
    coverImageUrl,
    status,
    currency,
  });

  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  revalidatePath("/trips");
  return { status: "success", message: "Trip settings updated." };
}

export async function deleteTripAction(
  _previousState: TripSettingsActionState,
  formData: FormData,
): Promise<TripSettingsActionState> {
  const tripId = readField(formData, "tripId");
  const tripTitle = readField(formData, "tripTitle");
  const confirmation = readField(formData, "confirmation");

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!tripTitle || confirmation !== tripTitle) {
    return { status: "error", message: "Type the trip title exactly to delete it." };
  }

  const result = await deleteTrip({ tripId });
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath("/trips");
  redirect("/trips");
}

export async function duplicateTripAction(
  _previousState: TripSettingsActionState,
  formData: FormData,
): Promise<TripSettingsActionState> {
  const tripId = readField(formData, "tripId");
  const title = readField(formData, "title");
  const startDate = readField(formData, "startDate");
  const endDate = readField(formData, "endDate");

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (title.length < 2) return { status: "error", message: "Trip name must be at least 2 characters." };
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return { status: "error", message: "Enter valid trip dates." };
  }
  if (startDate && endDate && endDate < startDate) {
    return { status: "error", message: "End date must be the same as or later than start date." };
  }

  const result = await duplicateTrip({ tripId, title, startDate, endDate });
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath("/dashboard");
  revalidatePath("/trips");
  redirect(`/trips/${result.data.id}`);
}
