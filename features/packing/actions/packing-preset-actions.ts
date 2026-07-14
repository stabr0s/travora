"use server";

import { revalidatePath } from "next/cache";

import { applyPackingPresetToTrip } from "@/features/packing/services/packing-preset-apply-service";
import {
  createPackingPreset,
  deletePackingPreset,
  updatePackingPreset,
} from "@/features/packing/services/packing-preset-service";
import type {
  PackingPresetActionState,
  PackingPresetItemInput,
} from "@/features/packing/types/packing-preset";
import type {
  PackingCategory,
  PackingPriority,
} from "@/features/packing/types/packing";
import { isUuid } from "@/lib/validation/is-uuid";

const categories: PackingCategory[] = [
  "documents",
  "electronics",
  "clothes",
  "toiletries",
  "health",
  "travel",
  "other",
];
const priorities: PackingPriority[] = ["essential", "recommended", "optional"];

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function readStringList(formData: FormData, name: string) {
  return formData.getAll(name).map((value) => String(value ?? "").trim());
}

function normalizeCategory(value: string): PackingCategory | undefined {
  return categories.includes(value as PackingCategory)
    ? value as PackingCategory
    : undefined;
}

function normalizePriority(value: string): PackingPriority {
  return priorities.includes(value as PackingPriority)
    ? value as PackingPriority
    : "recommended";
}

function readPresetItems(formData: FormData): PackingPresetItemInput[] {
  const names = readStringList(formData, "itemName");
  const categoriesList = readStringList(formData, "itemCategory");
  const prioritiesList = readStringList(formData, "itemPriority");
  const notesList = readStringList(formData, "itemNotes");

  return names
    .map((name, index) => ({
      name,
      category: normalizeCategory(categoriesList[index] ?? ""),
      priority: normalizePriority(prioritiesList[index] ?? ""),
      notes: notesList[index] || undefined,
      sortOrder: index,
    }))
    .filter((item) => item.name);
}

function successMessage(addedCount: number, skippedCount: number) {
  if (addedCount === 0) {
    return "All preset items are already on your packing list.";
  }

  const addedCopy = addedCount === 1 ? "1 preset item" : `${addedCount} preset items`;
  const skippedCopy = skippedCount === 1 ? "1 duplicate" : `${skippedCount} duplicates`;
  return skippedCount > 0
    ? `Added ${addedCopy}. Skipped ${skippedCopy}.`
    : `Added ${addedCopy}.`;
}

export async function createPackingPresetAction(
  _previousState: PackingPresetActionState,
  formData: FormData,
): Promise<PackingPresetActionState> {
  const tripId = readField(formData, "tripId");
  const name = readField(formData, "name");
  const items = readPresetItems(formData);

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!name) return { status: "error", message: "Enter a preset name." };
  if (!items.length) return { status: "error", message: "Add at least one preset item." };

  const result = await createPackingPreset({
    name,
    description: readField(formData, "description") || undefined,
    items,
  });
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Packing preset saved." };
}

export async function updatePackingPresetAction(
  _previousState: PackingPresetActionState,
  formData: FormData,
): Promise<PackingPresetActionState> {
  const tripId = readField(formData, "tripId");
  const id = readField(formData, "presetId");
  const name = readField(formData, "name");
  const items = readPresetItems(formData);

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This preset is not available." };
  if (!name) return { status: "error", message: "Enter a preset name." };
  if (!items.length) return { status: "error", message: "Add at least one preset item." };

  const result = await updatePackingPreset({
    id,
    name,
    description: readField(formData, "description") || undefined,
    items,
  });
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Packing preset updated." };
}

export async function deletePackingPresetAction(
  tripId: string,
  presetId: string,
): Promise<PackingPresetActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(presetId)) return { status: "error", message: "This preset is not available." };

  const result = await deletePackingPreset(presetId);
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Packing preset deleted." };
}

export async function applyCustomPackingPresetAction(
  tripId: string,
  presetId: string,
): Promise<PackingPresetActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(presetId)) return { status: "error", message: "This preset is not available." };

  const result = await applyPackingPresetToTrip(tripId, presetId);
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  return {
    status: "success",
    message: successMessage(result.data.addedCount, result.data.skippedCount),
  };
}
