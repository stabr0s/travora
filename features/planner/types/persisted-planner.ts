import type { Database } from "@/types/database";

export type PersistedPlannerItem =
  Database["public"]["Tables"]["planner_items"]["Row"];

export type PlannerItemStatus = "planned" | "completed" | "cancelled";

export type CreatePlannerItemInput = {
  tripId: string;
  title: string;
  placeId?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  type?: string;
  status?: PlannerItemStatus;
  orderIndex?: number;
};

export type UpdatePlannerItemInput = CreatePlannerItemInput & { id: string };

export type DeletePlannerItemInput = { tripId: string; id: string };

export type CopyPlannerDayInput = {
  tripId: string;
  sourceDate: string;
  targetDate: string;
};

export type ReorderPlannerItemInput = {
  tripId: string;
  itemId: string;
  siblingId: string;
  itemOrderIndex: number;
  siblingOrderIndex: number;
};

export type AddPlannerPresetInput = {
  tripId: string;
  targetDate: string;
  presetId: string;
};

export type PlannerItemFormFields = {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  placeId: string;
  type: string;
  status: string;
  orderIndex: string;
};

export type PlannerServiceResult<T> =
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

export type CreatePlannerItemActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fields?: Partial<PlannerItemFormFields>;
};
