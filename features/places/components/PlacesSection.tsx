"use client";

import { useMemo, useState } from "react";

import { AddPlacePanel } from "@/features/places/components/AddPlacePanel";
import { PlacesFilters } from "@/features/places/components/PlacesFilters";
import { PlacesGrid } from "@/features/places/components/PlacesGrid";
import { PlacesHeader } from "@/features/places/components/PlacesHeader";
import { PlacesStats } from "@/features/places/components/PlacesStats";
import { getMockPlacesByTripId } from "@/features/places/data/mock-places";
import type { Place, PlaceFilter } from "@/features/places/types/place";

type PlacesSectionProps = {
  tripId: string;
};

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

export function PlacesSection({ tripId }: PlacesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<PlaceFilter>("all");
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const tripPlaces = useMemo(() => getMockPlacesByTripId(tripId), [tripId]);
  const filteredPlaces = useMemo(
    () => filterPlaces(tripPlaces, activeFilter),
    [activeFilter, tripPlaces],
  );

  return (
    <section className="space-y-6">
      <PlacesHeader onAddPlace={() => setIsAddPanelOpen(true)} />

      {isAddPanelOpen ? (
        <AddPlacePanel onClose={() => setIsAddPanelOpen(false)} />
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
