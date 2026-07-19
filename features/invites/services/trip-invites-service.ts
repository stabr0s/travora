import { randomBytes, randomUUID } from "node:crypto";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";
import type { Database } from "@/types/database";
import type {
  PersistedTripInvite,
  TripInviteRole,
  TripInviteServiceResult,
} from "@/features/invites/types/trip-invite";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logInviteError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;
  console.error(`[Trip Invites] ${operation}`, {
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

function generateInviteToken() {
  return randomBytes(32).toString("base64url");
}

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export async function getTripInvitesForTrip(
  tripId: string,
): Promise<TripInviteServiceResult<PersistedTripInvite[]>> {
  if (!isUuid(tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to view trip invites." } };

  const { data, error } = await supabase
    .from("trip_invites")
    .select("*")
    .eq("trip_id", tripId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    logInviteError("invite query failed", error);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load pending invites." } };
  }

  return { data: data || [], error: null };
}

export async function createTripInvite(input: {
  tripId: string;
  email: string;
  role: TripInviteRole;
}): Promise<TripInviteServiceResult<PersistedTripInvite>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  const email = input.email.trim().toLowerCase();
  if (!isValidEmail(email)) return { data: null, error: { code: "INVALID_INPUT", message: "Enter a valid email address." } };
  if (input.role !== "viewer" && input.role !== "editor") {
    return { data: null, error: { code: "INVALID_INPUT", message: "Choose Viewer or Editor." } };
  }

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to create invite links." } };

  const maxAttempts = 3;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const inviteId = randomUUID();
    const payload: Database["public"]["Tables"]["trip_invites"]["Insert"] = {
      id: inviteId,
      trip_id: input.tripId,
      email,
      role: input.role,
      token: generateInviteToken(),
      status: "pending",
      invited_by: user.id,
    };

    const { error } = await supabase.from("trip_invites").insert(payload);
    if (error) {
      logInviteError("invite insert failed", error);
      if (error.code === "23505" && error.message.includes("pending_trip_email")) {
        return { data: null, error: { code: "CREATE_FAILED", message: "There is already a pending invite for this email." } };
      }
      if (error.code === "23505" && attempt < maxAttempts - 1) continue;
      return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't create this invite link." } };
    }

    const { data, error: readError } = await supabase
      .from("trip_invites")
      .select("*")
      .eq("id", inviteId)
      .maybeSingle();

    if (readError || !data) {
      if (readError) logInviteError("invite readback failed", readError);
      return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't confirm this invite link." } };
    }

    return { data, error: null };
  }

  return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't generate a unique invite link." } };
}

export async function revokeTripInvite(input: {
  tripId: string;
  inviteId: string;
}): Promise<TripInviteServiceResult<null>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (!isUuid(input.inviteId)) return { data: null, error: { code: "INVALID_INVITE", message: "This invite is not available." } };

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to revoke invite links." } };

  const { error } = await supabase
    .from("trip_invites")
    .update({ status: "revoked" })
    .eq("id", input.inviteId)
    .eq("trip_id", input.tripId)
    .eq("status", "pending");

  if (error) {
    logInviteError("invite revoke failed", error);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't revoke this invite." } };
  }

  return { data: null, error: null };
}
