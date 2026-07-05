"use server";

import { revalidatePath } from "next/cache";

import { createPlannerItem } from "@/features/planner/services/planner-service";
import type {
  CreatePlannerItemActionState,
  PlannerItemStatus,
} from "@/features/planner/types/persisted-planner";
import { isUuid } from "@/lib/validation/is-uuid";

const validStatuses: PlannerItemStatus[] = ["planned", "completed", "cancelled"];
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function createPlannerItemAction(
  _previousState: CreatePlannerItemActionState,
  formData: FormData,
): Promise<CreatePlannerItemActionState> {
  const tripId = readField(formData, "tripId");
  const title = readField(formData, "title");
  const date = readField(formData, "date");
  const startTime = readField(formData, "startTime");
  const endTime = readField(formData, "endTime");
  const requestedStatus = readField(formData, "status") as PlannerItemStatus;
  const orderIndexValue = readField(formData, "orderIndex");

  if (!isUuid(tripId)) {
    return { status: "error", message: "This saved trip is not available." };
  }

  if (!title) {
    return { status: "error", message: "Enter a title for this plan item." };
  }

  if (date && !datePattern.test(date)) {
    return { status: "error", message: "Enter a valid date." };
  }

  if ((startTime && !timePattern.test(startTime)) || (endTime && !timePattern.test(endTime))) {
    return { status: "error", message: "Enter a valid start and end time." };
  }

  if (startTime && endTime && endTime < startTime) {
    return { status: "error", message: "End time cannot be earlier than start time." };
  }

  const parsedOrderIndex = orderIndexValue ? Number.parseInt(orderIndexValue, 10) : 0;
  const orderIndex = Number.isFinite(parsedOrderIndex) ? parsedOrderIndex : 0;
  const status = validStatuses.includes(requestedStatus) ? requestedStatus : "planned";
  const result = await createPlannerItem({
    tripId,
    title,
    description: readField(formData, "description"),
    date,
    startTime,
    endTime,
    type: readField(formData, "type"),
    status,
    orderIndex,
  });

  if (result.error) {
    return { status: "error", message: result.error.message };
  }

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Plan item saved to this trip." };
}
