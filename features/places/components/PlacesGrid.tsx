import { MapPinOff, Plus } from "lucide-react";

import { Button, EmptyState } from "@/components/ui";
import { AddPlaceCard } from "@/features/places/components/AddPlaceCard";
import { PlaceCard } from "@/features/places/components/PlaceCard";
import type { Place, PlaceStatus } from "@/features/places/types/place";

type PlacesGridProps = {
  places: Place[];
  onAddPlace?: () => void;
  isPending?: boolean;
  onDeletePlace?: (place: Place) => void;
  onEditPlace?: (place: Place) => void;
  onStatusChange?: (place: Place, status: PlaceStatus) => void;
  onAddToPlan?: (place: Place) => void;
  plannedPlaceLabels?: Map<string, string>;
};

export function PlacesGrid({
  places,
  onAddPlace,
  isPending,
  onDeletePlace,
  onEditPlace,
  onStatusChange,
  onAddToPlan,
  plannedPlaceLabels,
}: PlacesGridProps) {
  return (
    <section className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          isPending={isPending}
          onDelete={onDeletePlace}
          onEdit={onEditPlace}
          onStatusChange={onStatusChange}
          onAddToPlan={onAddToPlan}
          plannedLabel={plannedPlaceLabels?.get(place.id)}
        />
      ))}

      {places.length === 0 ? (
        <EmptyState
          icon={MapPinOff}
          title="No places in this view"
          description="Places keep restaurants, sights, hotels, and ideas in one list. Add the first place or try another filter."
          className="min-h-72 md:col-span-2"
          action={onAddPlace ? (
            <Button size="md" onClick={onAddPlace}>
              <Plus className="size-4" />
              Add place
            </Button>
          ) : undefined}
        />
      ) : null}

      {onAddPlace ? <AddPlaceCard onClick={onAddPlace} /> : null}
    </section>
  );
}
