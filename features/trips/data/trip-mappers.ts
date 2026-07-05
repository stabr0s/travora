import type { PersistedTrip } from "@/features/trips/types/persisted-trip";
import type { Trip, TripStatus } from "@/features/trips/types/trip";

const coverGradients = [
  "from-sky-600 via-cyan-500 to-emerald-300",
  "from-indigo-700 via-violet-500 to-rose-300",
  "from-amber-500 via-orange-400 to-rose-300",
  "from-slate-800 via-blue-700 to-cyan-400",
];

function normalizeStatus(status: PersistedTrip["status"]): TripStatus {
  return status === "upcoming" || status === "archived" ? status : "planning";
}

export function mapPersistedTripToTrip(trip: PersistedTrip): Trip {
  const gradientIndex = Array.from(trip.id).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  ) % coverGradients.length;

  return {
    id: trip.id,
    title: trip.title,
    country: trip.destination || "Destination not set",
    startDate: trip.start_date,
    endDate: trip.end_date,
    participants: null,
    placesCount: null,
    costPerPerson: null,
    currency: trip.currency || "EUR",
    progress: null,
    status: normalizeStatus(trip.status),
    coverGradient: coverGradients[gradientIndex],
  };
}
