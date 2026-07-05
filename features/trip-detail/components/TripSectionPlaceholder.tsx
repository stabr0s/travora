import {
  BedDouble,
  CalendarRange,
  CircleDollarSign,
  Luggage,
  Map,
  MapPin,
  Users,
} from "lucide-react";

import { EmptyState } from "@/components/ui";
import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";

type PlaceholderTabId = Exclude<TripDetailTabId, "overview">;

const sectionDetails = {
  places: {
    title: "Places workspace",
    description: "Saved attractions, restaurants, hotels, and ideas will live here.",
    icon: MapPin,
  },
  map: {
    title: "Trip map",
    description: "Your places and routes will appear on an interactive map in a future sprint.",
    icon: Map,
  },
  plan: {
    title: "Daily plan",
    description: "Build each day around places, reservations, and fixed travel anchors.",
    icon: CalendarRange,
  },
  reservations: {
    title: "Reservations",
    description: "Flights, stays, tickets, and transport bookings will be organized here.",
    icon: BedDouble,
  },
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
} satisfies Record<PlaceholderTabId, { title: string; description: string; icon: typeof MapPin }>;

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
