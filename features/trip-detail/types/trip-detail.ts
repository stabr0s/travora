export type TripDetailStatus = "planning" | "upcoming" | "archived";

export type TripDetailTabId =
  | "overview"
  | "places"
  | "map"
  | "plan"
  | "reservations"
  | "budget"
  | "packing"
  | "participants";

export type PlanningChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
};

export type TimelinePreviewItem = {
  id: string;
  date: string;
  title: string;
  location: string;
  type: "arrival" | "stay" | "activity" | "departure";
};

export type TripDetail = {
  id: string;
  title: string;
  country: string;
  startDate: string;
  endDate: string;
  status: TripDetailStatus;
  participantsCount: number;
  placesCount: number;
  reservationsCount: number;
  costPerPerson: number;
  currency: string;
  planningProgress: number;
  coverGradient: string;
  description: string;
  mainCities: string[];
  planningChecklist: PlanningChecklistItem[];
  timelinePreview: TimelinePreviewItem[];
};
