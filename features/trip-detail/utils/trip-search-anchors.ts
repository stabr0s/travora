export const tripSearchAnchors = {
  plannerItem: (id: string) => `planner-item-${id}`,
  place: (id: string) => `place-${id}`,
  reservation: (id: string) => `reservation-${id}`,
  budgetExpense: (id: string) => `budget-expense-${id}`,
  packingItem: (id: string) => `packing-item-${id}`,
  travelLinks: "travel-links",
  importantInfo: "important-info",
} as const;
