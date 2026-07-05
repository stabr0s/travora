import { MapPinOff, Plus } from "lucide-react";

import { Button, EmptyState } from "@/components/ui";
import { AddPlaceCard } from "@/features/places/components/AddPlaceCard";
import { PlaceCard } from "@/features/places/components/PlaceCard";
import type { Place } from "@/features/places/types/place";

type PlacesGridProps = {
  places: Place[];
  onAddPlace: () => void;
};

export function PlacesGrid({ places, onAddPlace }: PlacesGridProps) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}

      {places.length === 0 ? (
        <EmptyState
          icon={MapPinOff}
          title="No places in this view"
          description="Try another filter or add the first place you want to remember."
          className="min-h-[24rem] md:col-span-2"
          action={
            <Button size="md" onClick={onAddPlace}>
              <Plus className="size-4" />
              Add place
            </Button>
          }
        />
      ) : null}

      <AddPlaceCard onClick={onAddPlace} />
    </section>
  );
}
