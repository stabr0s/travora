export type PlannerMode = "ordered" | "scheduled";

export type PlanItemType =
  | "flight"
  | "hotel"
  | "attraction"
  | "restaurant"
  | "transport"
  | "activity"
  | "free-time"
  | "other";

export type PlanItemCategory =
  | "travel"
  | "stay"
  | "sightseeing"
  | "food"
  | "transfer"
  | "leisure"
  | "other";

export type PlanItem = {
  id: string;
  type: PlanItemType;
  title: string;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  isFixed: boolean;
  category: PlanItemCategory;
  cost?: number;
  currency?: string;
  notes?: string;
};

export type PlannerDay = {
  id: string;
  dayNumber: number;
  date: string;
  city: string;
  mode: PlannerMode;
  baseLocation?: string;
  loadPercentage: number;
  items: PlanItem[];
};

export type TripPlanner = {
  tripId: string;
  days: PlannerDay[];
};
