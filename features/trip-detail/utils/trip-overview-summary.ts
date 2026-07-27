import type { PersistedBudgetExpense } from "@/features/budget/types/persisted-budget";
import type { PersistedPackingItemState } from "@/features/packing/types/persisted-packing";
import type { PersistedPlannerItem } from "@/features/planner/types/persisted-planner";
import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";

export type OverviewCurrencyTotal = {
  currency: string;
  amount: number;
  count: number;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getNextPlannerItems(items: PersistedPlannerItem[], limit = 3) {
  const today = todayKey();

  return [...items]
    .filter((item) => (
      Boolean(item.date)
      && item.date! >= today
      && item.status !== "completed"
      && item.status !== "cancelled"
    ))
    .sort((first, second) => (
      (first.date || "").localeCompare(second.date || "")
      || (first.start_time || "").localeCompare(second.start_time || "")
      || (first.order_index ?? Number.MAX_SAFE_INTEGER)
        - (second.order_index ?? Number.MAX_SAFE_INTEGER)
      || (first.created_at || "").localeCompare(second.created_at || "")
    ))
    .slice(0, limit);
}

export function getUpcomingReservations(
  reservations: PersistedReservation[],
  limit = 3,
) {
  const now = Date.now();

  return [...reservations]
    .filter((reservation) => {
      if (!reservation.start_date) return false;
      const relevantDate = reservation.end_date || reservation.start_date;
      const timestamp = Date.parse(relevantDate);
      return Number.isFinite(timestamp) && timestamp >= now;
    })
    .sort((first, second) => (
      Date.parse(first.start_date || "") - Date.parse(second.start_date || "")
      || (second.created_at || "").localeCompare(first.created_at || "")
    ))
    .slice(0, limit);
}

export function getBudgetCurrencyTotals(expenses: PersistedBudgetExpense[]) {
  const totals = new Map<string, OverviewCurrencyTotal>();

  expenses.forEach((expense) => {
    const currency = (expense.currency || "EUR").toUpperCase();
    const current = totals.get(currency) || { currency, amount: 0, count: 0 };
    current.amount += expense.amount;
    current.count += 1;
    totals.set(currency, current);
  });

  return Array.from(totals.values()).sort((a, b) => a.currency.localeCompare(b.currency));
}

export function countUnassignedExpenses(expenses: PersistedBudgetExpense[]) {
  return expenses.filter((expense) => (
    !expense.paid_by_user_id || !expense.split_between_user_ids?.length
  )).length;
}

export function countPersonallyPackedItems(
  itemIds: Set<string>,
  states: PersistedPackingItemState[],
) {
  return states.filter((state) => (
    itemIds.has(state.packing_item_id) && state.is_packed
  )).length;
}
