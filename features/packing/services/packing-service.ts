import { randomUUID } from "node:crypto";

import type {
  CreatePackingItemInput,
  DeletePackingItemInput,
  PackingServiceResult,
  PersistedPackingItem,
  TogglePackingItemInput,
  UpdatePackingItemInput,
} from "@/features/packing/types/persisted-packing";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";
import type { Database } from "@/types/database";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

type AuthContext = Awaited<ReturnType<typeof getAuthContext>>;

function logPackingError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;
  console.error(`[Packing] ${operation}`, {
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

async function confirmCanEditTrip(
  { supabase, user }: AuthContext,
  tripId: string,
): Promise<PackingServiceResult<true>> {
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to update packing items." } };

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("owner_id")
    .eq("id", tripId)
    .maybeSingle();

  if (tripError) {
    logPackingError("packing permission trip lookup failed", tripError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't confirm packing permissions." } };
  }
  if (!trip) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (trip.owner_id === user.id) return { data: true, error: null };

  const { data: member, error: memberError } = await supabase
    .from("trip_members")
    .select("role, status")
    .eq("trip_id", tripId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (memberError) {
    logPackingError("packing permission member lookup failed", memberError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't confirm packing permissions." } };
  }

  const canEdit = member?.status === "active" && (member.role === "owner" || member.role === "editor");
  if (!canEdit) {
    return {
      data: null,
      error: { code: "UPDATE_FAILED", message: "You have view-only access to this trip." },
    };
  }

  return { data: true, error: null };
}

function itemValues(input: CreatePackingItemInput) {
  return {
    name: input.name.trim(),
    category: input.category || null,
    assigned_to_name: input.assignedToName || null,
    is_shared: input.isShared ?? true,
    is_packed: input.isPacked ?? false,
    priority: input.priority || null,
    notes: input.notes || null,
  } satisfies Database["public"]["Tables"]["packing_items"]["Update"];
}

export async function getPackingItemsForTrip(
  tripId: string,
): Promise<PackingServiceResult<PersistedPackingItem[]>> {
  if (!isUuid(tripId)) {
    return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  }
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to view saved packing items." } };

  const { data, error } = await supabase.from("packing_items").select("*")
    .eq("trip_id", tripId)
    .order("category", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) {
    logPackingError("packing query failed", error);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load packing items for this trip." } };
  }
  return { data, error: null };
}

export async function createPackingItem(
  input: CreatePackingItemInput,
): Promise<PackingServiceResult<PersistedPackingItem>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (!input.name.trim()) return { data: null, error: { code: "INVALID_RECORD", message: "Enter a packing item name." } };

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to save packing items." } };

  const itemId = randomUUID();
  const payload: Database["public"]["Tables"]["packing_items"]["Insert"] = {
    id: itemId,
    trip_id: input.tripId,
    ...itemValues(input),
  };
  const { error } = await supabase.from("packing_items").insert(payload);
  if (error) {
    logPackingError("packing item insert failed", error);
    return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't save this packing item." } };
  }

  const { data, error: readError } = await supabase.from("packing_items").select("*")
    .eq("id", itemId).eq("trip_id", input.tripId).maybeSingle();
  if (readError) logPackingError("created packing item readback failed", readError);

  const fallback: PersistedPackingItem = {
    id: itemId,
    trip_id: input.tripId,
    ...itemValues(input),
    created_at: null,
    updated_at: null,
  };
  return { data: data || fallback, error: null };
}

export async function updatePackingItem(
  input: UpdatePackingItemInput,
): Promise<PackingServiceResult<PersistedPackingItem>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (!isUuid(input.id) || !input.name.trim()) {
    return { data: null, error: { code: "INVALID_RECORD", message: "Choose a valid packing item and enter its name." } };
  }
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to edit packing items." } };

  const { error } = await supabase.from("packing_items").update(itemValues(input))
    .eq("id", input.id).eq("trip_id", input.tripId);
  if (error) {
    logPackingError("packing item update failed", error);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't update this packing item." } };
  }

  const { data, error: readError } = await supabase.from("packing_items").select("*")
    .eq("id", input.id).eq("trip_id", input.tripId).maybeSingle();
  if (readError || !data) {
    if (readError) logPackingError("updated packing item readback failed", readError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't confirm the packing item update." } };
  }
  return { data, error: null };
}

export async function deletePackingItem(
  input: DeletePackingItemInput,
): Promise<PackingServiceResult<null>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (!isUuid(input.id)) return { data: null, error: { code: "INVALID_RECORD", message: "This packing item is not available." } };
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to delete packing items." } };

  const { error } = await supabase.from("packing_items").delete()
    .eq("id", input.id).eq("trip_id", input.tripId);
  if (error) {
    logPackingError("packing item delete failed", error);
    return { data: null, error: { code: "DELETE_FAILED", message: "We couldn't delete this packing item." } };
  }
  return { data: null, error: null };
}

export async function togglePackingItemPacked(
  input: TogglePackingItemInput,
): Promise<PackingServiceResult<PersistedPackingItem>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (!isUuid(input.id)) return { data: null, error: { code: "INVALID_RECORD", message: "This packing item is not available." } };
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to update packing items." } };

  const permission = await confirmCanEditTrip({ supabase, user }, input.tripId);
  if (permission.error) return { data: null, error: permission.error };

  const { error } = await supabase.from("packing_items").update({ is_packed: input.isPacked })
    .eq("id", input.id).eq("trip_id", input.tripId);
  if (error) {
    logPackingError("packing item toggle failed", error);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't update this packing item." } };
  }

  const { data, error: readError } = await supabase.from("packing_items").select("*")
    .eq("id", input.id).eq("trip_id", input.tripId).maybeSingle();
  if (readError || !data) {
    if (readError) logPackingError("toggled packing item readback failed", readError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't confirm the packing update." } };
  }
  return { data, error: null };
}
