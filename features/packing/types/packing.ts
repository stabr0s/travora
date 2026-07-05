export type PackingCategory =
  | "documents"
  | "electronics"
  | "clothes"
  | "toiletries"
  | "health"
  | "travel"
  | "other";

export type PackingPriority = "essential" | "recommended" | "optional";

export type PackingCategoryFilter = "all" | PackingCategory;

export type PackingTraveler = {
  id: string;
  name: string;
  role?: string;
};

export type PackingItem = {
  id: string;
  tripId: string;
  name: string;
  category: PackingCategory;
  assignedTo?: string;
  isShared: boolean;
  isPacked: boolean;
  priority: PackingPriority;
  notes?: string;
};

export type TripPackingList = {
  tripId: string;
  travelers: PackingTraveler[];
  categories: PackingCategory[];
  items: PackingItem[];
};
