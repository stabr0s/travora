import { TripsScreen } from "@/features/trips";
import { mockTrips } from "@/features/trips/data/mock-trips";
import { mapPersistedTripToTrip } from "@/features/trips/data/trip-mappers";
import { getCurrentUserTrips } from "@/features/trips/services/trips-service";

export default async function TripsPage() {
  const result = await getCurrentUserTrips();

  if (result.data) {
    return (
      <TripsScreen
        trips={result.data.map(mapPersistedTripToTrip)}
        mode="saved"
      />
    );
  }

  return (
    <TripsScreen
      trips={mockTrips}
      mode={result.error.code === "AUTH_REQUIRED" ? "demo" : "fallback"}
    />
  );
}
