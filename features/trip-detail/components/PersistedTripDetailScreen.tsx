"use client";

import { useState } from "react";
import { PersistedBudgetSection } from "@/features/budget";
import { PersistedMapSection } from "@/features/map";
import type { PersistedBudgetExpense } from "@/features/budget/types/persisted-budget";
import { PersistedPackingSection } from "@/features/packing";
import type { PersistedPackingItem } from "@/features/packing/types/persisted-packing";
import { PersistedParticipantsSection } from "@/features/participants";
import type { PersistedParticipant } from "@/features/participants/types/persisted-participant";
import type { ParticipantRole } from "@/features/participants/types/participant";
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
  participants: PersistedParticipant[];
  currentUserRole: ParticipantRole | null;
  participantsError?: string;
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
  participants,
  currentUserRole,
  participantsError,
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
      ) : activeTab === "map" ? (
        <PersistedMapSection places={places} loadError={placesError} />
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
      ) : activeTab === "participants" ? (
        <PersistedParticipantsSection
          tripId={trip.id}
          participants={participants}
          currentUserRole={currentUserRole}
          loadError={participantsError}
        />
      ) : null}
    </div>
  );
}
