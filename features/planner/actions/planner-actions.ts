"use server";

import { revalidatePath } from "next/cache";

import {
  createPlannerItem,
  deletePlannerItem,
  updatePlannerItem,
} from "@/features/planner/services/planner-service";
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
  const placeId = readField(formData, "placeId");
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

  if (placeId && !isUuid(placeId)) {
    return { status: "error", message: "Choose a valid saved place or leave it empty." };
  }

  const parsedOrderIndex = orderIndexValue ? Number.parseInt(orderIndexValue, 10) : 0;
  const orderIndex = Number.isFinite(parsedOrderIndex) ? parsedOrderIndex : 0;
  const status = validStatuses.includes(requestedStatus) ? requestedStatus : "planned";
  const result = await createPlannerItem({
    tripId,
    title,
    placeId: placeId || undefined,
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

export async function updatePlannerItemAction(
  _previousState: CreatePlannerItemActionState,
  formData: FormData,
): Promise<CreatePlannerItemActionState> {
  const tripId = readField(formData, "tripId");
  const id = readField(formData, "recordId");
  const title = readField(formData, "title");
  const date = readField(formData, "date");
  const startTime = readField(formData, "startTime");
  const endTime = readField(formData, "endTime");
  const requestedStatus = readField(formData, "status") as PlannerItemStatus;
  const parsedOrderIndex = Number.parseInt(readField(formData, "orderIndex") || "0", 10);

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This plan item is not available." };
  if (!title) return { status: "error", message: "Enter a title for this plan item." };
  if (date && !datePattern.test(date)) return { status: "error", message: "Enter a valid date." };
  if ((startTime && !timePattern.test(startTime)) || (endTime && !timePattern.test(endTime))) {
    return { status: "error", message: "Enter a valid start and end time." };
  }
  if (startTime && endTime && endTime < startTime) {
    return { status: "error", message: "End time cannot be earlier than start time." };
  }

  const result = await updatePlannerItem({
    id,
    tripId,
    title,
    description: readField(formData, "description"),
    date,
    startTime,
    endTime,
    type: readField(formData, "type"),
    status: validStatuses.includes(requestedStatus) ? requestedStatus : "planned",
    orderIndex: Number.isFinite(parsedOrderIndex) ? parsedOrderIndex : 0,
  });

  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Plan item updated." };
}

export async function deletePlannerItemAction(
  tripId: string,
  id: string,
): Promise<CreatePlannerItemActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This plan item is not available." };

  const result = await deletePlannerItem({ tripId, id });
  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Plan item deleted." };
}
