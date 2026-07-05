import {
  Luggage,
  Users,
} from "lucide-react";

import { EmptyState } from "@/components/ui";
import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";

type PlaceholderTabId = Exclude<
  TripDetailTabId,
  "overview" | "places" | "map" | "plan" | "reservations" | "budget"
>;

const sectionDetails = {
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
} satisfies Record<PlaceholderTabId, { title: string; description: string; icon: typeof Luggage }>;

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
