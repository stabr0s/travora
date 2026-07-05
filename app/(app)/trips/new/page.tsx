import { NewTripScreen } from "@/features/trips";
import { getTripsAuthState } from "@/features/trips/services/trips-service";

export default async function NewTripPage() {
  const authState = await getTripsAuthState();

  return <NewTripScreen isSignedIn={Boolean(authState.data)} />;
}
