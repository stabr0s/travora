import { redirect } from "next/navigation";

import { TripsScreen } from "@/features/trips";
import { mockTrips } from "@/features/trips/data/mock-trips";
import { mapPersistedTripToTrip } from "@/features/trips/data/trip-mappers";
import { getTripCardsForCurrentUser } from "@/features/trips/services/trips-service";

export default async function TripsPage() {
  const result = await getTripCardsForCurrentUser();

  if (result.data) {
    return (
      <TripsScreen
        trips={result.data.map((card) => mapPersistedTripToTrip(card.trip, card.role))}
        mode="saved"
      />
    );
  }

  if (result.error.code === "AUTH_REQUIRED") {
    redirect("/trips/japan-2027");
  }

  return (
    <TripsScreen
      trips={mockTrips.map((trip) => ({ ...trip, isDemo: true }))}
      mode="fallback"
    />
  );
}
