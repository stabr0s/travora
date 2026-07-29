import type { PersistedBudgetExpense } from "@/features/budget/types/persisted-budget";
import type { PersistedPackingItem } from "@/features/packing/types/persisted-packing";
import type { PersistedPlace } from "@/features/places/types/persisted-place";
import type { PersistedPlannerItem } from "@/features/planner/types/persisted-planner";
import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";
import type { TripImportantInfo } from "@/features/trip-detail/types/important-info";
import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";
import { tripSearchAnchors } from "@/features/trip-detail/utils/trip-search-anchors";
import type { PersistedTravelLink } from "@/features/travel-links/types/travel-link";
import { getTravelLinkTypeLabel } from "@/features/travel-links/utils/travel-link-display";

export type TripSearchModule = "planner" | "places" | "reservations"
  | "budget" | "packing" | "travel-links" | "important-info";

export type TripSearchResult = {
  id: string;
  module: TripSearchModule;
  title: string;
  subtitle: string;
  searchText: string;
  targetTab: TripDetailTabId;
  targetAnchor?: string;
  priority: number;
};

export type TripSearchData = {
  places: PersistedPlace[];
  plannerItems: PersistedPlannerItem[];
  reservations: PersistedReservation[];
  budgetExpenses: PersistedBudgetExpense[];
  packingItems: PersistedPackingItem[];
  travelLinks: PersistedTravelLink[];
  importantInfo: TripImportantInfo | null;
};

function compact(values: Array<string | number | null | undefined>) {
  return values
    .filter((value) => value !== null && value !== undefined && String(value).trim())
    .map(String);
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase();
}

function truncate(value: string, length = 100) {
  const compactValue = value.replace(/\s+/g, " ").trim();
  return compactValue.length > length
    ? `${compactValue.slice(0, length - 1)}…`
    : compactValue;
}

function getUrlDomain(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function createResult(
  module: TripSearchModule,
  index: number,
  title: string,
  subtitleParts: Array<string | number | null | undefined>,
  searchableParts: Array<string | number | null | undefined>,
  targetTab: TripDetailTabId,
  priority: number,
  targetAnchor?: string,
): TripSearchResult {
  const subtitle = compact(subtitleParts).join(" · ");
  return {
    id: `${module}-${index}`,
    module,
    title,
    subtitle,
    searchText: normalize(compact([title, subtitle, ...searchableParts]).join(" ")),
    targetTab,
    targetAnchor,
    priority,
  };
}

export function buildTripSearchIndex(data: TripSearchData): TripSearchResult[] {
  const placeNames = new Map(data.places.map((place) => [place.id, place.title]));
  const reservationIds = new Set(data.reservations.map((reservation) => reservation.id));

  const planner = data.plannerItems.map((item, index) => createResult(
    "planner",
    index,
    item.title,
    [item.date, item.start_time, item.place_id ? placeNames.get(item.place_id) : null],
    [item.description, item.end_time, item.type, item.status],
    "plan",
    0,
    tripSearchAnchors.plannerItem(item.id),
  ));
  const places = data.places.map((place, index) => createResult(
    "places",
    index,
    place.title,
    [place.city, place.country, place.category],
    [place.address, place.status, place.priority, place.notes],
    "places",
    1,
    tripSearchAnchors.place(place.id),
  ));
  const reservations = data.reservations.map((reservation, index) => createResult(
    "reservations",
    index,
    reservation.title,
    [reservation.provider, reservation.start_date, reservation.location],
    [
      reservation.reservation_number,
      reservation.type,
      reservation.status,
      reservation.end_date,
      reservation.notes,
    ],
    "reservations",
    2,
    tripSearchAnchors.reservation(reservation.id),
  ));
  const budget = data.budgetExpenses.map((expense, index) => createResult(
    "budget",
    index,
    expense.title,
    [expense.amount, expense.currency, expense.category],
    [expense.status, expense.expense_date, expense.notes],
    "budget",
    3,
    tripSearchAnchors.budgetExpense(expense.id),
  ));
  const packing = data.packingItems.map((item, index) => createResult(
    "packing",
    index,
    item.name,
    [item.category, item.priority, item.assigned_to_name],
    [item.notes, item.is_shared ? "shared" : "personal"],
    "packing",
    4,
    tripSearchAnchors.packingItem(item.id),
  ));
  const travelLinks = data.travelLinks.map((link, index) => createResult(
    "travel-links",
    index,
    link.title,
    [getTravelLinkTypeLabel(link.link_type), getUrlDomain(link.url)],
    [link.note],
    link.reservation_id ? "reservations" : "overview",
    5,
    link.reservation_id && reservationIds.has(link.reservation_id)
      ? tripSearchAnchors.reservation(link.reservation_id)
      : link.reservation_id
        ? undefined
        : tripSearchAnchors.travelLinks,
  ));
  const importantInfo = data.importantInfo?.content?.trim()
    ? [createResult(
        "important-info",
        0,
        "Important Info",
        [truncate(data.importantInfo.content)],
        [data.importantInfo.content],
        "overview",
        6,
        tripSearchAnchors.importantInfo,
      )]
    : [];

  return [
    ...planner,
    ...places,
    ...reservations,
    ...budget,
    ...packing,
    ...travelLinks,
    ...importantInfo,
  ];
}

export function searchTripIndex(
  index: TripSearchResult[],
  query: string,
  limit = 10,
): TripSearchResult[] {
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 2) return [];

  return index
    .map((result) => {
      const title = normalize(result.title);
      const matchRank = title === normalizedQuery
        ? 0
        : title.startsWith(normalizedQuery)
          ? 10
          : title.includes(normalizedQuery)
            ? 20
            : result.searchText.includes(normalizedQuery)
              ? 30
              : null;
      return matchRank === null ? null : { result, score: matchRank + result.priority };
    })
    .filter((match): match is { result: TripSearchResult; score: number } => Boolean(match))
    .sort((first, second) =>
      first.score - second.score || first.result.title.localeCompare(second.result.title))
    .slice(0, limit)
    .map((match) => match.result);
}
