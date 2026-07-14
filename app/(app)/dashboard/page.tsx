import { redirect } from "next/navigation";

import { DashboardScreen } from "@/features/dashboard";
import { mapPersistedTripCardsToDashboard } from "@/features/dashboard/data/dashboard-mappers";
import { getTripCardsForCurrentUser } from "@/features/trips/services/trips-service";

export default async function DashboardPage() {
  const result = await getTripCardsForCurrentUser();

  if (result.data) {
    return <DashboardScreen data={mapPersistedTripCardsToDashboard(result.data)} />;
  }

  if (result.error?.code === "AUTH_REQUIRED") {
    redirect("/trips/japan-2027");
  }

  return <DashboardScreen />;
}
