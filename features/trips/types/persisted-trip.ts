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

export type TripsServiceErrorCode =
  | "AUTH_REQUIRED"
  | "LOAD_FAILED"
  | "CREATE_FAILED"
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
