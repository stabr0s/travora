"use client";

import { useState } from "react";
import { Construction } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { PlacesSection } from "@/features/places";
import type { Place } from "@/features/places/types/place";
import { PersistedTripHero } from "@/features/trip-detail/components/PersistedTripHero";
import { PersistedTripOverview } from "@/features/trip-detail/components/PersistedTripOverview";
import { TripTabs } from "@/features/trip-detail/components/TripTabs";
import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";
import type { PersistedTrip } from "@/features/trips/types/persisted-trip";

type PersistedTripDetailScreenProps = {
  trip: PersistedTrip;
  places: Place[];
  placesError?: string;
};

const moduleNames: Record<Exclude<TripDetailTabId, "overview" | "places">, string> = {
  map: "Map",
  plan: "Plan",
  reservations: "Reservations",
  budget: "Budget",
  packing: "Packing",
  participants: "Participants",
};

export function PersistedTripDetailScreen({
  trip,
  places,
  placesError,
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
      ) : (
        <EmptyState
          icon={Construction}
          title={`${moduleNames[activeTab]} will be connected next`}
          description="This saved trip currently supports Overview and Places. The remaining modules still use the mock planning experience."
          className="min-h-80"
        />
      )}
    </div>
  );
}
