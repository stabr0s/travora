import { randomUUID } from "node:crypto";

import type {
  CreatePackingPresetInput,
  PackingPresetItemInput,
  PackingPresetServiceResult,
  PackingPresetWithItems,
  PersistedPackingPreset,
  PersistedPackingPresetItem,
  UpdatePackingPresetInput,
} from "@/features/packing/types/packing-preset";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";
import type { Database } from "@/types/database";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logPresetError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;
  console.error(`[Packing Presets] ${operation}`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
}

async function getAuthContext() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}

function validItems(items: PackingPresetItemInput[]) {
  return items.filter((item) => item.name.trim()).map((item, index) => ({
    ...item,
    name: item.name.trim(),
    sortOrder: item.sortOrder ?? index,
  }));
}

function withItems(
  presets: PersistedPackingPreset[],
  items: PersistedPackingPresetItem[],
) {
  return presets.map((preset) => ({
    ...preset,
    items: items.filter((item) => item.preset_id === preset.id),
  }));
}

export async function getPackingPresetsForCurrentUser(): Promise<
  PackingPresetServiceResult<PackingPresetWithItems[]>
> {
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to manage packing presets." } };

  const { data: presets, error: presetsError } = await supabase
    .from("packing_presets").select("*").order("created_at", { ascending: false });
  if (presetsError) {
    logPresetError("preset query failed", presetsError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load packing presets." } };
  }

  const safePresets = presets || [];
  const presetIds = safePresets.map((preset) => preset.id);
  if (!presetIds.length) return { data: [], error: null };

  const { data: items, error: itemsError } = await supabase
    .from("packing_preset_items").select("*").in("preset_id", presetIds)
    .order("sort_order", { ascending: true });
  if (itemsError) {
    logPresetError("preset items query failed", itemsError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load preset items." } };
  }

  return { data: withItems(safePresets, items || []), error: null };
}

export async function createPackingPreset(
  input: CreatePackingPresetInput,
): Promise<PackingPresetServiceResult<null>> {
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to create packing presets." } };
  if (!input.name.trim()) return { data: null, error: { code: "INVALID_PRESET", message: "Enter a preset name." } };

  const presetId = randomUUID();
  const { error: presetError } = await supabase.from("packing_presets").insert({
    id: presetId,
    owner_id: user.id,
    name: input.name.trim(),
    description: input.description?.trim() || null,
  });
  if (presetError) {
    logPresetError("preset insert failed", presetError);
    return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't save this preset." } };
  }

  const items = validItems(input.items);
  if (items.length) {
    const payload = items.map((item): Database["public"]["Tables"]["packing_preset_items"]["Insert"] => ({
      id: randomUUID(),
      preset_id: presetId,
      name: item.name,
      category: item.category || null,
      priority: item.priority || "recommended",
      notes: item.notes?.trim() || null,
      sort_order: item.sortOrder,
    }));
    const { error: itemsError } = await supabase.from("packing_preset_items").insert(payload);
    if (itemsError) {
      logPresetError("preset item insert failed", itemsError);
      await supabase.from("packing_presets").delete().eq("id", presetId);
      return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't save preset items." } };
    }
  }

  return { data: null, error: null };
}

export async function updatePackingPreset(
  input: UpdatePackingPresetInput,
): Promise<PackingPresetServiceResult<null>> {
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to update packing presets." } };
  if (!isUuid(input.id) || !input.name.trim()) {
    return { data: null, error: { code: "INVALID_PRESET", message: "Choose a valid preset and enter its name." } };
  }

  const { error: updateError } = await supabase.from("packing_presets")
    .update({ name: input.name.trim(), description: input.description?.trim() || null })
    .eq("id", input.id).eq("owner_id", user.id);
  if (updateError) {
    logPresetError("preset update failed", updateError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't update this preset." } };
  }

  const { error: deleteItemsError } = await supabase.from("packing_preset_items")
    .delete().eq("preset_id", input.id);
  if (deleteItemsError) {
    logPresetError("preset item replace delete failed", deleteItemsError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't update preset items." } };
  }

  const items = validItems(input.items);
  if (items.length) {
    const payload = items.map((item): Database["public"]["Tables"]["packing_preset_items"]["Insert"] => ({
      id: randomUUID(),
      preset_id: input.id,
      name: item.name,
      category: item.category || null,
      priority: item.priority || "recommended",
      notes: item.notes?.trim() || null,
      sort_order: item.sortOrder,
    }));
    const { error: insertItemsError } = await supabase.from("packing_preset_items").insert(payload);
    if (insertItemsError) {
      logPresetError("preset item replace insert failed", insertItemsError);
      return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't update preset items." } };
    }
  }

  return { data: null, error: null };
}

export async function deletePackingPreset(id: string): Promise<PackingPresetServiceResult<null>> {
  if (!isUuid(id)) return { data: null, error: { code: "INVALID_PRESET", message: "This preset is not available." } };
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to delete packing presets." } };

  const { error } = await supabase.from("packing_presets").delete()
    .eq("id", id).eq("owner_id", user.id);
  if (error) {
    logPresetError("preset delete failed", error);
    return { data: null, error: { code: "DELETE_FAILED", message: "We couldn't delete this preset." } };
  }
  return { data: null, error: null };
}
