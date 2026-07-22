"use client";

import { useMemo, useState, useTransition } from "react";

import { Card } from "@/components/ui";
import {
  deletePlaceAction,
  updatePlaceStatusAction,
} from "@/features/places/actions/place-actions";
import { AddPlaceToPlanPanel } from "@/features/places/components/AddPlaceToPlanPanel";
import { AddPlacePanel } from "@/features/places/components/AddPlacePanel";
import { PlacesFilters } from "@/features/places/components/PlacesFilters";
import { PlacesGrid } from "@/features/places/components/PlacesGrid";
import { PlacesHeader } from "@/features/places/components/PlacesHeader";
import { PlacesStats } from "@/features/places/components/PlacesStats";
import { getMockPlacesByTripId } from "@/features/places/data/mock-places";
import { mapPersistedPlaceToPlace } from "@/features/places/data/place-mappers";
import { useScrollIntoViewOnOpen } from "@/hooks/useScrollIntoViewOnOpen";
import type {
  CreatePlaceActionState,
  PersistedPlace,
} from "@/features/places/types/persisted-place";
import type { Place, PlaceFilter, PlaceStatus } from "@/features/places/types/place";
import type { PersistedPlannerItem } from "@/features/planner/types/persisted-planner";

type PlacesSectionProps = {
  tripId: string;
  places?: PersistedPlace[];
  mode?: "mock" | "persisted";
  loadError?: string;
  canEditTrip?: boolean;
  defaultCountry?: string;
  plannerItems?: PersistedPlannerItem[];
  tripStartDate?: string | null;
  tripEndDate?: string | null;
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

function formatPlanDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function PlacesSection({
  tripId,
  places = [],
  mode = "mock",
  loadError,
  canEditTrip = true,
  defaultCountry,
  plannerItems = [],
  tripStartDate,
  tripEndDate,
}: PlacesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<PlaceFilter>("all");
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<PersistedPlace | null>(null);
  const [planningPlace, setPlanningPlace] = useState<PersistedPlace | null>(null);
  const [message, setMessage] = useState<CreatePlaceActionState | null>(null);
  const [isPending, startTransition] = useTransition();
  const panelRef = useScrollIntoViewOnOpen<HTMLDivElement>(isAddPanelOpen || Boolean(planningPlace));
  const canMutate = mode === "mock" || canEditTrip;
  const tripPlaces = useMemo(
    () => mode === "persisted" ? places.map(mapPersistedPlaceToPlace) : getMockPlacesByTripId(tripId),
    [mode, places, tripId],
  );
  const plannedPlaceLabels = useMemo(() => {
    const labels = new Map<string, string>();

    plannerItems.forEach((item) => {
      if (!item.place_id || labels.has(item.place_id)) return;
      labels.set(item.place_id, item.date ? `Planned · ${formatPlanDate(item.date)}` : "Planned · unscheduled");
    });

    return labels;
  }, [plannerItems]);

  function openAddPanel() {
    setEditingPlace(null);
    setPlanningPlace(null);
    setIsAddPanelOpen(true);
  }

  function handleEdit(place: Place) {
    setEditingPlace(places.find((persisted) => persisted.id === place.id) || null);
    setPlanningPlace(null);
    setIsAddPanelOpen(true);
  }

  function handleAddToPlan(place: Place) {
    const persistedPlace = places.find((savedPlace) => savedPlace.id === place.id);
    if (!persistedPlace) return;

    setIsAddPanelOpen(false);
    setEditingPlace(null);
    setPlanningPlace(persistedPlace);
  }

  function handleDelete(place: Place) {
    if (!window.confirm(`Delete “${place.name}”? This cannot be undone.`)) return;
    startTransition(async () => setMessage(await deletePlaceAction(tripId, place.id)));
  }

  function handleStatusChange(place: Place, status: PlaceStatus) {
    startTransition(async () => setMessage(await updatePlaceStatusAction(tripId, place.id, status)));
  }

  const filteredPlaces = useMemo(
    () => filterPlaces(tripPlaces, activeFilter),
    [activeFilter, tripPlaces],
  );

  return (
    <section className="space-y-6">
      <PlacesHeader onAddPlace={canMutate ? openAddPanel : undefined} />

      {isAddPanelOpen && canMutate ? (
        <div ref={panelRef}>
          <AddPlacePanel
            key={editingPlace?.id || "new"}
            tripId={tripId}
            mode={mode}
            place={editingPlace}
            defaultCountry={defaultCountry}
            onClose={() => setIsAddPanelOpen(false)}
          />
        </div>
      ) : null}

      {planningPlace && mode === "persisted" && canEditTrip ? (
        <div ref={panelRef}>
          <AddPlaceToPlanPanel
            tripId={tripId}
            place={planningPlace}
            tripStartDate={tripStartDate}
            tripEndDate={tripEndDate}
            onClose={() => setPlanningPlace(null)}
          />
        </div>
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
            onStatusChange={mode === "persisted" && canEditTrip ? handleStatusChange : undefined}
            onAddToPlan={mode === "persisted" && canEditTrip ? handleAddToPlan : undefined}
            plannedPlaceLabels={mode === "persisted" ? plannedPlaceLabels : undefined}
          />
        </>
      )}
    </section>
  );
}
