export type TripSummaryOverview = {
  title: string;
  destination: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  currency: string | null;
  description: string | null;
  importantInfo: string | null;
};

export type TripSummaryPlannerGroup = {
  label: string;
  items: {
    time: string | null;
    title: string;
    type: string | null;
    location: string | null;
    notes: string | null;
  }[];
};

export type TripSummaryTravelLink = {
  title: string;
  url: string;
  type: string | null;
  note: string | null;
  reservationId: string | null;
};

export type TripSummaryPacking = {
  total: number;
  packed: number;
  unpacked: number;
  groups: {
    category: string;
    items: { name: string; isPacked: boolean }[];
  }[];
};

export type TripSummaryData = {
  overview: TripSummaryOverview;
  planner: TripSummaryPlannerGroup[];
  travelLinks: TripSummaryTravelLink[];
  packing: TripSummaryPacking;
};
