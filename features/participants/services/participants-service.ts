import type {
  AddParticipantInput,
  ParticipantsServiceResult,
  PersistedParticipant,
  RemoveParticipantInput,
  UpdateParticipantInput,
} from "@/features/participants/types/persisted-participant";
import type {
  ParticipantRole,
  ParticipantStatus,
} from "@/features/participants/types/participant";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logParticipantsError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;
  console.error(`[Participants] ${operation}`, {
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

function mapParticipant(row: {
  member_id: string;
  trip_id: string;
  user_id: string;
  role: string;
  status: string;
  created_at: string | null;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
}): PersistedParticipant {
  return {
    memberId: row.member_id,
    tripId: row.trip_id,
    userId: row.user_id,
    role: row.role as ParticipantRole,
    status: row.status as ParticipantStatus,
    createdAt: row.created_at,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
  };
}

export async function getParticipantsForTrip(
  tripId: string,
): Promise<ParticipantsServiceResult<PersistedParticipant[]>> {
  if (!isUuid(tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to view trip participants." } };

  const { data, error } = await supabase.rpc("get_trip_participants", { target_trip_id: tripId });
  if (error) {
    logParticipantsError("participants query failed", error);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load participants for this trip." } };
  }
  return { data: (data || []).map(mapParticipant), error: null };
}

export async function getCurrentUserTripRole(
  tripId: string,
): Promise<ParticipantsServiceResult<ParticipantRole | null>> {
  if (!isUuid(tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to view trip access." } };

  const { data: trip, error: tripError } = await supabase.from("trips")
    .select("owner_id").eq("id", tripId).maybeSingle();
  if (tripError) {
    logParticipantsError("trip role lookup failed", tripError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't confirm your trip role." } };
  }
  if (trip?.owner_id === user.id) return { data: "owner", error: null };

  const { data: member, error } = await supabase.from("trip_members")
    .select("role, status").eq("trip_id", tripId).eq("user_id", user.id).maybeSingle();
  if (error) {
    logParticipantsError("member role lookup failed", error);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't confirm your trip role." } };
  }
  return { data: member?.status === "active" ? member.role : null, error: null };
}

export async function addParticipant(
  input: AddParticipantInput,
): Promise<ParticipantsServiceResult<string>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to add participants." } };

  const { data, error } = await supabase.rpc("add_trip_member_by_email", {
    target_trip_id: input.tripId,
    target_email: input.email,
    target_role: input.role,
    target_status: input.status,
  });
  if (error) {
    logParticipantsError("participant add failed", error);
    if (error.message.includes("PROFILE_NOT_FOUND")) {
      return { data: null, error: { code: "CREATE_FAILED", message: "This user needs to create an account before they can be added." } };
    }
    if (error.message.includes("ALREADY_MEMBER")) {
      return { data: null, error: { code: "CREATE_FAILED", message: "This person already has access to this trip." } };
    }
    if (error.message.includes("OWNER_REQUIRED")) {
      return { data: null, error: { code: "OWNER_REQUIRED", message: "Only the trip owner can manage access." } };
    }
    return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't add this participant." } };
  }
  return { data, error: null };
}

export async function updateParticipant(
  input: UpdateParticipantInput,
): Promise<ParticipantsServiceResult<null>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (!isUuid(input.memberId)) return { data: null, error: { code: "INVALID_RECORD", message: "This participant is not available." } };
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to edit participants." } };

  const { data: trip, error: tripError } = await supabase.from("trips").select("owner_id").eq("id", input.tripId).maybeSingle();
  if (tripError) {
    logParticipantsError("participant owner check failed", tripError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't confirm participant access." } };
  }
  if (trip?.owner_id !== user.id) return { data: null, error: { code: "OWNER_REQUIRED", message: "Only the trip owner can manage access." } };
  const { data: member, error: memberError } = await supabase.from("trip_members")
    .select("role").eq("id", input.memberId).eq("trip_id", input.tripId).maybeSingle();
  if (memberError) {
    logParticipantsError("participant role check failed", memberError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't load participant details." } };
  }
  if (!member) return { data: null, error: { code: "INVALID_RECORD", message: "This participant is not available." } };
  if (member.role === "owner") {
    return { data: null, error: { code: "UPDATE_FAILED", message: "The trip owner's role cannot be changed." } };
  }

  const { error } = await supabase.from("trip_members")
    .update({ role: input.role, status: input.status })
    .eq("id", input.memberId).eq("trip_id", input.tripId);
  if (error) {
    logParticipantsError("participant update failed", error);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't update this participant." } };
  }
  return { data: null, error: null };
}

export async function removeParticipant(
  input: RemoveParticipantInput,
): Promise<ParticipantsServiceResult<null>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (!isUuid(input.memberId)) return { data: null, error: { code: "INVALID_RECORD", message: "This participant is not available." } };
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to remove participants." } };

  const { data: trip, error: tripError } = await supabase.from("trips").select("owner_id").eq("id", input.tripId).maybeSingle();
  if (tripError) {
    logParticipantsError("participant owner check failed", tripError);
    return { data: null, error: { code: "DELETE_FAILED", message: "We couldn't confirm participant access." } };
  }
  if (trip?.owner_id !== user.id) return { data: null, error: { code: "OWNER_REQUIRED", message: "Only the trip owner can manage access." } };
  const { data: member, error: memberError } = await supabase.from("trip_members")
    .select("role").eq("id", input.memberId).eq("trip_id", input.tripId).maybeSingle();
  if (memberError) {
    logParticipantsError("participant remove check failed", memberError);
    return { data: null, error: { code: "DELETE_FAILED", message: "We couldn't load participant details." } };
  }
  if (!member) return { data: null, error: { code: "INVALID_RECORD", message: "This participant is not available." } };
  if (member.role === "owner") {
    return { data: null, error: { code: "DELETE_FAILED", message: "The trip owner cannot be removed." } };
  }

  const { error } = await supabase.from("trip_members").delete()
    .eq("id", input.memberId).eq("trip_id", input.tripId);
  if (error) {
    logParticipantsError("participant remove failed", error);
    return { data: null, error: { code: "DELETE_FAILED", message: "We couldn't remove this participant." } };
  }
  return { data: null, error: null };
}
