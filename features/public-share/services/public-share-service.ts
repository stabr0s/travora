import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  PublicShareSections,
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

const defaultSections: PublicShareSections = {
  overview: true,
  places: true,
  planner: true,
  reservations: true,
  budget: true,
  packing: true,
};

function normalizeSections(input: unknown): PublicShareSections {
  if (!input || typeof input !== "object") return defaultSections;
  const candidate = input as Partial<Record<keyof PublicShareSections, unknown>>;

  return {
    overview: true,
    places: typeof candidate.places === "boolean" ? candidate.places : true,
    planner: typeof candidate.planner === "boolean" ? candidate.planner : true,
    reservations: typeof candidate.reservations === "boolean" ? candidate.reservations : true,
    budget: typeof candidate.budget === "boolean" ? candidate.budget : true,
    packing: typeof candidate.packing === "boolean" ? candidate.packing : true,
  };
}

function normalizePayload(payload: unknown): PublicSharedTrip | null {
  if (!payload || typeof payload !== "object") return null;
  const candidate = payload as PublicSharedTrip;
  if (!candidate.trip || typeof candidate.trip.title !== "string") return null;
  const sections = normalizeSections(candidate.sections);

  return {
    trip: candidate.trip,
    sections,
    places: sections.places && Array.isArray(candidate.places) ? candidate.places : [],
    planner: sections.planner && Array.isArray(candidate.planner) ? candidate.planner : [],
    reservations: sections.reservations && Array.isArray(candidate.reservations) ? candidate.reservations : [],
    budget: sections.budget && Array.isArray(candidate.budget) ? candidate.budget : [],
    packing: sections.packing && Array.isArray(candidate.packing) ? candidate.packing : [],
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
