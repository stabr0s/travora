import type { PersistedPlace } from "@/features/places/types/persisted-place";
import type { PersistedPlannerItem } from "@/features/planner/types/persisted-planner";

export function formatPlannerDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatPlannerShortDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);

  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
}

function compareNullable(valueA: string | null, valueB: string | null) {
  if (valueA && valueB) return valueA.localeCompare(valueB);
  if (valueA) return -1;
  if (valueB) return 1;
  return 0;
}

export function sortPlannerDayItems(items: PersistedPlannerItem[]) {
  return items
    .map((item, fallbackIndex) => ({ item, fallbackIndex }))
    .sort((left, right) => {
      const orderDiff = (left.item.order_index ?? left.fallbackIndex)
        - (right.item.order_index ?? right.fallbackIndex);
      if (orderDiff) return orderDiff;

      return compareNullable(left.item.start_time, right.item.start_time)
        || compareNullable(left.item.created_at, right.item.created_at);
    })
    .map(({ item }) => item);
}

export function groupPlannerItemsByDay(items: PersistedPlannerItem[]) {
  const grouped = new Map<string, PersistedPlannerItem[]>();

  items.forEach((item) => {
    const key = item.date || "unscheduled";
    grouped.set(key, [...(grouped.get(key) || []), item]);
  });

  return Array.from(grouped.entries())
    .map(([date, groupItems]) => [date, sortPlannerDayItems(groupItems)] as const)
    .sort(([dateA], [dateB]) => {
      if (dateA === "unscheduled") return 1;
      if (dateB === "unscheduled") return -1;
      return dateA.localeCompare(dateB);
    });
}

export function getPlannedPlaceLabels(
  groups: ReturnType<typeof groupPlannerItemsByDay>,
) {
  const labels = new Map<string, string>();

  groups.forEach(([date, groupItems]) => {
    groupItems.forEach((item) => {
      if (!item.place_id || labels.has(item.place_id)) return;
      labels.set(
        item.place_id,
        date === "unscheduled" ? "Planned" : `Planned · ${formatPlannerShortDate(date)}`,
      );
    });
  });

  return labels;
}

export function typeFromPlace(place: PersistedPlace) {
  if (["attraction", "restaurant", "hotel", "transport", "other"].includes(place.category || "")) {
    return place.category || "other";
  }

  return "other";
}

export function descriptionFromPlace(place: PersistedPlace) {
  const details = [
    place.category ? `Category: ${place.category}` : "",
    place.address ? `Address: ${place.address}` : "",
    place.website_url ? `Website: ${place.website_url}` : "",
  ].filter(Boolean);

  return details.length ? `From saved place. ${details.join(". ")}.` : "From saved place.";
}
