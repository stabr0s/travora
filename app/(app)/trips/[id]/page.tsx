import {
  getMockTripDetail,
  PersistedTripDetailScreen,
  TripDetailScreen,
} from "@/features/trip-detail";
import { getBudgetExpensesForTrip } from "@/features/budget/services/budget-service";
import { mapPersistedPlaceToPlace } from "@/features/places/data/place-mappers";
import { getPlacesForTrip } from "@/features/places/services/places-service";
import { getPlannerItemsForTrip } from "@/features/planner/services/planner-service";
import { getReservationsForTrip } from "@/features/reservations/services/reservations-service";
import { getTripById } from "@/features/trips/services/trips-service";
import { isUuid } from "@/lib/validation/is-uuid";

type TripDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { id } = await params;

  if (getMockTripDetail(id)) {
    return <TripDetailScreen tripId={id} />;
  }

  if (!isUuid(id)) {
    return <TripDetailScreen tripId={id} />;
  }

  const persistedTrip = await getTripById(id);

  if (persistedTrip.data) {
    const [persistedPlaces, persistedPlanner, persistedReservations, persistedBudget] = await Promise.all([
      getPlacesForTrip(id),
      getPlannerItemsForTrip(id),
      getReservationsForTrip(id),
      getBudgetExpensesForTrip(id),
    ]);

    return (
      <PersistedTripDetailScreen
        trip={persistedTrip.data}
        places={(persistedPlaces.data || []).map(mapPersistedPlaceToPlace)}
        placesError={persistedPlaces.error?.message}
        plannerItems={persistedPlanner.data || []}
        plannerError={persistedPlanner.error?.message}
        reservations={persistedReservations.data || []}
        reservationsError={persistedReservations.error?.message}
        budgetExpenses={persistedBudget.data || []}
        budgetError={persistedBudget.error?.message}
      />
    );
  }

  return <TripDetailScreen tripId={id} />;
}
