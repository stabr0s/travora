"use client";

import { useMemo, useState, useTransition } from "react";

import { Card } from "@/components/ui";
import { deletePlaceAction } from "@/features/places/actions/place-actions";
import { AddPlacePanel } from "@/features/places/components/AddPlacePanel";
import { PlacesFilters } from "@/features/places/components/PlacesFilters";
import { PlacesGrid } from "@/features/places/components/PlacesGrid";
import { PlacesHeader } from "@/features/places/components/PlacesHeader";
import { PlacesStats } from "@/features/places/components/PlacesStats";
import { getMockPlacesByTripId } from "@/features/places/data/mock-places";
import { mapPersistedPlaceToPlace } from "@/features/places/data/place-mappers";
import type {
  CreatePlaceActionState,
  PersistedPlace,
} from "@/features/places/types/persisted-place";
import type { Place, PlaceFilter } from "@/features/places/types/place";

type PlacesSectionProps = {
  tripId: string;
  places?: PersistedPlace[];
  mode?: "mock" | "persisted";
  loadError?: string;
  canEditTrip?: boolean;
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

export function PlacesSection({
  tripId,
  places = [],
  mode = "mock",
  loadError,
  canEditTrip = true,
}: PlacesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<PlaceFilter>("all");
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<PersistedPlace | null>(null);
  const [message, setMessage] = useState<CreatePlaceActionState | null>(null);
  const [isPending, startTransition] = useTransition();
  const canMutate = mode === "mock" || canEditTrip;
  const tripPlaces = useMemo(
    () => mode === "persisted" ? places.map(mapPersistedPlaceToPlace) : getMockPlacesByTripId(tripId),
    [mode, places, tripId],
  );

  function openAddPanel() {
    setEditingPlace(null);
    setIsAddPanelOpen(true);
  }

  function handleEdit(place: Place) {
    setEditingPlace(places.find((persisted) => persisted.id === place.id) || null);
    setIsAddPanelOpen(true);
  }

  function handleDelete(place: Place) {
    if (!window.confirm(`Delete “${place.name}”? This cannot be undone.`)) return;
    startTransition(async () => setMessage(await deletePlaceAction(tripId, place.id)));
  }
  const filteredPlaces = useMemo(
    () => filterPlaces(tripPlaces, activeFilter),
    [activeFilter, tripPlaces],
  );

  return (
    <section className="space-y-6">
      <PlacesHeader onAddPlace={canMutate ? openAddPanel : undefined} />

      {isAddPanelOpen && canMutate ? (
        <AddPlacePanel
          key={editingPlace?.id || "new"}
          tripId={tripId}
          mode={mode}
          place={editingPlace}
          onClose={() => setIsAddPanelOpen(false)}
        />
      ) : null}

      {loadError ? (
        <Card padding="sm" className="text-sm text-error">{loadError}</Card>
      ) : (
        <>
          {message?.message ? <Card padding="sm" className={message.status === "error" ? "text-sm text-error" : "text-sm text-success"}>{message.message}</Card> : null}
          <PlacesStats places={tripPlaces} />
          <PlacesFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <PlacesGrid
            places={filteredPlaces}
            onAddPlace={canMutate ? openAddPanel : undefined}
            isPending={isPending}
            onEditPlace={mode === "persisted" && canEditTrip ? handleEdit : undefined}
            onDeletePlace={mode === "persisted" && canEditTrip ? handleDelete : undefined}
          />
        </>
      )}
    </section>
  );
}
