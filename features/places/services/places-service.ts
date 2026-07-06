import { randomUUID } from "node:crypto";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  CreatePlaceInput,
  DeletePlaceInput,
  PersistedPlace,
  PlacesServiceResult,
  UpdatePlaceInput,
} from "@/features/places/types/persisted-place";
import { isUuid } from "@/lib/validation/is-uuid";
import type { Database } from "@/types/database";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logPlacesError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;

  console.error(`[Places] ${operation}`, {
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

function hasValidMapFields(input: CreatePlaceInput) {
  const validLatitude = input.latitude == null
    || (Number.isFinite(input.latitude) && input.latitude >= -90 && input.latitude <= 90);
  const validLongitude = input.longitude == null
    || (Number.isFinite(input.longitude) && input.longitude >= -180 && input.longitude <= 180);
  const validMapOrder = input.mapOrder == null
    || (Number.isInteger(input.mapOrder) && input.mapOrder >= 0);

  return validLatitude && validLongitude && validMapOrder;
}

export async function getPlacesForTrip(
  tripId: string,
): Promise<PlacesServiceResult<PersistedPlace[]>> {
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
      error: { code: "AUTH_REQUIRED", message: "Sign in to view saved places." },
    };
  }

  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: false });

  if (error) {
    logPlacesError("places query failed", error);
    return {
      data: null,
      error: { code: "LOAD_FAILED", message: "We couldn't load places for this trip." },
    };
  }

  return { data, error: null };
}

export async function createPlace(
  input: CreatePlaceInput,
): Promise<PlacesServiceResult<PersistedPlace>> {
  if (!isUuid(input.tripId) || !input.title.trim() || !hasValidMapFields(input)) {
    return {
      data: null,
      error: { code: "INVALID_TRIP", message: "Check the saved trip, place name, and optional map values." },
    };
  }

  const { supabase, user } = await getAuthContext();

  if (!user) {
    return {
      data: null,
      error: { code: "AUTH_REQUIRED", message: "Sign in to save places." },
    };
  }

  const placeId = randomUUID();
  const payload: Database["public"]["Tables"]["places"]["Insert"] = {
    id: placeId,
    trip_id: input.tripId,
    title: input.title.trim(),
    category: input.category || null,
    address: input.address || null,
    city: input.city || null,
    country: input.country || null,
    status: input.status || null,
    priority: input.priority || null,
    notes: input.notes || null,
    website_url: input.websiteUrl || null,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    map_order: input.mapOrder ?? null,
  };

  const { error: insertError } = await supabase.from("places").insert(payload);

  if (insertError) {
    logPlacesError("place insert failed", insertError);
    return {
      data: null,
      error: { code: "CREATE_FAILED", message: "We couldn't save this place." },
    };
  }

  const { data: place, error: readError } = await supabase
    .from("places")
    .select("*")
    .eq("id", placeId)
    .single();

  if (readError) logPlacesError("created place readback failed", readError);

  const fallbackPlace: PersistedPlace = {
    id: placeId,
    trip_id: input.tripId,
    title: input.title.trim(),
    category: input.category || null,
    address: input.address || null,
    city: input.city || null,
    country: input.country || null,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    map_order: input.mapOrder ?? null,
    status: input.status || null,
    priority: input.priority || null,
    notes: input.notes || null,
    website_url: input.websiteUrl || null,
    image_url: null,
    created_at: null,
    updated_at: null,
  };

  return { data: place || fallbackPlace, error: null };
}

export async function updatePlace(
  input: UpdatePlaceInput,
): Promise<PlacesServiceResult<PersistedPlace>> {
  if (!isUuid(input.tripId)) {
    return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  }
  if (!isUuid(input.id) || !input.title.trim() || !hasValidMapFields(input)) {
    return { data: null, error: { code: "INVALID_RECORD", message: "Choose a valid place and enter its name." } };
  }

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to edit places." } };

  const payload: Database["public"]["Tables"]["places"]["Update"] = {
    title: input.title.trim(),
    category: input.category || null,
    address: input.address || null,
    city: input.city || null,
    country: input.country || null,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    map_order: input.mapOrder ?? null,
    status: input.status || null,
    priority: input.priority || null,
    notes: input.notes || null,
    website_url: input.websiteUrl || null,
  };
  const { error } = await supabase.from("places").update(payload)
    .eq("id", input.id).eq("trip_id", input.tripId);

  if (error) {
    logPlacesError("place update failed", error);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't update this place." } };
  }

  const { data, error: readError } = await supabase.from("places").select("*")
    .eq("id", input.id).eq("trip_id", input.tripId).maybeSingle();
  if (readError || !data) {
    if (readError) logPlacesError("updated place readback failed", readError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't confirm the place update." } };
  }
  return { data, error: null };
}

export async function deletePlace(
  input: DeletePlaceInput,
): Promise<PlacesServiceResult<null>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (!isUuid(input.id)) return { data: null, error: { code: "INVALID_RECORD", message: "This place is not available." } };

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to delete places." } };

  const { error } = await supabase.from("places").delete()
    .eq("id", input.id).eq("trip_id", input.tripId);
  if (error) {
    logPlacesError("place delete failed", error);
    return { data: null, error: { code: "DELETE_FAILED", message: "We couldn't delete this place." } };
  }
  return { data: null, error: null };
}
