import type { PersistedPlace } from "@/features/places/types/persisted-place";
import type { Place, PlaceCategory } from "@/features/places/types/place";

const categories: PlaceCategory[] = [
  "attraction", "restaurant", "viewpoint", "hotel",
  "airport", "transport", "shop", "other",
];

const coverGradients = [
  "from-emerald-700 via-teal-500 to-cyan-300",
  "from-indigo-700 via-violet-500 to-rose-300",
  "from-amber-600 via-orange-400 to-yellow-200",
  "from-slate-800 via-blue-600 to-sky-300",
];

function normalizeCategory(category: string | null): PlaceCategory | null {
  return categories.includes(category as PlaceCategory)
    ? (category as PlaceCategory)
    : null;
}

export function mapPersistedPlaceToPlace(place: PersistedPlace): Place {
  const gradientIndex = Array.from(place.id).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  ) % coverGradients.length;

  return {
    id: place.id,
    tripId: place.trip_id,
    name: place.title,
    city: place.city,
    country: place.country,
    category: normalizeCategory(place.category),
    priority: place.priority,
    status: place.status,
    estimatedDuration: null,
    estimatedCost: null,
    currency: null,
    notes: place.notes || "",
    coverGradient: coverGradients[gradientIndex],
  };
}
