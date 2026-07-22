"use server";

import { revalidatePath } from "next/cache";

import { markPlacePlannedIfSafe } from "@/features/places/services/place-status-sync-service";
import {
  createPlannerItem,
  deletePlannerItem,
  updatePlannerItem,
} from "@/features/planner/services/planner-service";
import type {
  CreatePlannerItemActionState,
  PlannerItemFormFields,
  PlannerItemStatus,
} from "@/features/planner/types/persisted-planner";
import { isUuid } from "@/lib/validation/is-uuid";

const validStatuses: PlannerItemStatus[] = ["planned", "completed", "cancelled"];
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function readPlannerItemFields(formData: FormData): PlannerItemFormFields {
  return {
    title: readField(formData, "title"),
    description: readField(formData, "description"),
    date: readField(formData, "date"),
    startTime: readField(formData, "startTime"),
    endTime: readField(formData, "endTime"),
    placeId: readField(formData, "placeId"),
    type: readField(formData, "type"),
    status: readField(formData, "status"),
    orderIndex: readField(formData, "orderIndex"),
  };
}

export async function createPlannerItemAction(
  _previousState: CreatePlannerItemActionState,
  formData: FormData,
): Promise<CreatePlannerItemActionState> {
  const tripId = readField(formData, "tripId");
  const fields = readPlannerItemFields(formData);
  const title = fields.title;
  const date = fields.date;
  const startTime = fields.startTime;
  const endTime = fields.endTime;
  const placeId = fields.placeId;
  const requestedStatus = fields.status as PlannerItemStatus;
  const orderIndexValue = fields.orderIndex;

  if (!isUuid(tripId)) {
    return { status: "error", message: "This saved trip is not available.", fields };
  }

  if (!title) {
    return { status: "error", message: "Enter a title for this plan item.", fields };
  }

  if (date && !datePattern.test(date)) {
    return { status: "error", message: "Enter a valid date.", fields };
  }

  if ((startTime && !timePattern.test(startTime)) || (endTime && !timePattern.test(endTime))) {
    return { status: "error", message: "Enter a valid start and end time.", fields };
  }

  if (startTime && endTime && endTime < startTime) {
    return { status: "error", message: "End time cannot be earlier than start time.", fields };
  }

  if (placeId && !isUuid(placeId)) {
    return { status: "error", message: "Choose a valid saved place or leave it empty.", fields };
  }

  const parsedOrderIndex = orderIndexValue ? Number.parseInt(orderIndexValue, 10) : undefined;
  const orderIndex = Number.isFinite(parsedOrderIndex) ? parsedOrderIndex : undefined;
  const status = validStatuses.includes(requestedStatus) ? requestedStatus : "planned";
  const result = await createPlannerItem({
    tripId,
    title,
    placeId: placeId || undefined,
    description: fields.description,
    date,
    startTime,
    endTime,
    type: fields.type,
    status,
    orderIndex,
  });

  if (result.error) {
    return { status: "error", message: result.error.message, fields };
  }

  if (placeId) {
    const placeResult = await markPlacePlannedIfSafe({ tripId, id: placeId });
    if (placeResult.error) {
      revalidatePath(`/trips/${tripId}`);
      return {
        status: "success",
        message: "Plan item saved. Linked place status could not be updated.",
      };
    }
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
  const fields = readPlannerItemFields(formData);
  const title = fields.title;
  const date = fields.date;
  const startTime = fields.startTime;
  const endTime = fields.endTime;
  const placeId = fields.placeId;
  const requestedStatus = fields.status as PlannerItemStatus;
  const parsedOrderIndex = Number.parseInt(fields.orderIndex || "0", 10);

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available.", fields };
  if (!isUuid(id)) return { status: "error", message: "This plan item is not available.", fields };
  if (!title) return { status: "error", message: "Enter a title for this plan item.", fields };
  if (date && !datePattern.test(date)) return { status: "error", message: "Enter a valid date.", fields };
  if ((startTime && !timePattern.test(startTime)) || (endTime && !timePattern.test(endTime))) {
    return { status: "error", message: "Enter a valid start and end time.", fields };
  }
  if (startTime && endTime && endTime < startTime) {
    return { status: "error", message: "End time cannot be earlier than start time.", fields };
  }
  if (placeId && !isUuid(placeId)) {
    return { status: "error", message: "Choose a valid saved place or leave it empty.", fields };
  }

  const result = await updatePlannerItem({
    id,
    tripId,
    placeId: placeId || undefined,
    title,
    description: fields.description,
    date,
    startTime,
    endTime,
    type: fields.type,
    status: validStatuses.includes(requestedStatus) ? requestedStatus : "planned",
    orderIndex: Number.isFinite(parsedOrderIndex) ? parsedOrderIndex : 0,
  });

  if (result.error) return { status: "error", message: result.error.message, fields };
  if (placeId) {
    const placeResult = await markPlacePlannedIfSafe({ tripId, id: placeId });
    if (placeResult.error) {
      revalidatePath(`/trips/${tripId}`);
      return {
        status: "success",
        message: "Plan item updated. Linked place status could not be updated.",
      };
    }
  }
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
