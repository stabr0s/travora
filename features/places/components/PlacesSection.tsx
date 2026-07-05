"use client";

import { useActionState, useMemo, useState } from "react";

import { Card } from "@/components/ui";
import { createPlaceAction } from "@/features/places/actions/place-actions";
import { AddPlacePanel } from "@/features/places/components/AddPlacePanel";
import { PlacesFilters } from "@/features/places/components/PlacesFilters";
import { PlacesGrid } from "@/features/places/components/PlacesGrid";
import { PlacesHeader } from "@/features/places/components/PlacesHeader";
import { PlacesStats } from "@/features/places/components/PlacesStats";
import { getMockPlacesByTripId } from "@/features/places/data/mock-places";
import type { CreatePlaceActionState } from "@/features/places/types/persisted-place";
import type { Place, PlaceFilter } from "@/features/places/types/place";

type PlacesSectionProps = {
  tripId: string;
  places?: Place[];
  mode?: "mock" | "persisted";
  loadError?: string;
};

const initialCreateState: CreatePlaceActionState = { status: "idle" };

function filterPlaces(places: Place[], filter: PlaceFilter): Place[] {
  switch (filter) {
    case "must-see":
      return places.filter((place) => place.priority === "must-see");
    case "planned":
      return places.filter((place) => place.status === "planned");
    case "idea":
      return places.filter((place) => place.status === "idea");
    case "visited":
      return places.filter((place) => place.status === "visited");
    default:
      return places;
  }
}

export function PlacesSection({
  tripId,
  places = [],
  mode = "mock",
  loadError,
}: PlacesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<PlaceFilter>("all");
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [createState, createAction, isPending] = useActionState(
    createPlaceAction,
    initialCreateState,
  );
  const tripPlaces = useMemo(
    () => mode === "persisted" ? places : getMockPlacesByTripId(tripId),
    [mode, places, tripId],
  );
  const filteredPlaces = useMemo(
    () => filterPlaces(tripPlaces, activeFilter),
    [activeFilter, tripPlaces],
  );

  return (
    <section className="space-y-6">
      <PlacesHeader onAddPlace={() => setIsAddPanelOpen(true)} />

      {isAddPanelOpen ? (
        <AddPlacePanel
          tripId={tripId}
          mode={mode}
          actionState={createState}
          formAction={createAction}
          isPending={isPending}
          onClose={() => setIsAddPanelOpen(false)}
        />
      ) : null}

      {loadError ? (
        <Card padding="sm" className="text-sm text-error">{loadError}</Card>
      ) : null}

      <PlacesStats places={tripPlaces} />
      <PlacesFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <PlacesGrid
        places={filteredPlaces}
        onAddPlace={() => setIsAddPanelOpen(true)}
      />
    </section>
  );
}
