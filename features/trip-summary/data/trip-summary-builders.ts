import { getMockPackingByTripId } from "@/features/packing/data/mock-packing";
import type { PersistedPackingItem, PersistedPackingItemState } from "@/features/packing/types/persisted-packing";
import type { PersistedPlace } from "@/features/places/types/persisted-place";
import { getMockPlannerByTripId } from "@/features/planner/data/mock-planner";
import type { PersistedPlannerItem } from "@/features/planner/types/persisted-planner";
import { getMockTripDetail } from "@/features/trip-detail";
import type { TripImportantInfo } from "@/features/trip-detail/types/important-info";
import type { TripSummaryData, TripSummaryPacking, TripSummaryPlannerGroup, TripSummaryTravelLink } from "@/features/trip-summary/types/trip-summary";
import type { PersistedTravelLink } from "@/features/travel-links/types/travel-link";
import type { PersistedTrip } from "@/features/trips/types/persisted-trip";
function formatDate(value: string | null | undefined) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value.length === 10 ? `${value}T00:00:00Z` : value));
}
function packingSummary(items: { name: string; category: string | null; is_packed?: boolean | null; isPacked?: boolean }[]): TripSummaryPacking {
  const groups = new Map<string, { name: string; isPacked: boolean }[]>();
  items.forEach((item) => {
    const category = item.category || "other";
    const isPacked = "isPacked" in item ? Boolean(item.isPacked) : Boolean(item.is_packed);
    groups.set(category, [...(groups.get(category) || []), { name: item.name, isPacked }]);
  });
  const packed = items.filter((item) => "isPacked" in item ? item.isPacked : item.is_packed).length;

  return {
    total: items.length,
    packed,
    unpacked: items.length - packed,
    groups: Array.from(groups, ([category, groupItems]) => ({ category, items: groupItems })),
  };
}
function persistedPlannerGroups(
  items: PersistedPlannerItem[],
  places: PersistedPlace[],
): TripSummaryPlannerGroup[] {
  const placeById = new Map(places.map((place) => [place.id, place]));
  const groups = new Map<string, TripSummaryPlannerGroup["items"]>();

  items.forEach((item) => {
    const place = item.place_id ? placeById.get(item.place_id) : null;
    const label = item.date ? formatDate(item.date) || item.date : "Unscheduled";
    const location = place ? [place.address, place.city, place.country].filter(Boolean).join(", ") : null;
    const time = item.start_time || item.end_time
      ? [item.start_time?.slice(0, 5), item.end_time?.slice(0, 5)].filter(Boolean).join(" – ")
      : null;

    groups.set(label, [
      ...(groups.get(label) || []),
      { time, title: item.title, type: item.type, location, notes: item.description },
    ]);
  });

  return Array.from(groups, ([label, groupItems]) => ({ label, items: groupItems }));
}
function tripLevelTravelLinks(links: PersistedTravelLink[]): TripSummaryTravelLink[] {
  return links.filter((link) => !link.reservation_id).map((link) => ({
    title: link.title,
    url: link.url,
    type: link.link_type,
    note: link.note,
    reservationId: null,
  }));
}
export function buildPersistedSummary(input: {
  trip: PersistedTrip;
  places: PersistedPlace[];
  planner: PersistedPlannerItem[];
  packing: PersistedPackingItem[];
  packingStates?: PersistedPackingItemState[];
  importantInfo?: TripImportantInfo | null;
  travelLinks?: PersistedTravelLink[];
}): TripSummaryData {
  const stateByItemId = new Map(
    (input.packingStates || []).map((state) => [state.packing_item_id, state.is_packed]),
  );

  return {
    overview: {
      title: input.trip.title,
      destination: input.trip.destination || "Destination not set",
      startDate: input.trip.start_date,
      endDate: input.trip.end_date,
      status: input.trip.status || "planning",
      currency: input.trip.currency,
      description: input.trip.description,
      importantInfo: input.importantInfo?.content || null,
    },
    planner: persistedPlannerGroups(input.planner, input.places),
    travelLinks: tripLevelTravelLinks(input.travelLinks || []),
    packing: packingSummary(input.packing.map((item) => ({
      ...item,
      isPacked: stateByItemId.get(item.id) ?? false,
    }))),
  };
}
export function buildMockSummary(tripId: string): TripSummaryData | null {
  const trip = getMockTripDetail(tripId);
  if (!trip) return null;
  const packing = getMockPackingByTripId(tripId);

  return {
    overview: {
      title: trip.title,
      destination: trip.country,
      startDate: trip.startDate,
      endDate: trip.endDate,
      status: trip.status,
      currency: trip.currency,
      description: trip.description,
      importantInfo: null,
    },
    planner: getMockPlannerByTripId(tripId)?.days.map((day) => ({
      label: `${formatDate(day.date) || day.date}${day.city ? ` · ${day.city}` : ""}`,
      items: day.items.map((item) => ({
        time: [item.startTime, item.endTime].filter(Boolean).join(" – ") || null,
        title: item.title,
        type: item.type,
        location: item.location || null,
        notes: item.notes || null,
      })),
    })) || [],
    travelLinks: [],
    packing: packingSummary(packing?.items || []),
  };
}
