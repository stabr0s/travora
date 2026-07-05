import { randomUUID } from "node:crypto";

import type {
  CreateReservationInput,
  PersistedReservation,
  ReservationsServiceResult,
} from "@/features/reservations/types/persisted-reservation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";
import type { Database } from "@/types/database";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logReservationsError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;

  console.error(`[Reservations] ${operation}`, {
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

export async function getReservationsForTrip(
  tripId: string,
): Promise<ReservationsServiceResult<PersistedReservation[]>> {
  if (!isUuid(tripId)) {
    return {
      data: null,
      error: { code: "INVALID_TRIP", message: "This saved trip is not available." },
    };
  }

  const { supabase, user } = await getAuthContext();

  if (!user) {
    return {
      data: null,
      error: { code: "AUTH_REQUIRED", message: "Sign in to view saved reservations." },
    };
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("trip_id", tripId)
    .order("start_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    logReservationsError("reservations query failed", error);
    return {
      data: null,
      error: { code: "LOAD_FAILED", message: "We couldn't load reservations for this trip." },
    };
  }

  return { data, error: null };
}

export async function createReservation(
  input: CreateReservationInput,
): Promise<ReservationsServiceResult<PersistedReservation>> {
  if (!isUuid(input.tripId) || !input.title.trim()) {
    return {
      data: null,
      error: { code: "INVALID_TRIP", message: "Choose a saved trip and enter a title." },
    };
  }

  if (input.totalPrice !== undefined && !Number.isFinite(input.totalPrice)) {
    return {
      data: null,
      error: { code: "CREATE_FAILED", message: "Enter a valid reservation price." },
    };
  }

  const { supabase, user } = await getAuthContext();

  if (!user) {
    return {
      data: null,
      error: { code: "AUTH_REQUIRED", message: "Sign in to save reservations." },
    };
  }

  const reservationId = randomUUID();
  const payload: Database["public"]["Tables"]["reservations"]["Insert"] = {
    id: reservationId,
    trip_id: input.tripId,
    type: input.type || null,
    title: input.title.trim(),
    provider: input.provider || null,
    reservation_number: input.reservationNumber || null,
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    location: input.location || null,
    total_price: input.totalPrice ?? null,
    currency: input.currency || "EUR",
    status: input.status || "unpaid",
    payer_name: input.payerName || null,
    notes: input.notes || null,
  };

  const { error: insertError } = await supabase.from("reservations").insert(payload);

  if (insertError) {
    logReservationsError("reservation insert failed", insertError);
    return {
      data: null,
      error: { code: "CREATE_FAILED", message: "We couldn't save this reservation." },
    };
  }

  const { data: reservation, error: readError } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", reservationId)
    .single();

  if (readError) logReservationsError("created reservation readback failed", readError);

  const fallbackReservation: PersistedReservation = {
    id: reservationId,
    trip_id: input.tripId,
    type: input.type || null,
    title: input.title.trim(),
    provider: input.provider || null,
    reservation_number: input.reservationNumber || null,
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    location: input.location || null,
    total_price: input.totalPrice ?? null,
    currency: input.currency || "EUR",
    status: input.status || "unpaid",
    payer_name: input.payerName || null,
    notes: input.notes || null,
    created_at: null,
    updated_at: null,
  };

  return { data: reservation || fallbackReservation, error: null };
}
