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
  city: string;
  country: string;
  category: PlaceCategory;
  priority: PlacePriority;
  status: PlaceStatus;
  estimatedDuration: number;
  estimatedCost: number;
  currency: string;
  notes: string;
  coverGradient: string;
  plannedDay?: number;
  tags?: string[];
};
