import { FileText } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { getBudgetExpensesForTrip } from "@/features/budget/services/budget-service";
import {
  getPackingItemsForTrip,
  getPackingItemStatesForCurrentUser,
} from "@/features/packing/services/packing-service";
import { getParticipantsForTrip } from "@/features/participants/services/participants-service";
import { getPlacesForTrip } from "@/features/places/services/places-service";
import { getPlannerItemsForTrip } from "@/features/planner/services/planner-service";
import { getReservationsForTrip } from "@/features/reservations/services/reservations-service";
import {
  buildMockSummary,
  buildPersistedSummary,
} from "@/features/trip-summary/data/trip-summary-builders";
import { TripSummaryScreen } from "@/features/trip-summary";
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

  const [places, planner, reservations, budget, packing, packingStates, participants] = await Promise.all([
    getPlacesForTrip(id),
    getPlannerItemsForTrip(id),
    getReservationsForTrip(id),
    getBudgetExpensesForTrip(id),
    getPackingItemsForTrip(id),
    getPackingItemStatesForCurrentUser(id),
    getParticipantsForTrip(id),
  ]);

  return (
    <TripSummaryScreen
      tripId={id}
      summary={buildPersistedSummary({
        trip: trip.data,
        places: places.data || [],
        planner: planner.data || [],
        reservations: reservations.data || [],
        budget: budget.data || [],
        packing: packing.data || [],
        packingStates: packingStates.data || [],
        participants: participants.data || [],
      })}
    />
  );
}
