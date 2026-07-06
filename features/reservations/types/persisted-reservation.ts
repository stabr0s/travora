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

export type UpdateReservationInput = CreateReservationInput & { id: string };

export type DeleteReservationInput = { tripId: string; id: string };

export type ReservationsServiceResult<T> =
  | { data: T; error: null }
  | {
      data: null;
      error: {
        code:
          | "AUTH_REQUIRED"
          | "INVALID_TRIP"
          | "INVALID_RECORD"
          | "LOAD_FAILED"
          | "CREATE_FAILED"
          | "UPDATE_FAILED"
          | "DELETE_FAILED";
        message: string;
      };
    };

export type CreateReservationActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};
