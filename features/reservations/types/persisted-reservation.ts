import type { ReservationStatus } from "@/features/reservations/types/reservation";
import type { Database } from "@/types/database";

export type PersistedReservation =
  Database["public"]["Tables"]["reservations"]["Row"];

export type CreateReservationInput = {
  tripId: string;
  title: string;
  type?: string;
  provider?: string;
  reservationNumber?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  totalPrice?: number;
  currency?: string;
  status?: ReservationStatus;
  payerName?: string;
  notes?: string;
};

export type ReservationsServiceResult<T> =
  | { data: T; error: null }
  | {
      data: null;
      error: {
        code: "AUTH_REQUIRED" | "INVALID_TRIP" | "LOAD_FAILED" | "CREATE_FAILED";
        message: string;
      };
    };

export type CreateReservationActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};
