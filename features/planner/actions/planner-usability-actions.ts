"use server";

import { revalidatePath } from "next/cache";

import {
  copyPlannerDay,
  reorderPlannerItems,
} from "@/features/planner/services/planner-usability-service";
import type { CreatePlannerItemActionState } from "@/features/planner/types/persisted-planner";
import { isUuid } from "@/lib/validation/is-uuid";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function copyPlannerDayAction(
  _previousState: CreatePlannerItemActionState,
  formData: FormData,
): Promise<CreatePlannerItemActionState> {
  const tripId = readField(formData, "tripId");
  const sourceDate = readField(formData, "sourceDate");
  const targetDate = readField(formData, "targetDate");

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!datePattern.test(sourceDate) || !datePattern.test(targetDate)) {
    return { status: "error", message: "Choose a valid source day and target date." };
  }
  if (sourceDate === targetDate) {
    return { status: "error", message: "Choose a different target date." };
  }

  const result = await copyPlannerDay({ tripId, sourceDate, targetDate });
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  const copiedCopy = result.data.copiedCount === 1 ? "1 item" : `${result.data.copiedCount} items`;
  return { status: "success", message: `Copied ${copiedCopy} to the target day.` };
}

export async function reorderPlannerItemAction(
  tripId: string,
  itemId: string,
  siblingId: string,
  itemOrderIndex: number,
  siblingOrderIndex: number,
): Promise<CreatePlannerItemActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(itemId) || !isUuid(siblingId)) {
    return { status: "error", message: "Choose valid plan items to reorder." };
  }

  const result = await reorderPlannerItems({
    tripId,
    itemId,
    siblingId,
    itemOrderIndex,
    siblingOrderIndex,
  });
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Plan order updated." };
}
