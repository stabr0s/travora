"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { PersistedBudgetSection } from "@/features/budget";
import type { PersistedBudgetExpense } from "@/features/budget/types/persisted-budget";
import { PersistedPackingSection } from "@/features/packing";
import type { PackingPresetWithItems } from "@/features/packing/types/packing-preset";
import type { PersistedPackingItem, PersistedPackingItemState } from "@/features/packing/types/persisted-packing";
import type { PersistedTripInvite } from "@/features/invites/types/trip-invite";
import { PersistedParticipantsSection } from "@/features/participants";
import type { PersistedParticipant } from "@/features/participants/types/persisted-participant";
import type { ParticipantRole } from "@/features/participants/types/participant";
import { PlacesSection } from "@/features/places";
import type { PersistedPlace } from "@/features/places/types/persisted-place";
import { PersistedPlannerSection } from "@/features/planner";
import type { PersistedPlannerItem } from "@/features/planner/types/persisted-planner";
import { PersistedReservationsSection } from "@/features/reservations";
import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";
import { PersistedTripSettingsSection } from "@/features/trips/components/PersistedTripSettingsSection";
import { PersistedTripHero } from "@/features/trip-detail/components/PersistedTripHero";
import { PersistedTripOverview } from "@/features/trip-detail/components/PersistedTripOverview";
import { TripTabs } from "@/features/trip-detail/components/TripTabs";
import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";
import type { PersistedTrip } from "@/features/trips/types/persisted-trip";

type PersistedTripDetailScreenProps = {
  trip: PersistedTrip;
  initialTab?: TripDetailTabId;
  places: PersistedPlace[];
  placesError?: string;
  plannerItems: PersistedPlannerItem[];
  plannerError?: string;
  reservations: PersistedReservation[];
  reservationsError?: string;
  budgetExpenses: PersistedBudgetExpense[];
  budgetError?: string;
  packingItems: PersistedPackingItem[];
  packingItemStates: PersistedPackingItemState[];
  packingPresets: PackingPresetWithItems[];
  packingError?: string;
  participants: PersistedParticipant[];
  invites: PersistedTripInvite[];
  currentUserRole: ParticipantRole | null;
  participantsError?: string;
};

export function PersistedTripDetailScreen({
  trip,
  initialTab = "overview",
  places,
  placesError,
  plannerItems,
  plannerError,
  reservations,
  reservationsError,
  budgetExpenses,
  budgetError,
  packingItems,
  packingItemStates,
  packingPresets,
  packingError,
  participants,
  invites,
  currentUserRole,
  participantsError,
}: PersistedTripDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<TripDetailTabId>(initialTab);
  const canEditTrip = currentUserRole === "owner" || currentUserRole === "editor";
  const canTogglePackingState = currentUserRole === "owner"
    || currentUserRole === "editor"
    || currentUserRole === "viewer";
  const canManageParticipants = currentUserRole === "owner";
  const canManageSettings = currentUserRole === "owner";

  return (
    <div className="space-y-6">
      <PersistedTripHero trip={trip} />
      {!canEditTrip ? (
        <Card padding="sm" className="text-sm text-muted">
          You have view-only access to trip content. You can still update your own packing progress.
        </Card>
      ) : null}
      <TripTabs activeTab={activeTab} onTabChange={setActiveTab} showSettings />
      {activeTab === "overview" ? (
        <PersistedTripOverview />
      ) : activeTab === "places" ? (
        <PlacesSection
          tripId={trip.id}
          places={places}
          mode="persisted"
          loadError={placesError}
          canEditTrip={canEditTrip}
          defaultCountry={trip.destination || undefined}
        />
      ) : activeTab === "plan" ? (
        <PersistedPlannerSection
          tripId={trip.id}
          items={plannerItems}
          places={places}
          loadError={plannerError}
          canEditTrip={canEditTrip}
        />
      ) : activeTab === "reservations" ? (
        <PersistedReservationsSection
          tripId={trip.id}
          reservations={reservations}
          tripCurrency={trip.currency || undefined}
          loadError={reservationsError}
          canEditTrip={canEditTrip}
        />
      ) : activeTab === "budget" ? (
        <PersistedBudgetSection
          tripId={trip.id}
          expenses={budgetExpenses}
          tripCurrency={trip.currency || undefined}
          loadError={budgetError}
          canEditTrip={canEditTrip}
        />
      ) : activeTab === "packing" ? (
        <PersistedPackingSection
          tripId={trip.id}
          items={packingItems}
          itemStates={packingItemStates}
          customPresets={packingPresets}
          loadError={packingError}
          canEditTrip={canEditTrip}
          canTogglePersonalState={canTogglePackingState}
        />
      ) : activeTab === "participants" ? (
        <PersistedParticipantsSection
          tripId={trip.id}
          participants={participants}
          invites={invites}
          canManageParticipants={canManageParticipants}
          loadError={participantsError}
        />
      ) : activeTab === "settings" ? (
        <PersistedTripSettingsSection
          trip={trip}
          canManageSettings={canManageSettings}
          canDuplicateTrip={canEditTrip}
        />
      ) : null}
    </div>
  );
}
