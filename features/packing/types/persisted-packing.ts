import type { PackingCategory, PackingPriority } from "@/features/packing/types/packing";
import type { Database } from "@/types/database";

export type PersistedPackingItem =
  Database["public"]["Tables"]["packing_items"]["Row"];

export type CreatePackingItemInput = {
  tripId: string;
  name: string;
  category?: PackingCategory;
  assignedToName?: string;
  isShared?: boolean;
  isPacked?: boolean;
  priority?: PackingPriority;
  notes?: string;
};

export type UpdatePackingItemInput = CreatePackingItemInput & { id: string };
export type DeletePackingItemInput = { tripId: string; id: string };
export type TogglePackingItemInput = DeletePackingItemInput & { isPacked: boolean };

export type PackingServiceResult<T> =
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

export type PackingActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};
