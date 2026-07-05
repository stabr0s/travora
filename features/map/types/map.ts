import type {
  PlaceCategory,
  PlacePriority,
  PlaceStatus,
} from "@/features/places/types/place";

export type MapFilter =
  | "all"
  | "planned"
  | "must-see"
  | "hotels"
  | "restaurants";

export type MapItem = {
  id: string;
  tripId: string;
  name: string;
  city: string;
  category: PlaceCategory;
  status: PlaceStatus;
  priority: PlacePriority;
  latitude: number;
  longitude: number;
  plannedDay?: number;
  estimatedDuration?: number;
  estimatedCost?: number;
  currency?: string;
};

export type RouteSummary = {
  distanceKm: number;
  estimatedMinutes: number;
  transportMode: "mixed" | "walking" | "driving" | "transit";
};

export type TripMapData = {
  tripId: string;
  route: RouteSummary;
  items: MapItem[];
};
