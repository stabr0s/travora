import type { PlaceCategory, PlacePriority, PlaceStatus } from "@/features/places/types/place";
import type { Database } from "@/types/database";

export type PersistedPlace = Database["public"]["Tables"]["places"]["Row"];

export type CreatePlaceInput = {
  tripId: string;
  title: string;
  category?: PlaceCategory;
  address?: string;
  city?: string;
  country?: string;
  status?: PlaceStatus;
  priority?: PlacePriority;
  notes?: string;
  websiteUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  mapOrder?: number | null;
};

export type UpdatePlaceInput = CreatePlaceInput & { id: string };

export type DeletePlaceInput = { tripId: string; id: string };

export type PlacesServiceResult<T> =
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

export type CreatePlaceActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};
