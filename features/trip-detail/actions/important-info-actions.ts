"use server";

import { revalidatePath } from "next/cache";

import { saveImportantInfo } from "@/features/trip-detail/services/important-info-service";
import type { ImportantInfoActionState } from "@/features/trip-detail/types/important-info";
import { isUuid } from "@/lib/validation/is-uuid";

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function saveImportantInfoAction(
  _previousState: ImportantInfoActionState,
  formData: FormData,
): Promise<ImportantInfoActionState> {
  const tripId = readField(formData, "tripId");
  const content = readField(formData, "content");

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };

  const result = await saveImportantInfo({ tripId, content });
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  revalidatePath(`/trips/${tripId}/summary`);
  return { status: "success", message: "Important info saved." };
}
