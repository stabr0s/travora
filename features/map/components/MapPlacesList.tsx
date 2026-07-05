import { MapPinOff } from "lucide-react";

import { Card, EmptyState } from "@/components/ui";
import { MapPlaceCard } from "@/features/map/components/MapPlaceCard";
import type { MapItem } from "@/features/map/types/map";

type MapPlacesListProps = {
  items: MapItem[];
};

export function MapPlacesList({ items }: MapPlacesListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={MapPinOff}
        title="No points in this view"
        description="Choose another filter to bring places back onto the map preview."
        className="min-h-[30rem]"
      />
    );
  }

  return (
    <Card padding="none" className="h-full overflow-hidden hover:shadow-sm">
      <div className="border-b border-border-subtle p-5">
        <h2 className="font-semibold tracking-tight text-foreground">Places on map</h2>
        <p className="mt-1 text-sm text-muted">{items.length} visible points</p>
      </div>
      <div className="max-h-[31rem] space-y-3 overflow-y-auto p-4">
        {items.map((item, index) => (
          <MapPlaceCard key={item.id} item={item} pinNumber={index + 1} />
        ))}
      </div>
    </Card>
  );
}
