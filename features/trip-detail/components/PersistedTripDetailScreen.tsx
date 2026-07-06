"use client";

import { useState } from "react";
import { Construction } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { PersistedBudgetSection } from "@/features/budget";
import type { PersistedBudgetExpense } from "@/features/budget/types/persisted-budget";
import { PersistedPackingSection } from "@/features/packing";
import type { PersistedPackingItem } from "@/features/packing/types/persisted-packing";
import { PlacesSection } from "@/features/places";
import type { PersistedPlace } from "@/features/places/types/persisted-place";
import { PersistedPlannerSection } from "@/features/planner";
import type { PersistedPlannerItem } from "@/features/planner/types/persisted-planner";
import { PersistedReservationsSection } from "@/features/reservations";
import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";
import { PersistedTripHero } from "@/features/trip-detail/components/PersistedTripHero";
import { PersistedTripOverview } from "@/features/trip-detail/components/PersistedTripOverview";
import { TripTabs } from "@/features/trip-detail/components/TripTabs";
import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";
import type { PersistedTrip } from "@/features/trips/types/persisted-trip";

type PersistedTripDetailScreenProps = {
  trip: PersistedTrip;
  places: PersistedPlace[];
  placesError?: string;
  plannerItems: PersistedPlannerItem[];
  plannerError?: string;
  reservations: PersistedReservation[];
  reservationsError?: string;
  budgetExpenses: PersistedBudgetExpense[];
  budgetError?: string;
  packingItems: PersistedPackingItem[];
  packingError?: string;
};

const moduleNames: Record<Exclude<TripDetailTabId, "overview" | "places" | "plan" | "reservations" | "budget" | "packing">, string> = {
  map: "Map",
  participants: "Participants",
};

export function PersistedTripDetailScreen({
  trip,
  places,
  placesError,
  plannerItems,
  plannerError,
  reservations,
  reservationsError,
  budgetExpenses,
  budgetError,
  packingItems,
  packingError,
}: PersistedTripDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<TripDetailTabId>("overview");

  return (
    <div className="space-y-6">
      <PersistedTripHero trip={trip} />
      <TripTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "overview" ? (
        <PersistedTripOverview />
      ) : activeTab === "places" ? (
        <PlacesSection
          tripId={trip.id}
          places={places}
          mode="persisted"
          loadError={placesError}
        />
      ) : activeTab === "plan" ? (
        <PersistedPlannerSection
          tripId={trip.id}
          items={plannerItems}
          loadError={plannerError}
        />
      ) : activeTab === "reservations" ? (
        <PersistedReservationsSection
          tripId={trip.id}
          reservations={reservations}
          loadError={reservationsError}
        />
      ) : activeTab === "budget" ? (
        <PersistedBudgetSection
          tripId={trip.id}
          expenses={budgetExpenses}
          loadError={budgetError}
        />
      ) : activeTab === "packing" ? (
        <PersistedPackingSection
          tripId={trip.id}
          items={packingItems}
          loadError={packingError}
        />
      ) : (
        <EmptyState
          icon={Construction}
          title={`${moduleNames[activeTab]} will be connected next`}
          description="This saved trip currently supports Overview, Places, Plan, Reservations, Budget, and Packing. The remaining modules will be connected in later tasks."
          className="min-h-80"
        />
      )}
    </div>
  );
}
