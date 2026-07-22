import { randomUUID } from "node:crypto";

import type {
  AddPlannerPresetInput,
  PersistedPlannerItem,
  PlannerServiceResult,
} from "@/features/planner/types/persisted-planner";
import { getPlannerDayPreset } from "@/features/planner/utils/planner-presets";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";
import type { Database } from "@/types/database";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logPlannerPresetError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;
  console.error(`[Planner presets] ${operation}`, {
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

function maxOrder(items: Pick<PersistedPlannerItem, "order_index">[]) {
  return items.reduce((max, item, index) => Math.max(max, item.order_index ?? index), -1);
}

export async function addPlannerPresetToDay(
  input: AddPlannerPresetInput,
): Promise<PlannerServiceResult<{ addedCount: number; presetLabel: string }>> {
  if (!isUuid(input.tripId)) {
    return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  }

  const preset = getPlannerDayPreset(input.presetId);
  if (!preset) {
    return { data: null, error: { code: "INVALID_RECORD", message: "Choose a valid planner preset." } };
  }

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to add planner presets." } };

  const { data: existingItems, error: orderError } = await supabase
    .from("planner_items")
    .select("order_index")
    .eq("trip_id", input.tripId)
    .eq("date", input.date);

  if (orderError) {
    logPlannerPresetError("planner preset order query failed", orderError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't inspect this day." } };
  }

  const startOrder = maxOrder(existingItems || []) + 1;
  const payload = preset.items.map((item, index): Database["public"]["Tables"]["planner_items"]["Insert"] => ({
    id: randomUUID(),
    trip_id: input.tripId,
    place_id: null,
    title: item.title,
    description: item.description || null,
    date: input.date,
    start_time: item.startTime || null,
    end_time: item.endTime || null,
    type: item.type || null,
    status: "planned",
    order_index: startOrder + index,
  }));

  const { error: insertError } = await supabase.from("planner_items").insert(payload);
  if (insertError) {
    logPlannerPresetError("planner preset insert failed", insertError);
    return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't add this preset." } };
  }

  return { data: { addedCount: payload.length, presetLabel: preset.label }, error: null };
}
