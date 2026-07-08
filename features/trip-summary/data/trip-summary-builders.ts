import { getMockBudgetByTripId } from "@/features/budget/data/mock-budget";
import type { PersistedBudgetExpense } from "@/features/budget/types/persisted-budget";
import { getMockPackingByTripId } from "@/features/packing/data/mock-packing";
import type { PersistedPackingItem } from "@/features/packing/types/persisted-packing";
import { getMockParticipantsByTripId } from "@/features/participants/data/mock-participants";
import type { PersistedParticipant } from "@/features/participants/types/persisted-participant";
import { getMockPlacesByTripId } from "@/features/places/data/mock-places";
import type { PersistedPlace } from "@/features/places/types/persisted-place";
import { getMockPlannerByTripId } from "@/features/planner/data/mock-planner";
import type { PersistedPlannerItem } from "@/features/planner/types/persisted-planner";
import { getMockReservationsByTripId } from "@/features/reservations/data/mock-reservations";
import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";
import { getMockTripDetail } from "@/features/trip-detail";
import type { TripSummaryBudget, TripSummaryData, TripSummaryPacking, TripSummaryParticipants, TripSummaryPlannerGroup } from "@/features/trip-summary/types/trip-summary";
import type { PersistedTrip } from "@/features/trips/types/persisted-trip";
function formatCurrency(amount: number, currency: string | null) {
  return `${amount.toFixed(2)} ${(currency || "EUR").toUpperCase()}`;
}
function formatDate(value: string | null | undefined) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value.length === 10 ? `${value}T00:00:00Z` : value));
}
function formatRange(start?: string | null, end?: string | null) {
  const startLabel = formatDate(start);
  const endLabel = formatDate(end);
  if (startLabel && endLabel) return `${startLabel} – ${endLabel}`;
  return startLabel || endLabel;
}
function participantCounts(participants: { role: string; status: string }[]): TripSummaryParticipants {
  const countBy = (field: "role" | "status", value: string) =>
    participants.filter((item) => item[field] === value).length;
  return {
    total: participants.length,
    owners: countBy("role", "owner"),
    editors: countBy("role", "editor"),
    viewers: countBy("role", "viewer"),
    active: countBy("status", "active"),
    pending: countBy("status", "pending"),
    invited: countBy("status", "invited"),
  };
}
function budgetSummary(expenses: { title: string; amount: number; currency: string | null; category: string | null; status: string | null }[]): TripSummaryBudget {
  const totals = new Map<string, number>();
  expenses.forEach((expense) => {
    const currency = (expense.currency || "EUR").toUpperCase();
    totals.set(currency, (totals.get(currency) || 0) + expense.amount);
  });
  return {
    totals: Array.from(totals, ([currency, amount]) => ({ currency, amount })),
    expenses: expenses.map((expense) => ({
      title: expense.title,
      category: expense.category,
      status: expense.status,
      amount: formatCurrency(expense.amount, expense.currency),
    })),
  };
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
export function buildPersistedSummary(input: {
  trip: PersistedTrip;
  places: PersistedPlace[];
  planner: PersistedPlannerItem[];
  reservations: PersistedReservation[];
  budget: PersistedBudgetExpense[];
  packing: PersistedPackingItem[];
  participants: PersistedParticipant[];
}): TripSummaryData {
  return {
    overview: {
      title: input.trip.title,
      destination: input.trip.destination || "Destination not set",
      startDate: input.trip.start_date,
      endDate: input.trip.end_date,
      status: input.trip.status || "planning",
      currency: input.trip.currency,
      description: input.trip.description,
    },
    planner: persistedPlannerGroups(input.planner, input.places),
    places: input.places.map((place) => ({
      title: place.title,
      category: place.category,
      location: [place.address, place.city, place.country].filter(Boolean).join(", ") || null,
      website: place.website_url,
      notes: place.notes,
    })),
    reservations: input.reservations.map((reservation) => ({
      title: reservation.title,
      type: reservation.type,
      dates: formatRange(reservation.start_date, reservation.end_date),
      provider: reservation.provider,
      reference: reservation.reservation_number,
      status: reservation.status,
      price: reservation.total_price == null ? null : formatCurrency(reservation.total_price, reservation.currency),
      notes: reservation.notes,
    })),
    budget: budgetSummary(input.budget),
    packing: packingSummary(input.packing),
    participants: participantCounts(input.participants),
  };
}
export function buildMockSummary(tripId: string): TripSummaryData | null {
  const trip = getMockTripDetail(tripId);
  if (!trip) return null;
  const budget = getMockBudgetByTripId(tripId);
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
    places: getMockPlacesByTripId(tripId).map((place) => ({
      title: place.name,
      category: place.category,
      location: [place.city, place.country].filter(Boolean).join(", ") || null,
      website: null,
      notes: place.notes,
    })),
    reservations: getMockReservationsByTripId(tripId).map((reservation) => ({
      title: reservation.title,
      type: reservation.type,
      dates: formatRange(reservation.startDate, reservation.endDate),
      provider: reservation.provider || null,
      reference: reservation.reservationNumber || null,
      status: reservation.status,
      price: formatCurrency(reservation.totalPrice, reservation.currency),
      notes: reservation.notes || null,
    })),
    budget: budgetSummary(budget?.expenses.map((expense) => ({
      title: expense.title,
      amount: expense.amount,
      currency: expense.currency,
      category: expense.category,
      status: expense.status,
    })) || []),
    packing: packingSummary(packing?.items || []),
    participants: participantCounts(getMockParticipantsByTripId(tripId)),
  };
}
