export type PublicShareTrip = {
  title: string;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  currency: string | null;
  description: string | null;
};

export type PublicSharePlace = {
  title: string;
  category: string | null;
  status: string | null;
  city: string | null;
  country: string | null;
  address: string | null;
  website: string | null;
  notes: string | null;
};

export type PublicSharePlannerItem = {
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  title: string;
  type: string | null;
  description: string | null;
  status: string | null;
  place: { title: string; city: string | null; country: string | null } | null;
};

export type PublicShareReservation = {
  title: string;
  type: string | null;
  provider: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  price: number | null;
  currency: string | null;
  notes: string | null;
};

export type PublicShareBudgetExpense = {
  title: string;
  category: string | null;
  amount: number | null;
  currency: string | null;
  date: string | null;
  status: string | null;
  notes: string | null;
};

export type PublicSharePackingItem = {
  name: string;
  category: string | null;
  priority: string | null;
  notes: string | null;
};

export type PublicSharedTrip = {
  trip: PublicShareTrip;
  places: PublicSharePlace[];
  planner: PublicSharePlannerItem[];
  reservations: PublicShareReservation[];
  budget: PublicShareBudgetExpense[];
  packing: PublicSharePackingItem[];
};

export type PublicShareServiceResult =
  | { data: PublicSharedTrip; error: null }
  | { data: null; error: { code: "NOT_FOUND" | "LOAD_FAILED"; message: string } };
