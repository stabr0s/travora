import {
  CircleDollarSign,
  Luggage,
  Users,
} from "lucide-react";

import { EmptyState } from "@/components/ui";
import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";

type PlaceholderTabId = Exclude<
  TripDetailTabId,
  "overview" | "places" | "map" | "plan" | "reservations"
>;

const sectionDetails = {
  budget: {
    title: "Trip budget",
    description: "Track expected costs, payments, and the estimated cost per traveler.",
    icon: CircleDollarSign,
  },
  packing: {
    title: "Packing lists",
    description: "Shared and private packing checklists will help everyone get ready.",
    icon: Luggage,
  },
  participants: {
    title: "Participants",
    description: "Travelers, invitations, and trip roles will be managed in this section.",
    icon: Users,
  },
} satisfies Record<PlaceholderTabId, { title: string; description: string; icon: typeof CircleDollarSign }>;

type TripSectionPlaceholderProps = {
  section: PlaceholderTabId;
};

export function TripSectionPlaceholder({
  section,
}: TripSectionPlaceholderProps) {
  const details = sectionDetails[section];

  return (
    <EmptyState
      icon={details.icon}
      title={details.title}
      description={details.description}
      className="min-h-96"
    />
  );
}
