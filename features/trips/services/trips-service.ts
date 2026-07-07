import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  PersistedTrip,
  PersistedTripCard,
  PersistedTripRole,
  TripsServiceResult,
} from "@/features/trips/types/persisted-trip";

export { createTrip } from "@/features/trips/services/trip-create-service";

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

function logSupabaseDiagnostic(
  operation: string,
  error: SupabaseDiagnostic,
) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.error(`[Trips] ${operation}`, {
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

export async function getTripsAuthState(): Promise<
  TripsServiceResult<{ isSignedIn: true }>
> {
  const { user } = await getAuthContext();

  return user
    ? { data: { isSignedIn: true }, error: null }
    : { data: null, error: authRequired };
}

export async function getCurrentUserTrips(): Promise<
  TripsServiceResult<PersistedTrip[]>
> {
  const { supabase, user } = await getAuthContext();

  if (!user) {
    return { data: null, error: authRequired };
  }

  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("start_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    return {
      data: null,
      error: { code: "LOAD_FAILED", message: "We couldn't load your saved trips." },
    };
  }

  return { data, error: null };
}

export async function getTripCardsForCurrentUser(): Promise<
  TripsServiceResult<PersistedTripCard[]>
> {
  const { supabase, user } = await getAuthContext();

  if (!user) {
    return { data: null, error: authRequired };
  }

  const { data: trips, error: tripsError } = await supabase
    .from("trips")
    .select("*")
    .order("start_date", { ascending: true, nullsFirst: false })
    .order("updated_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (tripsError) {
    logSupabaseDiagnostic("trip cards query failed", tripsError);
    return {
      data: null,
      error: { code: "LOAD_FAILED", message: "We couldn't load your saved trips." },
    };
  }

  const { data: memberships, error: membershipsError } = await supabase
    .from("trip_members")
    .select("trip_id, role, status")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (membershipsError) {
    logSupabaseDiagnostic("trip membership query failed", membershipsError);
    return {
      data: null,
      error: { code: "LOAD_FAILED", message: "We couldn't load your trip access." },
    };
  }

  const roleByTripId = new Map<string, PersistedTripRole>();
  memberships?.forEach((membership) => {
    roleByTripId.set(membership.trip_id, membership.role);
  });

  const cards = trips.map((trip) => ({
    trip,
    role: trip.owner_id === user.id ? "owner" : roleByTripId.get(trip.id) || null,
  }));

  return { data: cards, error: null };
}

export async function getTripById(
  tripId: string,
): Promise<TripsServiceResult<PersistedTrip>> {
  const { supabase, user } = await getAuthContext();

  if (!user) {
    return { data: null, error: authRequired };
  }

  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .maybeSingle();

  if (error) {
    return {
      data: null,
      error: { code: "LOAD_FAILED", message: "We couldn't load this trip." },
    };
  }

  if (!data) {
    return {
      data: null,
      error: { code: "NOT_FOUND", message: "This trip is not available." },
    };
  }

  return { data, error: null };
}
