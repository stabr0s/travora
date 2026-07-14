import { randomUUID } from "node:crypto";

import type {
  CopyPlannerDayInput,
  PersistedPlannerItem,
  PlannerServiceResult,
  ReorderPlannerItemInput,
} from "@/features/planner/types/persisted-planner";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";
import type { Database } from "@/types/database";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function logPlannerError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;
  console.error(`[Planner] ${operation}`, {
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

export async function copyPlannerDay(
  input: CopyPlannerDayInput,
): Promise<PlannerServiceResult<{ copiedCount: number }>> {
  if (!isUuid(input.tripId) || !datePattern.test(input.sourceDate) || !datePattern.test(input.targetDate)) {
    return { data: null, error: { code: "INVALID_RECORD", message: "Choose a valid source day and target date." } };
  }
  if (input.sourceDate === input.targetDate) {
    return { data: null, error: { code: "INVALID_RECORD", message: "Choose a different target date." } };
  }

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to copy plan days." } };

  const { data: sourceItems, error: sourceError } = await supabase
    .from("planner_items")
    .select("*")
    .eq("trip_id", input.tripId)
    .eq("date", input.sourceDate)
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("start_time", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  if (sourceError) {
    logPlannerError("planner source day query failed", sourceError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load the source day." } };
  }
  if (!sourceItems?.length) {
    return { data: null, error: { code: "INVALID_RECORD", message: "The source day has no items to copy." } };
  }

  const { data: targetItems, error: targetError } = await supabase
    .from("planner_items")
    .select("order_index")
    .eq("trip_id", input.tripId)
    .eq("date", input.targetDate);
  if (targetError) {
    logPlannerError("planner target day query failed", targetError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't inspect the target day." } };
  }

  const startOrder = maxOrder(targetItems || []) + 1;
  const payload = sourceItems.map((item, index): Database["public"]["Tables"]["planner_items"]["Insert"] => ({
    id: randomUUID(),
    trip_id: input.tripId,
    place_id: item.place_id,
    title: item.title,
    description: item.description,
    date: input.targetDate,
    start_time: item.start_time,
    end_time: item.end_time,
    type: item.type,
    status: item.status || "planned",
    order_index: startOrder + index,
  }));

  const { error: insertError } = await supabase.from("planner_items").insert(payload);
  if (insertError) {
    logPlannerError("planner day copy insert failed", insertError);
    return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't copy this day." } };
  }

  return { data: { copiedCount: payload.length }, error: null };
}

export async function reorderPlannerItems(
  input: ReorderPlannerItemInput,
): Promise<PlannerServiceResult<null>> {
  if (!isUuid(input.tripId) || !isUuid(input.itemId) || !isUuid(input.siblingId)) {
    return { data: null, error: { code: "INVALID_RECORD", message: "Choose valid plan items to reorder." } };
  }

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to reorder plan items." } };

  const { data: items, error: readError } = await supabase.from("planner_items").select("id,date")
    .eq("trip_id", input.tripId).in("id", [input.itemId, input.siblingId]);
  if (readError) {
    logPlannerError("planner reorder read failed", readError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load these plan items." } };
  }
  if (!items || items.length !== 2 || items[0].date !== items[1].date) {
    return { data: null, error: { code: "INVALID_RECORD", message: "Items can only move within the same day." } };
  }

  const { error: firstError } = await supabase.from("planner_items")
    .update({ order_index: input.siblingOrderIndex }).eq("id", input.itemId).eq("trip_id", input.tripId);
  if (firstError) {
    logPlannerError("planner reorder first update failed", firstError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't reorder this plan item." } };
  }

  const { error: secondError } = await supabase.from("planner_items")
    .update({ order_index: input.itemOrderIndex }).eq("id", input.siblingId).eq("trip_id", input.tripId);
  if (secondError) {
    logPlannerError("planner reorder second update failed", secondError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't finish reordering this plan item." } };
  }

  return { data: null, error: null };
}
