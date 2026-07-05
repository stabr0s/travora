export type TripStatus = "planning" | "upcoming" | "archived";

export type TripFilter = "all" | TripStatus;

export type Trip = {
  id: string;
  title: string;
  country: string;
  startDate: string;
  endDate: string;
  participants: number;
  placesCount: number;
  costPerPerson: number;
  currency: string;
  progress: number;
  status: TripStatus;
  coverGradient: string;
};
