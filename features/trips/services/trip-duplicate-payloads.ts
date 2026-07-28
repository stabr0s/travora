import { randomUUID } from "node:crypto";

import type { DuplicateSourceRows } from "@/features/trips/services/trip-duplicate-source";
import type { PersistedTrip } from "@/features/trips/types/persisted-trip";
import {
  shiftDateOnly,
  shiftTimestamp,
} from "@/features/trips/utils/trip-date-shift";
import type { Database } from "@/types/database";

export function buildDuplicateModulePayloads(
  newTripId: string,
  createdBy: string,
  source: DuplicateSourceRows,
  dateShiftDays = 0,
) {
  const placeIdMap = new Map<string, string>();
  const placePayloads = source.places.map((place) => {
    const id = randomUUID();
    placeIdMap.set(place.id, id);

    return {
      id,
      trip_id: newTripId,
      title: place.title,
      category: place.category,
      address: place.address,
      city: place.city,
      country: place.country,
      status: place.status,
      priority: place.priority,
      notes: place.notes,
      website_url: place.website_url,
      image_url: place.image_url,
    } satisfies Database["public"]["Tables"]["places"]["Insert"];
  });

  const plannerPayloads = source.planner.map((item) => ({
    id: randomUUID(),
    trip_id: newTripId,
    place_id: item.place_id ? placeIdMap.get(item.place_id) ?? null : null,
    title: item.title,
    description: item.description,
    date: shiftDateOnly(item.date, dateShiftDays),
    start_time: item.start_time,
    end_time: item.end_time,
    type: item.type,
    status: item.status,
    order_index: item.order_index,
  } satisfies Database["public"]["Tables"]["planner_items"]["Insert"]));

  const reservationIdMap = new Map<string, string>();
  const reservationPayloads = source.reservations.map((reservation) => {
    const id = randomUUID();
    reservationIdMap.set(reservation.id, id);

    return {
      id,
      trip_id: newTripId,
      type: reservation.type,
      title: reservation.title,
      provider: reservation.provider,
      reservation_number: reservation.reservation_number,
      start_date: shiftTimestamp(reservation.start_date, dateShiftDays),
      end_date: shiftTimestamp(reservation.end_date, dateShiftDays),
      location: reservation.location,
      total_price: reservation.total_price,
      currency: reservation.currency,
      status: reservation.status,
      payer_name: null,
      notes: reservation.notes,
    } satisfies Database["public"]["Tables"]["reservations"]["Insert"];
  });

  const travelLinkPayloads = source.travelLinks.flatMap((link) => {
    const reservationId = link.reservation_id
      ? reservationIdMap.get(link.reservation_id)
      : null;
    if (link.reservation_id && !reservationId) return [];

    return [{
      id: randomUUID(),
      trip_id: newTripId,
      reservation_id: reservationId,
      title: link.title,
      url: link.url,
      link_type: link.link_type,
      note: link.note,
      created_by: createdBy,
    } satisfies Database["public"]["Tables"]["travel_links"]["Insert"]];
  });

  const budgetPayloads = source.budget.map((expense) => ({
    id: randomUUID(),
    trip_id: newTripId,
    category: expense.category,
    title: expense.title,
    amount: expense.amount,
    currency: expense.currency,
    paid_by_name: null,
    paid_by_user_id: null,
    participants_count: expense.participants_count,
    split_between_user_ids: null,
    split_type: "equal",
    status: expense.status,
    expense_date: shiftDateOnly(expense.expense_date, dateShiftDays),
    notes: expense.notes,
  } satisfies Database["public"]["Tables"]["budget_expenses"]["Insert"]));

  const packingPayloads = source.packing.map((item) => ({
    id: randomUUID(),
    trip_id: newTripId,
    name: item.name,
    category: item.category,
    assigned_to_name: null,
    is_shared: item.is_shared,
    is_packed: false,
    priority: item.priority,
    notes: item.notes,
  } satisfies Database["public"]["Tables"]["packing_items"]["Insert"]));

  return {
    placePayloads,
    plannerPayloads,
    reservationPayloads,
    travelLinkPayloads,
    budgetPayloads,
    packingPayloads,
  };
}

export function buildDuplicateFallbackTrip(
  id: string,
  ownerId: string,
  payload: Database["public"]["Tables"]["trips"]["Insert"],
): PersistedTrip {
  return {
    id,
    owner_id: ownerId,
    title: payload.title,
    destination: payload.destination || null,
    start_date: payload.start_date || null,
    end_date: payload.end_date || null,
    cover_image_url: payload.cover_image_url || null,
    status: "planning",
    description: payload.description || null,
    currency: payload.currency || "EUR",
    public_share_enabled: false,
    public_share_token: null,
    public_share_created_at: null,
    public_share_updated_at: null,
    public_share_sections: {
      overview: true,
      places: true,
      planner: true,
      reservations: true,
      budget: true,
      packing: true,
    },
    created_at: null,
    updated_at: null,
  };
}
