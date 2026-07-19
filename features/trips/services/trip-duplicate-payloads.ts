import { randomUUID } from "node:crypto";

import type { Database } from "@/types/database";

type TableRow<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Row"];

type DuplicateSourceRows = {
  places: TableRow<"places">[];
  planner: TableRow<"planner_items">[];
  reservations: TableRow<"reservations">[];
  budget: TableRow<"budget_expenses">[];
  packing: TableRow<"packing_items">[];
};

export function buildDuplicateModulePayloads(
  newTripId: string,
  source: DuplicateSourceRows,
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
      latitude: place.latitude,
      longitude: place.longitude,
      map_order: place.map_order,
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
    date: item.date,
    start_time: item.start_time,
    end_time: item.end_time,
    type: item.type,
    status: item.status,
    order_index: item.order_index,
  } satisfies Database["public"]["Tables"]["planner_items"]["Insert"]));

  const reservationPayloads = source.reservations.map((reservation) => ({
    id: randomUUID(),
    trip_id: newTripId,
    type: reservation.type,
    title: reservation.title,
    provider: reservation.provider,
    reservation_number: reservation.reservation_number,
    start_date: reservation.start_date,
    end_date: reservation.end_date,
    location: reservation.location,
    total_price: reservation.total_price,
    currency: reservation.currency,
    status: reservation.status,
    payer_name: reservation.payer_name,
    notes: reservation.notes,
  } satisfies Database["public"]["Tables"]["reservations"]["Insert"]));

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
    expense_date: expense.expense_date,
    notes: expense.notes,
  } satisfies Database["public"]["Tables"]["budget_expenses"]["Insert"]));

  const packingPayloads = source.packing.map((item) => ({
    id: randomUUID(),
    trip_id: newTripId,
    name: item.name,
    category: item.category,
    assigned_to_name: item.assigned_to_name,
    is_shared: item.is_shared,
    is_packed: false,
    priority: item.priority,
    notes: item.notes,
  } satisfies Database["public"]["Tables"]["packing_items"]["Insert"]));

  return {
    placePayloads,
    plannerPayloads,
    reservationPayloads,
    budgetPayloads,
    packingPayloads,
  };
}
