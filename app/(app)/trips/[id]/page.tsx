import {
  getMockTripDetail,
  PersistedTripDetailScreen,
  TripDetailScreen,
} from "@/features/trip-detail";
import { getBudgetExpensesForTrip } from "@/features/budget/services/budget-service";
import { getTripInvitesForTrip } from "@/features/invites/services/trip-invites-service";
import { getPackingPresetsForCurrentUser } from "@/features/packing/services/packing-preset-service";
import {
  getPackingItemsForTrip,
  getPackingItemStatesForCurrentUser,
} from "@/features/packing/services/packing-service";
import {
  getCurrentUserTripAccess,
  getParticipantsForTrip,
} from "@/features/participants/services/participants-service";
import { getPlacesForTrip } from "@/features/places/services/places-service";
import { getPlannerItemsForTrip } from "@/features/planner/services/planner-service";
import { getReservationsForTrip } from "@/features/reservations/services/reservations-service";
import { getImportantInfoForTrip } from "@/features/trip-detail/services/important-info-service";
import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";
import { getTripById } from "@/features/trips/services/trips-service";
import { isUuid } from "@/lib/validation/is-uuid";

type TripDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: string | string[] }>;
};

const persistedTabs: TripDetailTabId[] = [
  "overview",
  "places",
  "plan",
  "reservations",
  "budget",
  "packing",
  "participants",
  "settings",
];

function readInitialTab(value: string | string[] | undefined): TripDetailTabId {
  const tab = Array.isArray(value) ? value[0] : value;
  return persistedTabs.includes(tab as TripDetailTabId)
    ? tab as TripDetailTabId
    : "overview";
}

export default async function TripDetailPage({ params, searchParams }: TripDetailPageProps) {
  const { id } = await params;
  const query = searchParams ? await searchParams : undefined;

  if (getMockTripDetail(id)) {
    return <TripDetailScreen tripId={id} />;
  }

  if (!isUuid(id)) {
    return <TripDetailScreen tripId={id} />;
  }

  const persistedTrip = await getTripById(id);

  if (persistedTrip.data) {
    const [
      persistedPlaces,
      persistedPlanner,
      persistedReservations,
      persistedBudget,
      persistedPacking,
      persistedPackingStates,
      persistedPackingPresets,
      persistedParticipants,
      persistedAccess,
      persistedImportantInfo,
    ] = await Promise.all([
      getPlacesForTrip(id),
      getPlannerItemsForTrip(id),
      getReservationsForTrip(id),
      getBudgetExpensesForTrip(id),
      getPackingItemsForTrip(id),
      getPackingItemStatesForCurrentUser(id),
      getPackingPresetsForCurrentUser(),
      getParticipantsForTrip(id),
      getCurrentUserTripAccess(id),
      getImportantInfoForTrip(id),
    ]);
    const persistedInvites = persistedAccess.data?.role === "owner"
      ? await getTripInvitesForTrip(id)
      : { data: [], error: null };

    return (
      <PersistedTripDetailScreen
        trip={persistedTrip.data}
        initialTab={readInitialTab(query?.tab)}
        places={persistedPlaces.data || []}
        placesError={persistedPlaces.error?.message}
        plannerItems={persistedPlanner.data || []}
        plannerError={persistedPlanner.error?.message}
        reservations={persistedReservations.data || []}
        reservationsError={persistedReservations.error?.message}
        budgetExpenses={persistedBudget.data || []}
        budgetError={persistedBudget.error?.message}
        currentUserId={persistedAccess.data?.userId || null}
        packingItems={persistedPacking.data || []}
        packingItemStates={persistedPackingStates.data || []}
        packingPresets={persistedPackingPresets.data || []}
        packingError={persistedPacking.error?.message || persistedPackingStates.error?.message}
        participants={persistedParticipants.data || []}
        invites={persistedInvites.data || []}
        currentUserRole={persistedAccess.data?.role || null}
        participantsError={persistedParticipants.error?.message || persistedAccess.error?.message || persistedInvites.error?.message}
        importantInfo={persistedImportantInfo.data}
        importantInfoError={persistedImportantInfo.error?.message}
      />
    );
  }

  return <TripDetailScreen tripId={id} />;
}
