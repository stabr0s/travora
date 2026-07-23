import type { PersistedPlannerItem, PlannerServiceResult } from "@/features/planner/types/persisted-planner";
import { createPlannerItem } from "@/features/planner/services/planner-service";
import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

type ReservationPlannerInput = {
  tripId: string;
  reservationId: string;
};

function logReservationPlannerError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;

  console.error(`[Planner] ${operation}`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
}

function getDateTimeParts(value: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  const iso = parsed.toISOString();
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) };
}

function normalizeTitle(value: string) {
  return value.trim().toLowerCase();
}

function plannerTypeFromReservation(type: string | null) {
  if (type === "flight") return "flight";
  if (type === "hotel") return "hotel";
  if (type === "car" || type === "transport") return "transport";
  if (type === "ticket" || type === "activity") return "activity";
  return "other";
}

function shortened(value: string | null, maxLength: number) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > maxLength
    ? `${trimmed.slice(0, maxLength - 1).trim()}…`
    : trimmed;
}

function buildPlannerDescription(reservation: PersistedReservation) {
  const status = reservation.status
    ? `${reservation.status.charAt(0).toUpperCase()}${reservation.status.slice(1)}`
    : null;

  return [
    shortened(reservation.provider, 160)
      ? `Provider: ${shortened(reservation.provider, 160)}`
      : null,
    shortened(reservation.reservation_number, 120)
      ? `Reference: ${shortened(reservation.reservation_number, 120)}`
      : null,
    shortened(reservation.location, 240)
      ? `Location: ${shortened(reservation.location, 240)}`
      : null,
    status ? `Status: ${status}` : null,
    shortened(reservation.notes, 500)
      ? `Notes: ${shortened(reservation.notes, 500)}`
      : null,
  ].filter((line): line is string => Boolean(line)).join("\n");
}

export async function addReservationToPlanner(
  input: ReservationPlannerInput,
): Promise<PlannerServiceResult<PersistedPlannerItem>> {
  if (!isUuid(input.tripId) || !isUuid(input.reservationId)) {
    return {
      data: null,
      error: { code: "INVALID_RECORD", message: "This reservation is not available." },
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return {
      data: null,
      error: { code: "AUTH_REQUIRED", message: "Sign in to add reservations to Planner." },
    };
  }

  const { data: reservation, error: reservationError } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", input.reservationId)
    .eq("trip_id", input.tripId)
    .maybeSingle();

  if (reservationError) {
    logReservationPlannerError("reservation read failed", reservationError);
    return {
      data: null,
      error: { code: "LOAD_FAILED", message: "We couldn't load this reservation." },
    };
  }
  if (!reservation) {
    return {
      data: null,
      error: { code: "INVALID_RECORD", message: "This reservation is not available." },
    };
  }

  const start = getDateTimeParts(reservation.start_date);
  if (!start) {
    return {
      data: null,
      error: {
        code: "INVALID_RECORD",
        message: "Add a date to the reservation before adding it to Planner.",
      },
    };
  }
  const end = getDateTimeParts(reservation.end_date);

  const { data: sameDayItems, error: duplicateError } = await supabase
    .from("planner_items")
    .select("title,start_time")
    .eq("trip_id", input.tripId)
    .eq("date", start.date);

  if (duplicateError) {
    logReservationPlannerError("reservation duplicate check failed", duplicateError);
    return {
      data: null,
      error: { code: "LOAD_FAILED", message: "We couldn't check this Planner day." },
    };
  }

  const normalizedTitle = normalizeTitle(reservation.title);
  const isDuplicate = (sameDayItems || []).some((item) => (
    normalizeTitle(item.title) === normalizedTitle
    && (!start.time || item.start_time?.slice(0, 5) === start.time)
  ));

  if (isDuplicate) {
    return {
      data: null,
      error: {
        code: "INVALID_RECORD",
        message: "This reservation already looks like it is in the planner.",
      },
    };
  }

  return createPlannerItem({
    tripId: input.tripId,
    title: reservation.title,
    description: buildPlannerDescription(reservation),
    date: start.date,
    startTime: start.time,
    endTime: end?.date === start.date ? end.time : undefined,
    type: plannerTypeFromReservation(reservation.type),
    status: "planned",
  });
}
