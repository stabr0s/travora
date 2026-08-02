import type { Trip } from "@/features/trips/types/trip";

export type TripTimingGroupId = "ongoing" | "upcoming" | "draft" | "past";

export type OrganizedTripGroup = {
  id: TripTimingGroupId;
  label: string;
  trips: Trip[];
};

const groupLabels: Record<TripTimingGroupId, string> = {
  ongoing: "Ongoing",
  upcoming: "Upcoming",
  draft: "Drafts",
  past: "Past",
};

const groupOrder: TripTimingGroupId[] = ["ongoing", "upcoming", "draft", "past"];

export function getTodayUtc() {
  return new Date().toISOString().slice(0, 10);
}

export function getTripTimingGroup(
  trip: Trip,
  today: string,
): TripTimingGroupId {
  const { startDate, endDate } = trip;

  if (!startDate && !endDate) return "draft";
  if (endDate && endDate < today) return "past";
  if (startDate && startDate > today) return "upcoming";
  if (startDate && !endDate && startDate < today) return "past";
  return "ongoing";
}

function compareText(first: string | null | undefined, second: string | null | undefined) {
  return String(first || "").localeCompare(String(second || ""));
}

function compareRecency(first: Trip, second: Trip) {
  return compareText(
    second.updatedAt || second.createdAt,
    first.updatedAt || first.createdAt,
  ) || first.title.localeCompare(second.title);
}

function sortGroup(id: TripTimingGroupId, trips: Trip[]) {
  return [...trips].sort((first, second) => {
    if (id === "ongoing") {
      return compareText(
        first.endDate || first.startDate,
        second.endDate || second.startDate,
      ) || first.title.localeCompare(second.title);
    }
    if (id === "upcoming") {
      return compareText(first.startDate, second.startDate)
        || first.title.localeCompare(second.title);
    }
    if (id === "past") {
      return compareText(
        second.endDate || second.startDate,
        first.endDate || first.startDate,
      ) || first.title.localeCompare(second.title);
    }
    return compareRecency(first, second);
  });
}

export function organizeTrips(trips: Trip[], today: string): OrganizedTripGroup[] {
  const grouped = new Map<TripTimingGroupId, Trip[]>(
    groupOrder.map((id) => [id, []]),
  );

  trips.forEach((trip) => grouped.get(getTripTimingGroup(trip, today))?.push(trip));

  return groupOrder.flatMap((id) => {
    const groupTrips = grouped.get(id) || [];
    return groupTrips.length
      ? [{ id, label: groupLabels[id], trips: sortGroup(id, groupTrips) }]
      : [];
  });
}

export function searchTrips(trips: Trip[], query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return trips;

  return trips.filter((trip) =>
    `${trip.title} ${trip.country}`.toLocaleLowerCase().includes(normalizedQuery));
}
