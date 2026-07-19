import type {
  ImportantInfoServiceResult,
  SaveImportantInfoInput,
  TripImportantInfo,
} from "@/features/trip-detail/types/important-info";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";
import type { Database } from "@/types/database";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logImportantInfoError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;
  console.error(`[Important Info] ${operation}`, {
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

export async function getImportantInfoForTrip(
  tripId: string,
): Promise<ImportantInfoServiceResult<TripImportantInfo | null>> {
  if (!isUuid(tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to view important info." } };

  const { data, error } = await supabase
    .from("trip_important_info")
    .select("*")
    .eq("trip_id", tripId)
    .maybeSingle();

  if (error) {
    logImportantInfoError("important info query failed", error);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load important info for this trip." } };
  }

  return { data, error: null };
}

export async function saveImportantInfo(
  input: SaveImportantInfoInput,
): Promise<ImportantInfoServiceResult<TripImportantInfo>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to edit important info." } };

  const payload: Database["public"]["Tables"]["trip_important_info"]["Insert"] = {
    trip_id: input.tripId,
    content: input.content.trim() || null,
  };

  const { error: upsertError } = await supabase
    .from("trip_important_info")
    .upsert(payload, { onConflict: "trip_id" });

  if (upsertError) {
    logImportantInfoError("important info save failed", upsertError);
    return { data: null, error: { code: "SAVE_FAILED", message: "We couldn't save important info." } };
  }

  const { data, error: readError } = await supabase
    .from("trip_important_info")
    .select("*")
    .eq("trip_id", input.tripId)
    .maybeSingle();

  if (readError || !data) {
    if (readError) logImportantInfoError("important info readback failed", readError);
    return { data: null, error: { code: "SAVE_FAILED", message: "We couldn't confirm important info update." } };
  }

  return { data, error: null };
}
