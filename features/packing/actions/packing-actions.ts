"use server";

import { revalidatePath } from "next/cache";

import {
  createPackingItem,
  deletePackingItem,
  getPackingItemsForTrip,
  togglePackingItemPacked,
  updatePackingItem,
} from "@/features/packing/services/packing-service";
import { getPackingPreset } from "@/features/packing/data/packing-presets";
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

function duplicateKey(name: string, category?: string | null) {
  return `${name.trim().toLowerCase()}::${category?.trim().toLowerCase() ?? ""}`;
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

export async function addPackingPresetAction(
  tripId: string,
  presetId: string,
): Promise<PackingActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };

  const preset = getPackingPreset(presetId);
  if (!preset) return { status: "error", message: "Choose a valid packing preset." };

  const existingResult = await getPackingItemsForTrip(tripId);
  if (existingResult.error) {
    return { status: "error", message: existingResult.error.message };
  }

  const existingKeys = new Set(
    existingResult.data.map((item) => duplicateKey(item.name, item.category)),
  );
  const presetKeys = new Set<string>();
  const itemsToCreate = [];
  let skippedCount = 0;

  for (const item of preset.items) {
    const key = duplicateKey(item.name, item.category);
    if (existingKeys.has(key) || presetKeys.has(key)) {
      skippedCount += 1;
      continue;
    }
    presetKeys.add(key);
    itemsToCreate.push(item);
  }

  if (!itemsToCreate.length) {
    return { status: "success", message: "All preset items are already on your packing list." };
  }

  let addedCount = 0;
  let failedCount = 0;

  for (const item of itemsToCreate) {
    const result = await createPackingItem({
      tripId,
      name: item.name,
      category: item.category,
      isShared: item.isShared,
      isPacked: false,
      priority: item.priority,
      notes: item.notes,
    });

    if (result.error) failedCount += 1;
    else addedCount += 1;
  }

  revalidatePath(`/trips/${tripId}`);

  if (addedCount === 0) {
    return { status: "error", message: "We couldn't add preset items." };
  }

  const duplicateCopy = skippedCount === 1 ? "1 duplicate" : `${skippedCount} duplicates`;
  const addedCopy = addedCount === 1 ? "1 preset item" : `${addedCount} preset items`;

  if (failedCount > 0) {
    const failedCopy = failedCount === 1 ? "1 item" : `${failedCount} items`;
    const skippedCopy = skippedCount > 0 ? ` Skipped ${duplicateCopy}, and` : "";
    return {
      status: "success",
      message: `Added ${addedCopy}.${skippedCopy} ${failedCopy} could not be added.`,
    };
  }

  return {
    status: "success",
    message: skippedCount > 0
      ? `Added ${addedCopy}. Skipped ${duplicateCopy}.`
      : `Added ${addedCopy}.`,
  };
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
