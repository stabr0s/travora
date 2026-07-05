import { randomUUID } from "node:crypto";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  CreatePlaceInput,
  PersistedPlace,
  PlacesServiceResult,
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
  if (!isUuid(input.tripId) || !input.title.trim()) {
    return {
      data: null,
      error: { code: "INVALID_TRIP", message: "Choose a saved trip and enter a place name." },
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
