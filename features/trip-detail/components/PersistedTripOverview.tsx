import type { PersistedBudgetExpense } from "@/features/budget/types/persisted-budget";
import type {
  PersistedPackingItem,
  PersistedPackingItemState,
} from "@/features/packing/types/persisted-packing";
import type { PersistedPlannerItem } from "@/features/planner/types/persisted-planner";
import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";
import { PersistedImportantInfoCard } from "@/features/trip-detail/components/PersistedImportantInfoCard";
import { TripOverviewQuickActions } from "@/features/trip-detail/components/TripOverviewQuickActions";
import { TripOverviewStatusGrid } from "@/features/trip-detail/components/TripOverviewStatusGrid";
import { TripOverviewUpcoming } from "@/features/trip-detail/components/TripOverviewUpcoming";
import type { TripImportantInfo } from "@/features/trip-detail/types/important-info";
import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";
import {
  countPersonallyPackedItems,
  countUnassignedExpenses,
  getBudgetCurrencyTotals,
  getNextPlannerItems,
  getUpcomingReservations,
} from "@/features/trip-detail/utils/trip-overview-summary";
import { TravelLinksCard } from "@/features/travel-links";
import type { PersistedTravelLink } from "@/features/travel-links/types/travel-link";

type PersistedTripOverviewProps = {
  tripId: string;
  plannerItems: PersistedPlannerItem[];
  plannerError?: string;
  reservations: PersistedReservation[];
  reservationsError?: string;
  budgetExpenses: PersistedBudgetExpense[];
  budgetError?: string;
  packingItems: PersistedPackingItem[];
  packingItemStates: PersistedPackingItemState[];
  packingError?: string;
  importantInfo: TripImportantInfo | null;
  importantInfoError?: string;
  travelLinks: PersistedTravelLink[];
  travelLinksError?: string;
  canEditTrip: boolean;
  isOwner: boolean;
  publicShareEnabled: boolean;
  publicSharePath?: string;
  onNavigate: (tab: TripDetailTabId) => void;
};

export function PersistedTripOverview({
  tripId,
  plannerItems,
  plannerError,
  reservations,
  reservationsError,
  budgetExpenses,
  budgetError,
  packingItems,
  packingItemStates,
  packingError,
  importantInfo,
  importantInfoError,
  travelLinks,
  travelLinksError,
  canEditTrip,
  isOwner,
  publicShareEnabled,
  publicSharePath,
  onNavigate,
}: PersistedTripOverviewProps) {
  const nextPlannerItems = getNextPlannerItems(plannerItems);
  const upcomingReservations = getUpcomingReservations(reservations);
  const currencyTotals = getBudgetCurrencyTotals(budgetExpenses);
  const unassignedExpenseCount = countUnassignedExpenses(budgetExpenses);
  const packingItemIds = new Set(packingItems.map((item) => item.id));
  const packedCount = countPersonallyPackedItems(packingItemIds, packingItemStates);
  const hasImportantInfo = Boolean(importantInfo?.content?.trim());

  return (
    <div className="space-y-4">
      <TripOverviewQuickActions
        canEditTrip={canEditTrip}
        isOwner={isOwner}
        publicSharePath={publicSharePath}
        onNavigate={onNavigate}
      />
      <TripOverviewUpcoming
        plannerItems={nextPlannerItems}
        reservations={upcomingReservations}
        plannerError={plannerError}
        reservationsError={reservationsError}
        onNavigate={onNavigate}
      />
      <TripOverviewStatusGrid
        currencyTotals={currencyTotals}
        expenseCount={budgetExpenses.length}
        unassignedExpenseCount={unassignedExpenseCount}
        budgetError={budgetError}
        packingTotal={packingItems.length}
        packedCount={packedCount}
        packingError={packingError}
        hasImportantInfo={hasImportantInfo}
        importantInfoError={importantInfoError}
        publicShareEnabled={publicShareEnabled}
      />
      <div id="trip-important-info" className="scroll-mt-6">
        <PersistedImportantInfoCard
          tripId={tripId}
          importantInfo={importantInfo}
          loadError={importantInfoError}
          canEditTrip={canEditTrip}
        />
      </div>
      <TravelLinksCard
        tripId={tripId}
        links={travelLinks}
        loadError={travelLinksError}
        canEditTrip={canEditTrip}
      />
    </div>
  );
}
