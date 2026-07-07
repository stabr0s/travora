import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";
import type { Database } from "@/types/database";
import type {
  DeleteTripInput,
  PersistedTrip,
  TripsServiceResult,
  TripStatus,
  UpdateTripInput,
} from "@/features/trips/types/persisted-trip";

const ownerOnlyMessage = "Only the trip owner can manage trip settings.";
const allowedStatuses: TripStatus[] = ["planning", "upcoming", "archived"];

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logTripSettingsError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;

  console.error(`[Trip Settings] ${operation}`, {
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

function normalizeCurrency(value?: string) {
  const currency = value?.trim().toUpperCase();
  return currency || "EUR";
}

function hasValidUpdateInput(input: UpdateTripInput) {
  return (
    isUuid(input.tripId)
    && input.title.trim().length >= 2
    && allowedStatuses.includes(input.status)
  );
}

export async function updateTrip(
  input: UpdateTripInput,
): Promise<TripsServiceResult<PersistedTrip>> {
  if (!hasValidUpdateInput(input)) {
    return {
      data: null,
      error: { code: "INVALID_TRIP", message: "Check the trip settings and try again." },
    };
  }

  const { supabase, user } = await getAuthContext();
  if (!user) {
    return {
      data: null,
      error: { code: "AUTH_REQUIRED", message: "Sign in to manage trip settings." },
    };
  }

  const { data: existingTrip, error: ownerReadError } = await supabase
    .from("trips")
    .select("owner_id")
    .eq("id", input.tripId)
    .maybeSingle();

  if (ownerReadError) {
    logTripSettingsError("trip owner read failed", ownerReadError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load trip settings." } };
  }
  if (!existingTrip) {
    return { data: null, error: { code: "NOT_FOUND", message: "This trip is not available." } };
  }
  if (existingTrip.owner_id !== user.id) {
    return { data: null, error: { code: "PERMISSION_DENIED", message: ownerOnlyMessage } };
  }

  const payload: Database["public"]["Tables"]["trips"]["Update"] = {
    title: input.title.trim(),
    destination: input.destination?.trim() || null,
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    description: input.description?.trim() || null,
    cover_image_url: input.coverImageUrl?.trim() || null,
    status: input.status,
    currency: normalizeCurrency(input.currency),
  };

  const { error: updateError } = await supabase
    .from("trips")
    .update(payload)
    .eq("id", input.tripId)
    .eq("owner_id", user.id);

  if (updateError) {
    logTripSettingsError("trip update failed", updateError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't update trip settings." } };
  }

  const { data: updatedTrip, error: readError } = await supabase
    .from("trips")
    .select("*")
    .eq("id", input.tripId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (readError || !updatedTrip) {
    if (readError) logTripSettingsError("updated trip readback failed", readError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't confirm the trip update." } };
  }

  return { data: updatedTrip, error: null };
}

export async function deleteTrip(
  input: DeleteTripInput,
): Promise<TripsServiceResult<null>> {
  if (!isUuid(input.tripId)) {
    return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  }

  const { supabase, user } = await getAuthContext();
  if (!user) {
    return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to delete trips." } };
  }

  const { data: existingTrip, error: ownerReadError } = await supabase
    .from("trips")
    .select("owner_id")
    .eq("id", input.tripId)
    .maybeSingle();

  if (ownerReadError) {
    logTripSettingsError("trip delete owner read failed", ownerReadError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load trip settings." } };
  }
  if (!existingTrip) {
    return { data: null, error: { code: "NOT_FOUND", message: "This trip is not available." } };
  }
  if (existingTrip.owner_id !== user.id) {
    return { data: null, error: { code: "PERMISSION_DENIED", message: ownerOnlyMessage } };
  }

  const { error: deleteError } = await supabase
    .from("trips")
    .delete()
    .eq("id", input.tripId)
    .eq("owner_id", user.id);

  if (deleteError) {
    logTripSettingsError("trip delete failed", deleteError);
    return { data: null, error: { code: "DELETE_FAILED", message: "We couldn't delete this trip." } };
  }

  return { data: null, error: null };
}
