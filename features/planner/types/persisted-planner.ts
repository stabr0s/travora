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

export type PlannerServiceResult<T> =
  | { data: T; error: null }
  | {
      data: null;
      error: {
        code: "AUTH_REQUIRED" | "INVALID_TRIP" | "LOAD_FAILED" | "CREATE_FAILED";
        message: string;
      };
    };

export type CreatePlannerItemActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};
