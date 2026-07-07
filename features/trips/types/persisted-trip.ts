import type { Database } from "@/types/database";

export type PersistedTrip = Database["public"]["Tables"]["trips"]["Row"];

export type CreateTripInput = {
  title: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  currency?: string;
  description?: string;
};

export type TripStatus = "planning" | "upcoming" | "archived";

export type UpdateTripInput = {
  tripId: string;
  title: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  coverImageUrl?: string;
  status: TripStatus;
  currency?: string;
};

export type DeleteTripInput = {
  tripId: string;
};

export type TripsServiceErrorCode =
  | "AUTH_REQUIRED"
  | "LOAD_FAILED"
  | "CREATE_FAILED"
  | "UPDATE_FAILED"
  | "DELETE_FAILED"
  | "INVALID_TRIP"
  | "PERMISSION_DENIED"
  | "NOT_FOUND";

export type TripsServiceError = {
  code: TripsServiceErrorCode;
  message: string;
};

export type TripsServiceResult<T> =
  | { data: T; error: null }
  | { data: null; error: TripsServiceError };

export type CreateTripActionState = {
  status: "idle" | "error";
  message?: string;
};

export type TripSettingsActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};
