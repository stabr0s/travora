"use server";

import { revalidatePath } from "next/cache";

import {
  createPackingItem,
  deletePackingItem,
  togglePackingItemPacked,
  updatePackingItem,
} from "@/features/packing/services/packing-service";
import type { PackingActionState } from "@/features/packing/types/persisted-packing";
import type { PackingCategory, PackingPriority } from "@/features/packing/types/packing";
import { isUuid } from "@/lib/validation/is-uuid";

const categories: PackingCategory[] = [
  "documents", "electronics", "clothes", "toiletries", "health", "travel", "other",
];
const priorities: PackingPriority[] = ["essential", "recommended", "optional"];

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function readBoolean(formData: FormData, name: string, fallback: boolean) {
  const value = readField(formData, name);
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function readPackingValues(formData: FormData) {
  const category = readField(formData, "category") as PackingCategory;
  const priority = readField(formData, "priority") as PackingPriority;
  return {
    name: readField(formData, "name"),
    category: categories.includes(category) ? category : "other" as PackingCategory,
    assignedToName: readField(formData, "assignedToName"),
    isShared: readBoolean(formData, "isShared", true),
    isPacked: readBoolean(formData, "isPacked", false),
    priority: priorities.includes(priority) ? priority : "recommended" as PackingPriority,
    notes: readField(formData, "notes"),
  };
}

export async function createPackingItemAction(
  _previousState: PackingActionState,
  formData: FormData,
): Promise<PackingActionState> {
  const tripId = readField(formData, "tripId");
  const values = readPackingValues(formData);
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!values.name) return { status: "error", message: "Enter a packing item name." };

  const result = await createPackingItem({ tripId, ...values });
  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Packing item saved." };
}

export async function updatePackingItemAction(
  _previousState: PackingActionState,
  formData: FormData,
): Promise<PackingActionState> {
  const tripId = readField(formData, "tripId");
  const id = readField(formData, "recordId");
  const values = readPackingValues(formData);
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This packing item is not available." };
  if (!values.name) return { status: "error", message: "Enter a packing item name." };

  const result = await updatePackingItem({ id, tripId, ...values });
  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Packing item updated." };
}

export async function deletePackingItemAction(
  tripId: string,
  id: string,
): Promise<PackingActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This packing item is not available." };

  const result = await deletePackingItem({ tripId, id });
  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Packing item deleted." };
}

export async function togglePackingItemPackedAction(
  tripId: string,
  id: string,
  isPacked: boolean,
): Promise<PackingActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This packing item is not available." };

  const result = await togglePackingItemPacked({ tripId, id, isPacked });
  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: isPacked ? "Item marked as packed." : "Item marked as unpacked." };
}
