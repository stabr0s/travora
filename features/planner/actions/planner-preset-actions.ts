"use server";

import { revalidatePath } from "next/cache";

import { addPlannerPresetToDay } from "@/features/planner/services/planner-presets-service";
import type { CreatePlannerItemActionState } from "@/features/planner/types/persisted-planner";
import { getPlannerDayPreset } from "@/features/planner/utils/planner-presets";
import { isUuid } from "@/lib/validation/is-uuid";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function addPlannerPresetAction(
  _previousState: CreatePlannerItemActionState,
  formData: FormData,
): Promise<CreatePlannerItemActionState> {
  const tripId = readField(formData, "tripId");
  const date = readField(formData, "date");
  const presetId = readField(formData, "presetId");

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!datePattern.test(date)) return { status: "error", message: "Choose a valid day for this preset." };
  if (!getPlannerDayPreset(presetId)) return { status: "error", message: "Choose a valid planner preset." };

  const result = await addPlannerPresetToDay({ tripId, date, presetId });
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  const itemCopy = result.data.addedCount === 1 ? "1 item" : `${result.data.addedCount} items`;
  return { status: "success", message: `Added ${result.data.presetLabel}: ${itemCopy}.` };
}
