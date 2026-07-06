import { Construction, MapPinCheck, MapPinOff, MapPinned } from "lucide-react";

import { Badge, Card, EmptyState, SectionHeader } from "@/components/ui";
import { PersistedMapPlacesList } from "@/features/map/components/PersistedMapPlacesList";
import type { PersistedPlace } from "@/features/places/types/persisted-place";

type PersistedMapSectionProps = {
  places: PersistedPlace[];
  loadError?: string;
};

function hasCoordinates(place: PersistedPlace) {
  return place.latitude !== null && place.longitude !== null;
}

function sortMapPlaces(places: PersistedPlace[]) {
  return [...places].sort((first, second) => {
    if (first.map_order != null || second.map_order != null) {
      if (first.map_order == null) return 1;
      if (second.map_order == null) return -1;
      if (first.map_order !== second.map_order) return first.map_order - second.map_order;
    }

    const titleOrder = first.title.localeCompare(second.title, "en", { sensitivity: "base" });
    if (titleOrder !== 0) return titleOrder;
    return (first.created_at || "").localeCompare(second.created_at || "");
  });
}

export function PersistedMapSection({ places, loadError }: PersistedMapSectionProps) {
  const sortedPlaces = sortMapPlaces(places);
  const mapReadyPlaces = sortedPlaces.filter(hasCoordinates);
  const missingCoordinatePlaces = sortedPlaces.filter((place) => !hasCoordinates(place));
  const stats = [
    { label: "Total places", value: places.length, icon: MapPinned },
    { label: "With coordinates", value: mapReadyPlaces.length, icon: MapPinCheck },
    { label: "Missing coordinates", value: missingCoordinatePlaces.length, icon: MapPinOff },
  ];

  return (
    <section className="space-y-6">
      <SectionHeader
        title="Map"
        description="Prepare saved places for a future interactive map. Coordinates and map order come directly from Places."
        className="mb-0"
        action={<Badge variant="default">Data foundation</Badge>}
      />

      {loadError ? (
        <Card padding="sm" className="text-sm text-error">{loadError}</Card>
      ) : places.length === 0 ? (
        <EmptyState
          icon={MapPinned}
          title="No places to map yet"
          description="Add a place in the Places tab. Coordinates are optional and can be added now or later."
          className="min-h-80"
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3" aria-label="Map data statistics">
            {stats.map(({ label, value, icon: Icon }) => (
              <Card key={label} padding="sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted">{label}</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary-subtle">
                    <Icon className="size-4 text-primary" strokeWidth={1.75} />
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <Card className="border-dashed bg-gradient-to-br from-primary-subtle/60 via-surface-elevated to-surface">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-background shadow-xs">
                <Construction className="size-5 text-primary" />
              </span>
              <div>
                <h2 className="font-semibold text-foreground">Interactive map rendering comes next</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  This view prepares coordinates and display order only. No map tiles, geocoding, routing, or distance calculations are active.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid items-start gap-6 xl:grid-cols-2">
            <PersistedMapPlacesList
              title="Map-ready places"
              description="Places with both latitude and longitude."
              places={mapReadyPlaces}
              kind="ready"
            />
            <PersistedMapPlacesList
              title="Missing coordinates"
              description="Saved places that still need map coordinates."
              places={missingCoordinatePlaces}
              kind="missing"
            />
          </div>
        </>
      )}
    </section>
  );
}
