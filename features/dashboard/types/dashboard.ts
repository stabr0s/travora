export type DashboardUser = {
  name: string;
};

export type NextTrip = {
  id: string;
  title: string;
  country: string;
  startDate: string;
  endDate: string | null;
  participants: number | null;
  costPerPerson: number | null;
  currency: string;
  progress: number | null;
  daysUntil: number | null;
  placesCount: number | null;
  coverGradient: string;
};

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  change?: string;
};

export type QuickAction = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: "plus" | "map-pin" | "map" | "wallet" | "luggage" | "calendar";
};

export type RecentPlace = {
  id: string;
  name: string;
  tripTitle: string;
  category: string;
  status: "planned" | "idea" | "visited";
  priority: "must_see" | "recommended" | "optional";
};

export type UpcomingReservation = {
  id: string;
  type: "flight" | "hotel" | "transport" | "ticket";
  title: string;
  tripTitle: string;
  date: string;
  status: "paid" | "deposit" | "unpaid";
};

export type DashboardTripSummary = {
  id: string;
  title: string;
  country: string;
  status: "planning" | "upcoming" | "archived";
  role?: "owner" | "editor" | "viewer";
  dateLabel: string;
};

export type DashboardData = {
  user: DashboardUser;
  nextTrip: NextTrip | null;
  stats: DashboardStat[];
  quickActions: QuickAction[];
  recentTrips: DashboardTripSummary[];
  recentPlaces: RecentPlace[];
  upcomingReservations: UpcomingReservation[];
  isPersisted?: boolean;
};
