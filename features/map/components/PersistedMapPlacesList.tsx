import { ListOrdered, MapPin, MapPinOff } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { PersistedPlace } from "@/features/places/types/persisted-place";

type PersistedMapPlacesListProps = {
  title: string;
  description: string;
  places: PersistedPlace[];
  kind: "ready" | "missing";
};

function PlaceRow({ place, kind }: { place: PersistedPlace; kind: "ready" | "missing" }) {
  const Icon = kind === "ready" ? MapPin : MapPinOff;
  const location = [place.city, place.country].filter(Boolean).join(", ");

  return (
    <li className="flex items-start gap-3 rounded-xl border border-border-subtle bg-background p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
        <Icon className="size-4 text-primary" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-medium text-foreground">{place.title}</h3>
            <p className="mt-0.5 text-xs text-muted">{location || "Location not set"}</p>
          </div>
          {place.map_order != null ? (
            <Badge variant="outline" className="gap-1">
              <ListOrdered className="size-3" />
              {place.map_order}
            </Badge>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-muted">
          {kind === "ready"
            ? `${place.latitude}, ${place.longitude}`
            : "Add latitude and longitude in Places to make this place map-ready."}
        </p>
      </div>
    </li>
  );
}

export function PersistedMapPlacesList({
  title,
  description,
  places,
  kind,
}: PersistedMapPlacesListProps) {
  return (
    <Card padding="md">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      {places.length ? (
        <ul className="mt-5 space-y-3">
          {places.map((place) => <PlaceRow key={place.id} place={place} kind={kind} />)}
        </ul>
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          {kind === "ready" ? "No map-ready places yet." : "Every place has coordinates."}
        </p>
      )}
    </Card>
  );
}
