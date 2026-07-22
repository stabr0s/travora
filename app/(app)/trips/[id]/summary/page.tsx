import { FileText } from "lucide-react";

import { EmptyState } from "@/components/ui";
import {
  getPackingItemsForTrip,
  getPackingItemStatesForCurrentUser,
} from "@/features/packing/services/packing-service";
import { getPlacesForTrip } from "@/features/places/services/places-service";
import { getPlannerItemsForTrip } from "@/features/planner/services/planner-service";
import {
  buildMockSummary,
  buildPersistedSummary,
} from "@/features/trip-summary/data/trip-summary-builders";
import { getImportantInfoForTrip } from "@/features/trip-detail/services/important-info-service";
import { TripSummaryScreen } from "@/features/trip-summary";
import { getTravelLinksForTrip } from "@/features/travel-links/services/travel-links-service";
import { getTripById } from "@/features/trips/services/trips-service";
import { isUuid } from "@/lib/validation/is-uuid";

type TripSummaryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TripSummaryPage({ params }: TripSummaryPageProps) {
  const { id } = await params;
  const mockSummary = buildMockSummary(id);

  if (mockSummary) {
    return <TripSummaryScreen tripId={id} summary={mockSummary} />;
  }

  if (!isUuid(id)) {
    return (
      <EmptyState
        icon={FileText}
        title="Summary unavailable"
        description="This trip summary is not available."
      />
    );
  }

  const trip = await getTripById(id);
  if (!trip.data) {
    return (
      <EmptyState
        icon={FileText}
        title="Summary unavailable"
        description="Sign in with trip access to view this summary."
      />
    );
  }

  const [
    places,
    planner,
    packing,
    packingStates,
    importantInfo,
    travelLinks,
  ] = await Promise.all([
    getPlacesForTrip(id),
    getPlannerItemsForTrip(id),
    getPackingItemsForTrip(id),
    getPackingItemStatesForCurrentUser(id),
    getImportantInfoForTrip(id),
    getTravelLinksForTrip(id),
  ]);

  return (
    <TripSummaryScreen
      tripId={id}
      summary={buildPersistedSummary({
        trip: trip.data,
        places: places.data || [],
        planner: planner.data || [],
        packing: packing.data || [],
        packingStates: packingStates.data || [],
        importantInfo: importantInfo.data,
        travelLinks: travelLinks.data || [],
      })}
    />
  );
}
