import { randomBytes } from "node:crypto";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";
import type { Database } from "@/types/database";
import type {
  PersistedTrip,
  TripsServiceResult,
} from "@/features/trips/types/persisted-trip";

const ownerOnlyMessage = "Only the trip owner can manage public sharing.";

type ShareMode = "enable" | "disable" | "regenerate";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logPublicShareError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;
  console.error(`[Public Share] ${operation}`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
}

function generateShareToken() {
  return randomBytes(32).toString("base64url");
}

async function getAuthContext() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}

async function readUpdatedTrip(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  tripId: string,
  userId: string,
): Promise<TripsServiceResult<PersistedTrip>> {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (error || !data) {
    if (error) logPublicShareError("public share readback failed", error);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't confirm the public sharing update." } };
  }

  return { data, error: null };
}

export async function updatePublicShare(
  tripId: string,
  mode: ShareMode,
): Promise<TripsServiceResult<PersistedTrip>> {
  if (!isUuid(tripId)) {
    return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  }

  const { supabase, user } = await getAuthContext();
  if (!user) {
    return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to manage public sharing." } };
  }

  const { data: existingTrip, error: readError } = await supabase
    .from("trips")
    .select("owner_id, public_share_token, public_share_created_at")
    .eq("id", tripId)
    .maybeSingle();

  if (readError) {
    logPublicShareError("trip owner read failed", readError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load public sharing settings." } };
  }
  if (!existingTrip) {
    return { data: null, error: { code: "NOT_FOUND", message: "This trip is not available." } };
  }
  if (existingTrip.owner_id !== user.id) {
    return { data: null, error: { code: "PERMISSION_DENIED", message: ownerOnlyMessage } };
  }

  const now = new Date().toISOString();
  const maxAttempts = mode === "disable" ? 1 : 3;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const token = mode === "enable"
      ? existingTrip.public_share_token || generateShareToken()
      : mode === "regenerate"
        ? generateShareToken()
        : existingTrip.public_share_token;

    const payload: Database["public"]["Tables"]["trips"]["Update"] = {
      public_share_enabled: mode !== "disable",
      public_share_token: token,
      public_share_updated_at: now,
    };
    if (mode !== "disable") {
      payload.public_share_created_at = existingTrip.public_share_created_at || now;
    }

    const { error: updateError } = await supabase
      .from("trips")
      .update(payload)
      .eq("id", tripId)
      .eq("owner_id", user.id);

    if (!updateError) return readUpdatedTrip(supabase, tripId, user.id);

    logPublicShareError("public share update failed", updateError);
    if (updateError.code !== "23505" || mode === "disable") {
      return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't update public sharing." } };
    }
  }

  return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't generate a unique public link. Try again." } };
}
