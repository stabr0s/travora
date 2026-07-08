export type TripSummaryOverview = {
  title: string;
  destination: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  currency: string | null;
  description: string | null;
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

export type TripSummaryPlace = {
  title: string;
  category: string | null;
  location: string | null;
  website: string | null;
  notes: string | null;
};

export type TripSummaryReservation = {
  title: string;
  type: string | null;
  dates: string | null;
  provider: string | null;
  reference: string | null;
  status: string | null;
  price: string | null;
  notes: string | null;
};

export type TripSummaryBudget = {
  totals: { currency: string; amount: number }[];
  expenses: {
    title: string;
    category: string | null;
    status: string | null;
    amount: string;
  }[];
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

export type TripSummaryParticipants = {
  total: number;
  owners: number;
  editors: number;
  viewers: number;
  active: number;
  pending: number;
  invited: number;
};

export type TripSummaryData = {
  overview: TripSummaryOverview;
  planner: TripSummaryPlannerGroup[];
  places: TripSummaryPlace[];
  reservations: TripSummaryReservation[];
  budget: TripSummaryBudget;
  packing: TripSummaryPacking;
  participants: TripSummaryParticipants;
};
