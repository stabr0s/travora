import type { TravelLinkType } from "@/features/travel-links/types/travel-link";

const travelLinkTypeLabels: Record<TravelLinkType, string> = {
  booking: "Booking",
  transport: "Transport",
  accommodation: "Accommodation",
  ticket: "Ticket / voucher",
  check_in: "Check-in / boarding pass",
  insurance: "Insurance",
  visa: "Visa / entry",
  document: "Document / folder",
  map: "Google My Maps / map",
  other: "Other",
};

export function getTravelLinkTypeLabel(type: string | null) {
  return travelLinkTypeLabels[type as TravelLinkType] || travelLinkTypeLabels.other;
}
