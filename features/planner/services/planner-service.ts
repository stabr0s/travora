import { randomUUID } from "node:crypto";

import type {
  CreatePlannerItemInput,
  DeletePlannerItemInput,
  PersistedPlannerItem,
  PlannerServiceResult,
  UpdatePlannerItemInput,
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

export async function getPlannerItemsForTrip(
  tripId: string,
): Promise<PlannerServiceResult<PersistedPlannerItem[]>> {
  if (!isUuid(tripId)) {
    return {
      data: null,
      error: { code: "INVALID_TRIP", message: "This saved trip is not available." },
    };
  }

  const { supabase, user } = await getAuthContext();

  if (!user) {
    return {
      data: null,
      error: { code: "AUTH_REQUIRED", message: "Sign in to view your saved plan." },
    };
  }

  const { data, error } = await supabase
    .from("planner_items")
    .select("*")
    .eq("trip_id", tripId)
    .order("date", { ascending: true, nullsFirst: false })
    .order("start_time", { ascending: true, nullsFirst: false })
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    logPlannerError("planner query failed", error);
    return {
      data: null,
      error: { code: "LOAD_FAILED", message: "We couldn't load the plan for this trip." },
    };
  }

  return { data, error: null };
}

export async function createPlannerItem(
  input: CreatePlannerItemInput,
): Promise<PlannerServiceResult<PersistedPlannerItem>> {
  if (!isUuid(input.tripId) || !input.title.trim()) {
    return {
      data: null,
      error: { code: "INVALID_TRIP", message: "Choose a saved trip and enter a title." },
    };
  }

  const { supabase, user } = await getAuthContext();

  if (!user) {
    return {
      data: null,
      error: { code: "AUTH_REQUIRED", message: "Sign in to add plan items." },
    };
  }

  const itemId = randomUUID();
  const payload: Database["public"]["Tables"]["planner_items"]["Insert"] = {
    id: itemId,
    trip_id: input.tripId,
    place_id: input.placeId || null,
    title: input.title.trim(),
    description: input.description || null,
    date: input.date || null,
    start_time: input.startTime || null,
    end_time: input.endTime || null,
    type: input.type || null,
    status: input.status || "planned",
    order_index: input.orderIndex ?? 0,
  };

  const { error: insertError } = await supabase.from("planner_items").insert(payload);

  if (insertError) {
    logPlannerError("planner item insert failed", insertError);
    return {
      data: null,
      error: { code: "CREATE_FAILED", message: "We couldn't save this plan item." },
    };
  }

  const { data: item, error: readError } = await supabase
    .from("planner_items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (readError) logPlannerError("created planner item readback failed", readError);

  const fallbackItem: PersistedPlannerItem = {
    id: itemId,
    trip_id: input.tripId,
    place_id: input.placeId || null,
    title: input.title.trim(),
    description: input.description || null,
    date: input.date || null,
    start_time: input.startTime || null,
    end_time: input.endTime || null,
    type: input.type || null,
    status: input.status || "planned",
    order_index: input.orderIndex ?? 0,
    created_at: null,
    updated_at: null,
  };

  return { data: item || fallbackItem, error: null };
}

export async function updatePlannerItem(
  input: UpdatePlannerItemInput,
): Promise<PlannerServiceResult<PersistedPlannerItem>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (!isUuid(input.id) || !input.title.trim()) {
    return { data: null, error: { code: "INVALID_RECORD", message: "Choose a valid plan item and enter its title." } };
  }

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to edit plan items." } };

  const payload: Database["public"]["Tables"]["planner_items"]["Update"] = {
    title: input.title.trim(),
    description: input.description || null,
    date: input.date || null,
    start_time: input.startTime || null,
    end_time: input.endTime || null,
    type: input.type || null,
    status: input.status || "planned",
    order_index: input.orderIndex ?? 0,
  };
  const { error } = await supabase.from("planner_items").update(payload)
    .eq("id", input.id).eq("trip_id", input.tripId);
  if (error) {
    logPlannerError("planner item update failed", error);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't update this plan item." } };
  }

  const { data, error: readError } = await supabase.from("planner_items").select("*")
    .eq("id", input.id).eq("trip_id", input.tripId).maybeSingle();
  if (readError || !data) {
    if (readError) logPlannerError("updated planner item readback failed", readError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't confirm the plan item update." } };
  }
  return { data, error: null };
}

export async function deletePlannerItem(
  input: DeletePlannerItemInput,
): Promise<PlannerServiceResult<null>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (!isUuid(input.id)) return { data: null, error: { code: "INVALID_RECORD", message: "This plan item is not available." } };

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to delete plan items." } };

  const { error } = await supabase.from("planner_items").delete()
    .eq("id", input.id).eq("trip_id", input.tripId);
  if (error) {
    logPlannerError("planner item delete failed", error);
    return { data: null, error: { code: "DELETE_FAILED", message: "We couldn't delete this plan item." } };
  }
  return { data: null, error: null };
}
