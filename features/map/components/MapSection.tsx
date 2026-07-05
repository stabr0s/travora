"use client";

import { useMemo, useState } from "react";
import { MapPinOff } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { MapCanvasPlaceholder } from "@/features/map/components/MapCanvasPlaceholder";
import { MapFilters } from "@/features/map/components/MapFilters";
import { MapHeader } from "@/features/map/components/MapHeader";
import { MapPlacesList } from "@/features/map/components/MapPlacesList";
import { MapStats } from "@/features/map/components/MapStats";
import { RouteSummaryCard } from "@/features/map/components/RouteSummaryCard";
import { getMockMapByTripId } from "@/features/map/data/mock-map";
import type { MapFilter, MapItem } from "@/features/map/types/map";

type MapSectionProps = {
  tripId: string;
};

function filterItems(items: MapItem[], filter: MapFilter): MapItem[] {
  switch (filter) {
    case "planned":
      return items.filter((item) => item.status === "planned");
    case "must-see":
      return items.filter((item) => item.priority === "must-see");
    case "hotels":
      return items.filter((item) => item.category === "hotel");
    case "restaurants":
      return items.filter((item) => item.category === "restaurant");
    default:
      return items;
  }
}

export function MapSection({ tripId }: MapSectionProps) {
  const [activeFilter, setActiveFilter] = useState<MapFilter>("all");
  const mapData = getMockMapByTripId(tripId);
  const filteredItems = useMemo(
    () => filterItems(mapData?.items ?? [], activeFilter),
    [activeFilter, mapData],
  );

  if (!mapData || mapData.items.length === 0) {
    return (
      <section className="space-y-6">
        <MapHeader />
        <EmptyState
          icon={MapPinOff}
          title="No map points yet"
          description="Places with coordinates will appear here once this trip has map data."
          className="min-h-96"
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <MapHeader />
      <MapStats items={mapData.items} route={mapData.route} />
      <RouteSummaryCard
        route={mapData.route}
        pointsCount={mapData.items.length}
      />
      <MapFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <MapCanvasPlaceholder items={filteredItems} />
        </div>
        <div className="xl:col-span-2">
          <MapPlacesList items={filteredItems} />
        </div>
      </div>
    </section>
  );
}
