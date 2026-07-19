import type { Database } from "@/types/database";

export const travelLinkTypes = [
  "booking",
  "transport",
  "accommodation",
  "ticket",
  "check_in",
  "insurance",
  "visa",
  "document",
  "map",
  "other",
] as const;

export type TravelLinkType = typeof travelLinkTypes[number];
export type PersistedTravelLink = Database["public"]["Tables"]["travel_links"]["Row"];

export type TravelLinkServiceError = {
  code: string;
  message: string;
};

export type TravelLinksServiceResult<T> = {
  data: T | null;
  error: TravelLinkServiceError | null;
};

export type TravelLinkActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export type CreateTravelLinkInput = {
  tripId: string;
  reservationId?: string | null;
  title: string;
  url: string;
  linkType?: string | null;
  note?: string | null;
};

export type UpdateTravelLinkInput = CreateTravelLinkInput & {
  id: string;
};

export type DeleteTravelLinkInput = {
  tripId: string;
  id: string;
};
