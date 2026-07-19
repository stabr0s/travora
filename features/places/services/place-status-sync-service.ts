import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";
import type { PlacesServiceResult } from "@/features/places/types/persisted-place";

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

export async function markPlacePlannedIfSafe(input: {
  tripId: string;
  id: string;
}): Promise<PlacesServiceResult<null>> {
  if (!isUuid(input.tripId)) {
    return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  }
  if (!isUuid(input.id)) {
    return { data: null, error: { code: "INVALID_RECORD", message: "This place is not available." } };
  }

  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to edit places." } };

  const { data: place, error: readError } = await supabase.from("places").select("status")
    .eq("id", input.id).eq("trip_id", input.tripId).maybeSingle();
  if (readError) {
    logPlacesError("place planned sync read failed", readError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't inspect this place status." } };
  }
  if (!place) {
    return { data: null, error: { code: "INVALID_RECORD", message: "This place is not available." } };
  }
  if (place.status === "visited" || place.status === "rejected" || place.status === "planned") {
    return { data: null, error: null };
  }

  const { error } = await supabase.from("places").update({ status: "planned" })
    .eq("id", input.id).eq("trip_id", input.tripId);
  if (error) {
    logPlacesError("place planned sync update failed", error);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't update this place status." } };
  }

  return { data: null, error: null };
}
