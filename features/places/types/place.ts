export type PlaceCategory =
  | "attraction"
  | "restaurant"
  | "viewpoint"
  | "hotel"
  | "airport"
  | "transport"
  | "shop"
  | "other";

export type PlacePriority = "must-see" | "recommended" | "optional";

export type PlaceStatus = "idea" | "planned" | "visited" | "rejected";

export type PlaceFilter = "all" | "must-see" | "planned" | "idea" | "visited";

export type Place = {
  id: string;
  tripId: string;
  name: string;
  city: string | null;
  country: string | null;
  category: PlaceCategory | null;
  priority: PlacePriority | null;
  status: PlaceStatus | null;
  estimatedDuration: number | null;
  estimatedCost: number | null;
  currency: string | null;
  notes: string;
  coverGradient: string;
  plannedDay?: number;
  tags?: string[];
};
