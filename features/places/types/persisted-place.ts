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
  latitude?: number;
  longitude?: number;
};

export type PlacesServiceResult<T> =
  | { data: T; error: null }
  | {
      data: null;
      error: {
        code: "AUTH_REQUIRED" | "INVALID_TRIP" | "LOAD_FAILED" | "CREATE_FAILED";
        message: string;
      };
    };

export type CreatePlaceActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};
