import {
  createPackingItem,
  getPackingItemsForTrip,
} from "@/features/packing/services/packing-service";
import type {
  PackingCategory,
  PackingPriority,
} from "@/features/packing/types/packing";
import type {
  ApplyPackingPresetResult,
  PackingPresetServiceResult,
} from "@/features/packing/types/packing-preset";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

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

function logPresetError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;
  console.error(`[Packing Presets] ${operation}`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
}

function duplicateKey(name: string, category?: string | null) {
  return `${name.trim().toLowerCase()}::${category?.trim().toLowerCase() ?? ""}`;
}

function normalizeCategory(value?: string | null): PackingCategory | undefined {
  return categories.includes(value as PackingCategory)
    ? value as PackingCategory
    : undefined;
}

function normalizePriority(value?: string | null): PackingPriority {
  return priorities.includes(value as PackingPriority)
    ? value as PackingPriority
    : "recommended";
}

export async function applyPackingPresetToTrip(
  tripId: string,
  presetId: string,
): Promise<PackingPresetServiceResult<ApplyPackingPresetResult>> {
  if (!isUuid(tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (!isUuid(presetId)) return { data: null, error: { code: "INVALID_PRESET", message: "This preset is not available." } };

  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to apply packing presets." } };

  const { data: preset, error: presetError } = await supabase.from("packing_presets")
    .select("*").eq("id", presetId).eq("owner_id", authData.user.id).maybeSingle();
  if (presetError || !preset) {
    if (presetError) logPresetError("preset apply read failed", presetError);
    return { data: null, error: { code: "INVALID_PRESET", message: "This preset is not available." } };
  }

  const { data: presetItems, error: itemsError } = await supabase
    .from("packing_preset_items")
    .select("*")
    .eq("preset_id", preset.id)
    .order("sort_order", { ascending: true });
  if (itemsError) {
    logPresetError("preset apply items read failed", itemsError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load preset items." } };
  }

  const existingResult = await getPackingItemsForTrip(tripId);
  if (existingResult.error) return { data: null, error: { code: "LOAD_FAILED", message: existingResult.error.message } };

  const existingKeys = new Set(existingResult.data.map((item) => duplicateKey(item.name, item.category)));
  const payloadKeys = new Set<string>();
  let skippedCount = 0;
  let addedCount = 0;

  for (const item of presetItems) {
    const key = duplicateKey(item.name, item.category);
    if (existingKeys.has(key) || payloadKeys.has(key)) {
      skippedCount += 1;
      continue;
    }

    payloadKeys.add(key);
    const result = await createPackingItem({
      tripId,
      name: item.name,
      category: normalizeCategory(item.category),
      isPacked: false,
      isShared: true,
      priority: normalizePriority(item.priority),
      notes: item.notes || undefined,
    });

    if (result.error) {
      return { data: null, error: { code: "APPLY_FAILED", message: result.error.message } };
    }
    addedCount += 1;
  }

  return { data: { addedCount, skippedCount }, error: null };
}
