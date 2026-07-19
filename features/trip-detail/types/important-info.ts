import type { Database } from "@/types/database";

export type TripImportantInfo =
  Database["public"]["Tables"]["trip_important_info"]["Row"];

export type SaveImportantInfoInput = {
  tripId: string;
  content: string;
};

export type ImportantInfoServiceResult<T> =
  | { data: T; error: null }
  | {
      data: null;
      error: {
        code: "AUTH_REQUIRED" | "INVALID_TRIP" | "LOAD_FAILED" | "SAVE_FAILED";
        message: string;
      };
    };

export type ImportantInfoActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};
