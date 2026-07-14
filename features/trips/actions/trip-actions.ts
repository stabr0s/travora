"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createTrip } from "@/features/trips/services/trips-service";
import type { CreateTripActionState } from "@/features/trips/types/persisted-trip";

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function normalizeCurrency(value: string) {
  return (value.trim() || "EUR").toUpperCase();
}

export async function createTripAction(
  _previousState: CreateTripActionState,
  formData: FormData,
): Promise<CreateTripActionState> {
  const title = readField(formData, "title");
  const startDate = readField(formData, "startDate");
  const endDate = readField(formData, "endDate");
  const currency = normalizeCurrency(readField(formData, "currency"));

  if (!title) {
    return { status: "error", message: "Enter a name for your trip." };
  }

  if (startDate && endDate && endDate < startDate) {
    return {
      status: "error",
      message: "End date must be the same as or later than start date.",
    };
  }

  if (currency.length > 12) {
    return { status: "error", message: "Currency should be 12 characters or fewer." };
  }

  const result = await createTrip({
    title,
    destination: readField(formData, "destination"),
    startDate,
    endDate,
    currency,
    description: readField(formData, "description"),
  });

  if (result.error) {
    return { status: "error", message: result.error.message };
  }

  revalidatePath("/trips");
  redirect(`/trips/${result.data.id}`);
}
