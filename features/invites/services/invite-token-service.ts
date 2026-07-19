import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type {
  TripInviteAuthState,
  TripInvitePreview,
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

function isValidToken(token: string) {
  return /^[A-Za-z0-9_-]{32,160}$/.test(token);
}

function mapPreview(row: Database["public"]["Functions"]["get_trip_invite_by_token"]["Returns"][number]): TripInvitePreview {
  return {
    tripTitle: row.trip_title,
    tripDestination: row.trip_destination,
    invitedEmail: row.invited_email,
    invitedRole: row.invited_role === "editor" ? "editor" : "viewer",
    status: row.invite_status === "pending" ? "pending" : "expired",
    expiresAt: row.expires_at,
    isAcceptable: row.is_acceptable,
  };
}

export async function getTripInviteAuthState(): Promise<TripInviteAuthState> {
  const { supabase, user } = await getAuthContext();
  if (!user) return { isSignedIn: false, email: null };

  const { data } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .maybeSingle();

  return { isSignedIn: true, email: data?.email || user.email || null };
}

export async function getTripInviteByToken(
  token: string,
): Promise<TripInviteServiceResult<TripInvitePreview>> {
  const normalizedToken = token.trim();
  if (!isValidToken(normalizedToken)) {
    return { data: null, error: { code: "INVALID_INVITE", message: "This invite link is not available." } };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_trip_invite_by_token", { target_token: normalizedToken });

  if (error) {
    logInviteError("invite token preview failed", error);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load this invite." } };
  }
  if (!data?.length) {
    return { data: null, error: { code: "INVALID_INVITE", message: "This invite link is not available." } };
  }

  return { data: mapPreview(data[0]), error: null };
}

export async function acceptTripInvite(
  token: string,
): Promise<TripInviteServiceResult<{ tripId: string; message: string }>> {
  const normalizedToken = token.trim();
  if (!isValidToken(normalizedToken)) {
    return { data: null, error: { code: "INVALID_INVITE", message: "This invite link is not available." } };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("accept_trip_invite", { target_token: normalizedToken });

  if (error) {
    logInviteError("invite accept failed", error);
    if (error.message.includes("EMAIL_MISMATCH")) {
      return { data: null, error: { code: "EMAIL_MISMATCH", message: "This invite is for another email address." } };
    }
    if (error.message.includes("AUTH_REQUIRED")) {
      return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to accept this invite." } };
    }
    if (error.message.includes("INVITE_NOT_PENDING") || error.message.includes("INVITE_EXPIRED")) {
      return { data: null, error: { code: "ALREADY_USED", message: "This invite is no longer available." } };
    }
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't accept this invite." } };
  }

  const accepted = data?.[0];
  if (!accepted?.trip_id) {
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't confirm this invite." } };
  }

  return { data: { tripId: accepted.trip_id, message: accepted.result_message || "Invite accepted." }, error: null };
}
