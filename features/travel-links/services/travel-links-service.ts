import { randomUUID } from "node:crypto";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";
import type { Database } from "@/types/database";
import type {
  CreateTravelLinkInput,
  PersistedTravelLink,
  TravelLinkType,
  TravelLinksServiceResult,
  UpdateTravelLinkInput,
  DeleteTravelLinkInput,
} from "@/features/travel-links/types/travel-link";
import { travelLinkTypes } from "@/features/travel-links/types/travel-link";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logTravelLinksError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;
  console.error(`[Travel Links] ${operation}`, {
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

function normalizeLinkType(value?: string | null): TravelLinkType {
  return travelLinkTypes.includes(value as TravelLinkType)
    ? value as TravelLinkType
    : "other";
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.href;
  } catch {
    return null;
  }
}

async function reservationBelongsToTrip(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  tripId: string,
  reservationId?: string | null,
) {
  if (!reservationId) return true;
  if (!isUuid(reservationId)) return false;
  const { data, error } = await supabase
    .from("reservations")
    .select("id")
    .eq("id", reservationId)
    .eq("trip_id", tripId)
    .maybeSingle();
  if (error) logTravelLinksError("reservation link validation failed", error);
  return Boolean(data && !error);
}

export async function getTravelLinksForTrip(
  tripId: string,
): Promise<TravelLinksServiceResult<PersistedTravelLink[]>> {
  if (!isUuid(tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to view travel links." } };

  const { data, error } = await supabase
    .from("travel_links")
    .select("*")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  if (error) {
    logTravelLinksError("travel links query failed", error);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load travel links for this trip." } };
  }
  return { data, error: null };
}

export async function createTravelLink(
  input: CreateTravelLinkInput,
): Promise<TravelLinksServiceResult<PersistedTravelLink>> {
  const title = input.title.trim();
  const url = normalizeUrl(input.url);
  if (!isUuid(input.tripId) || !title || !url) {
    return { data: null, error: { code: "INVALID_LINK", message: "Enter a title and a valid http or https URL." } };
  }

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to save travel links." } };
  if (!(await reservationBelongsToTrip(supabase, input.tripId, input.reservationId))) {
    return { data: null, error: { code: "INVALID_RESERVATION", message: "This reservation link is not available." } };
  }

  const id = randomUUID();
  const payload: Database["public"]["Tables"]["travel_links"]["Insert"] = {
    id,
    trip_id: input.tripId,
    reservation_id: input.reservationId || null,
    title,
    url,
    link_type: normalizeLinkType(input.linkType),
    note: input.note?.trim() || null,
    created_by: user.id,
  };

  const { error: insertError } = await supabase.from("travel_links").insert(payload);
  if (insertError) {
    logTravelLinksError("travel link insert failed", insertError);
    return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't save this travel link." } };
  }

  const { data, error: readError } = await supabase.from("travel_links").select("*").eq("id", id).maybeSingle();
  if (readError || !data) {
    if (readError) logTravelLinksError("created travel link readback failed", readError);
    return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't confirm this travel link." } };
  }
  return { data, error: null };
}

export async function updateTravelLink(
  input: UpdateTravelLinkInput,
): Promise<TravelLinksServiceResult<PersistedTravelLink>> {
  const title = input.title.trim();
  const url = normalizeUrl(input.url);
  if (!isUuid(input.tripId) || !isUuid(input.id) || !title || !url) {
    return { data: null, error: { code: "INVALID_LINK", message: "Enter a title and a valid http or https URL." } };
  }

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to edit travel links." } };
  if (!(await reservationBelongsToTrip(supabase, input.tripId, input.reservationId))) {
    return { data: null, error: { code: "INVALID_RESERVATION", message: "This reservation link is not available." } };
  }

  const payload: Database["public"]["Tables"]["travel_links"]["Update"] = {
    reservation_id: input.reservationId || null,
    title,
    url,
    link_type: normalizeLinkType(input.linkType),
    note: input.note?.trim() || null,
  };
  const { error } = await supabase.from("travel_links").update(payload)
    .eq("id", input.id).eq("trip_id", input.tripId);
  if (error) {
    logTravelLinksError("travel link update failed", error);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't update this travel link." } };
  }

  const { data, error: readError } = await supabase.from("travel_links").select("*")
    .eq("id", input.id).eq("trip_id", input.tripId).maybeSingle();
  if (readError || !data) {
    if (readError) logTravelLinksError("updated travel link readback failed", readError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't confirm this travel link update." } };
  }
  return { data, error: null };
}

export async function deleteTravelLink(
  input: DeleteTravelLinkInput,
): Promise<TravelLinksServiceResult<null>> {
  if (!isUuid(input.tripId) || !isUuid(input.id)) {
    return { data: null, error: { code: "INVALID_LINK", message: "This travel link is not available." } };
  }
  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to delete travel links." } };

  const { error } = await supabase.from("travel_links").delete()
    .eq("id", input.id).eq("trip_id", input.tripId);
  if (error) {
    logTravelLinksError("travel link delete failed", error);
    return { data: null, error: { code: "DELETE_FAILED", message: "We couldn't delete this travel link." } };
  }
  return { data: null, error: null };
}
