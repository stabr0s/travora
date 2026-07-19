import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  PublicSharedTrip,
  PublicShareServiceResult,
} from "@/features/public-share/types/public-share";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logPublicShareReadError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;
  console.error(`[Public Share] ${operation}`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
}

function hasSafeTokenShape(token: string) {
  return token.length >= 32 && token.length <= 160 && /^[A-Za-z0-9_-]+$/.test(token);
}

function normalizePayload(payload: unknown): PublicSharedTrip | null {
  if (!payload || typeof payload !== "object") return null;
  const candidate = payload as PublicSharedTrip;
  if (!candidate.trip || typeof candidate.trip.title !== "string") return null;

  return {
    trip: candidate.trip,
    places: Array.isArray(candidate.places) ? candidate.places : [],
    planner: Array.isArray(candidate.planner) ? candidate.planner : [],
    reservations: Array.isArray(candidate.reservations) ? candidate.reservations : [],
    budget: Array.isArray(candidate.budget) ? candidate.budget : [],
    packing: Array.isArray(candidate.packing) ? candidate.packing : [],
  };
}

export async function getPublicTripShare(
  token: string,
): Promise<PublicShareServiceResult> {
  const normalizedToken = token.trim();
  if (!hasSafeTokenShape(normalizedToken)) {
    return { data: null, error: { code: "NOT_FOUND", message: "This shared trip is not available." } };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_public_trip_share", {
    target_token: normalizedToken,
  });

  if (error) {
    logPublicShareReadError("public share read failed", error);
    return { data: null, error: { code: "LOAD_FAILED", message: "We couldn't load this shared trip." } };
  }

  const share = normalizePayload(data);
  if (!share) {
    return { data: null, error: { code: "NOT_FOUND", message: "This shared trip is not available." } };
  }

  return { data: share, error: null };
}
