export type TripStatus = "planning" | "upcoming" | "archived";

export type TripFilter = "all" | TripStatus;

export type TripRole = "owner" | "editor" | "viewer";

export type Trip = {
  id: string;
  title: string;
  country: string;
  startDate: string | null;
  endDate: string | null;
  participants: number | null;
  placesCount: number | null;
  costPerPerson: number | null;
  currency: string;
  progress: number | null;
  status: TripStatus;
  coverGradient: string;
  role?: TripRole;
  createdAt?: string | null;
  updatedAt?: string | null;
  isDemo?: boolean;
};
