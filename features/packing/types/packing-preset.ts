import type { PackingCategory, PackingPriority } from "@/features/packing/types/packing";
import type { Database } from "@/types/database";

export type PersistedPackingPreset =
  Database["public"]["Tables"]["packing_presets"]["Row"];

export type PersistedPackingPresetItem =
  Database["public"]["Tables"]["packing_preset_items"]["Row"];

export type PackingPresetWithItems = PersistedPackingPreset & {
  items: PersistedPackingPresetItem[];
};

export type PackingPresetItemInput = {
  name: string;
  category?: PackingCategory;
  priority?: PackingPriority;
  notes?: string;
  sortOrder?: number;
};

export type CreatePackingPresetInput = {
  name: string;
  description?: string;
  items: PackingPresetItemInput[];
};

export type UpdatePackingPresetInput = CreatePackingPresetInput & {
  id: string;
};

export type ApplyPackingPresetResult = {
  addedCount: number;
  skippedCount: number;
};

export type PackingPresetServiceResult<T> =
  | { data: T; error: null }
  | {
      data: null;
      error: {
        code:
          | "AUTH_REQUIRED"
          | "INVALID_PRESET"
          | "INVALID_TRIP"
          | "LOAD_FAILED"
          | "CREATE_FAILED"
          | "UPDATE_FAILED"
          | "DELETE_FAILED"
          | "APPLY_FAILED";
        message: string;
      };
    };

export type PackingPresetActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};
