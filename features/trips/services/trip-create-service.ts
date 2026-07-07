import { randomUUID } from "node:crypto";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  CreateTripInput,
  PersistedTrip,
  TripsServiceResult,
} from "@/features/trips/types/persisted-trip";
import type { Database } from "@/types/database";

const authRequired = {
  code: "AUTH_REQUIRED" as const,
  message: "Sign in to save and manage your trips.",
};

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logTripsError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;

  console.error(`[Trips] ${operation}`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
}

function logAuthDiagnostic(userId: string | null, ownerId: string | null) {
  if (process.env.NODE_ENV !== "development") return;

  console.info("[Trips] auth diagnostic", {
    hasUser: Boolean(userId),
    userId,
    ownerIdInPayload: ownerId,
    ownerMatchesUser: Boolean(userId && ownerId && userId === ownerId),
  });
}

export async function createTrip(
  input: CreateTripInput,
): Promise<TripsServiceResult<PersistedTrip>> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) return { data: null, error: authRequired };

  const tripId = randomUUID();
  const tripPayload: Database["public"]["Tables"]["trips"]["Insert"] = {
    id: tripId,
    owner_id: user.id,
    title: input.title,
    destination: input.destination || null,
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    currency: input.currency || "EUR",
    description: input.description || null,
    status: "planning",
  };

  logAuthDiagnostic(user.id, tripPayload.owner_id);

  const { error: tripError } = await supabase.from("trips").insert(tripPayload);
  if (tripError) {
    logTripsError("trip insert failed", tripError);
    return { data: null, error: { code: "CREATE_FAILED", message: "We couldn't create your trip." } };
  }

  const { error: memberError } = await supabase.from("trip_members").insert({
    trip_id: tripId,
    user_id: user.id,
    role: "owner",
    status: "active",
  });

  if (memberError) {
    logTripsError("owner membership insert failed", memberError);

    const { error: rollbackError } = await supabase
      .from("trips")
      .delete()
      .eq("id", tripId);

    if (rollbackError) logTripsError("trip rollback failed", rollbackError);

    return {
      data: null,
      error: {
        code: "CREATE_FAILED",
        message: "We couldn't finish setting up your trip. Please try again.",
      },
    };
  }

  const { data: trip, error: readError } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  if (readError) logTripsError("created trip readback failed", readError);

  const fallbackTrip: PersistedTrip = {
    id: tripId,
    owner_id: user.id,
    title: input.title,
    destination: input.destination || null,
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    cover_image_url: null,
    status: "planning",
    description: input.description || null,
    currency: input.currency || "EUR",
    created_at: null,
    updated_at: null,
  };

  return { data: trip || fallbackTrip, error: null };
}
