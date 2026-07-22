import { randomUUID } from "node:crypto";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";
import { buildDuplicateModulePayloads } from "@/features/trips/services/trip-duplicate-payloads";
import type {
  DuplicateTripInput,
  PersistedTrip,
  TripsServiceResult,
} from "@/features/trips/types/persisted-trip";
import type { Database } from "@/types/database";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logDuplicateError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;
  console.error(`[Trip Duplicate] ${operation}`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
}

async function cleanupNewTrip(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  tripId: string,
) {
  const { error } = await supabase.from("trips").delete().eq("id", tripId);
  if (error) logDuplicateError("cleanup failed", error);
}

function canDuplicate(role: string | null | undefined, isOwner: boolean) {
  return isOwner || role === "editor" || role === "owner";
}

export async function duplicateTrip(
  input: DuplicateTripInput,
): Promise<TripsServiceResult<PersistedTrip>> {
  if (!isUuid(input.tripId) || input.title.trim().length < 2) {
    return { data: null, error: { code: "INVALID_TRIP", message: "Enter a name for the copied trip." } };
  }

  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to duplicate trips." } };

  const { data: sourceTrip, error: tripError } = await supabase
    .from("trips")
    .select("*")
    .eq("id", input.tripId)
    .maybeSingle();

  if (tripError) {
    logDuplicateError("source trip read failed", tripError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load the trip to duplicate." } };
  }
  if (!sourceTrip) return { data: null, error: { code: "NOT_FOUND", message: "This trip is not available." } };

  const isOwner = sourceTrip.owner_id === user.id;
  const { data: member, error: memberError } = isOwner
    ? { data: null, error: null }
    : await supabase.from("trip_members").select("role, status")
      .eq("trip_id", input.tripId).eq("user_id", user.id).maybeSingle();

  if (memberError) {
    logDuplicateError("source trip role read failed", memberError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't confirm duplicate permissions." } };
  }
  if (!canDuplicate(member?.status === "active" ? member.role : null, isOwner)) {
    return { data: null, error: { code: "PERMISSION_DENIED", message: "Only owners and editors can duplicate this trip." } };
  }

  const [places, planner, reservations, budget, packing, importantInfo, travelLinks] = await Promise.all([
    supabase.from("places").select("*").eq("trip_id", input.tripId),
    supabase.from("planner_items").select("*").eq("trip_id", input.tripId),
    supabase.from("reservations").select("*").eq("trip_id", input.tripId),
    supabase.from("budget_expenses").select("*").eq("trip_id", input.tripId),
    supabase.from("packing_items").select("*").eq("trip_id", input.tripId),
    supabase.from("trip_important_info").select("*").eq("trip_id", input.tripId).maybeSingle(),
    supabase.from("travel_links").select("*").eq("trip_id", input.tripId),
  ]);

  const readError = places.error || planner.error || reservations.error
    || budget.error || packing.error || importantInfo.error || travelLinks.error;
  if (readError) {
    logDuplicateError("source modules read failed", readError);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load trip content to duplicate." } };
  }

  const newTripId = randomUUID();
  const newTripPayload: Database["public"]["Tables"]["trips"]["Insert"] = {
    id: newTripId,
    owner_id: user.id,
    title: input.title.trim(),
    destination: sourceTrip.destination,
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    cover_image_url: sourceTrip.cover_image_url,
    status: "planning",
    description: sourceTrip.description,
    currency: sourceTrip.currency || "EUR",
    public_share_enabled: false,
    public_share_token: null,
    public_share_created_at: null,
    public_share_updated_at: null,
  };

  const { error: newTripError } = await supabase.from("trips").insert(newTripPayload);
  if (newTripError) {
    logDuplicateError("new trip insert failed", newTripError);
    return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't create the copied trip." } };
  }

  const { error: ownerError } = await supabase.from("trip_members").insert({
    trip_id: newTripId,
    user_id: user.id,
    role: "owner",
    status: "active",
  });
  if (ownerError) {
    logDuplicateError("new owner membership insert failed", ownerError);
    await cleanupNewTrip(supabase, newTripId);
    return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't finish setting up the copied trip." } };
  }

  const {
    placePayloads,
    plannerPayloads,
    reservationPayloads,
    travelLinkPayloads,
    budgetPayloads,
    packingPayloads,
  } = buildDuplicateModulePayloads(newTripId, user.id, {
    places: places.data || [],
    planner: planner.data || [],
    reservations: reservations.data || [],
    travelLinks: travelLinks.data || [],
    budget: budget.data || [],
    packing: packing.data || [],
  });

  const copySteps = [
    () => placePayloads.length ? supabase.from("places").insert(placePayloads) : null,
    () => plannerPayloads.length ? supabase.from("planner_items").insert(plannerPayloads) : null,
    () => reservationPayloads.length ? supabase.from("reservations").insert(reservationPayloads) : null,
    () => travelLinkPayloads.length ? supabase.from("travel_links").insert(travelLinkPayloads) : null,
    () => budgetPayloads.length ? supabase.from("budget_expenses").insert(budgetPayloads) : null,
    () => packingPayloads.length ? supabase.from("packing_items").insert(packingPayloads) : null,
    () => importantInfo.data?.content
      ? supabase.from("trip_important_info").insert({ trip_id: newTripId, content: importantInfo.data.content })
      : null,
  ];

  for (const runStep of copySteps) {
    const result = runStep();
    if (!result) continue;
    const { error } = await result;
    if (error) {
      logDuplicateError("module copy failed", error);
      await cleanupNewTrip(supabase, newTripId);
      return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't copy all trip content. Nothing was duplicated." } };
    }
  }

  const { data: newTrip, error: readErrorAfterCopy } = await supabase
    .from("trips")
    .select("*")
    .eq("id", newTripId)
    .maybeSingle();

  if (readErrorAfterCopy) logDuplicateError("new trip readback failed", readErrorAfterCopy);
  const fallbackTrip: PersistedTrip = {
    id: newTripId,
    owner_id: user.id,
    title: newTripPayload.title,
    destination: newTripPayload.destination || null,
    start_date: newTripPayload.start_date || null,
    end_date: newTripPayload.end_date || null,
    cover_image_url: newTripPayload.cover_image_url || null,
    status: "planning",
    description: newTripPayload.description || null,
    currency: newTripPayload.currency || "EUR",
    public_share_enabled: false,
    public_share_token: null,
    public_share_created_at: null,
    public_share_updated_at: null,
    public_share_sections: {
      overview: true,
      places: true,
      planner: true,
      reservations: true,
      budget: true,
      packing: true,
    },
    created_at: null,
    updated_at: null,
  };

  return { data: newTrip || fallbackTrip, error: null };
}
