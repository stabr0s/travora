import type { TripBudget } from "@/features/budget/types/budget";

export const mockBudgets: Record<string, TripBudget> = {
  "japan-2027": {
    tripId: "japan-2027", currency: "EUR", participantsCount: 4, totalBudget: 16000, totalSpent: 6240,
    costPerPerson: 1560, paidPerPerson: 920, remainingPerPerson: 640,
    categories: [
      { category: "flights", amount: 2940, percentage: 47 }, { category: "hotels", amount: 1680, percentage: 27 },
      { category: "transport", amount: 1120, percentage: 18 }, { category: "attractions", amount: 300, percentage: 5 },
      { category: "food", amount: 200, percentage: 3 },
    ],
    expenses: [
      { id: "jp-exp-1", tripId: "japan-2027", category: "flights", title: "Return flights to Tokyo", amount: 2940, currency: "EUR", paidBy: "Kamil", participantsCount: 4, costPerPerson: 735, status: "paid", date: "2026-11-18" },
      { id: "jp-exp-2", tripId: "japan-2027", category: "hotels", title: "Shinjuku hotel", amount: 1680, currency: "EUR", paidBy: "Anna", participantsCount: 4, costPerPerson: 420, status: "deposit", date: "2026-12-02" },
      { id: "jp-exp-3", tripId: "japan-2027", category: "transport", title: "Japan Rail Pass", amount: 1120, currency: "EUR", paidBy: "Kamil", participantsCount: 4, costPerPerson: 280, status: "unpaid" },
      { id: "jp-exp-4", tripId: "japan-2027", category: "attractions", title: "Museum and attraction tickets", amount: 300, currency: "EUR", paidBy: "Marek", participantsCount: 4, costPerPerson: 75, status: "paid" },
      { id: "jp-exp-5", tripId: "japan-2027", category: "food", title: "First dinner budget", amount: 200, currency: "EUR", paidBy: "Ola", participantsCount: 4, costPerPerson: 50, status: "unpaid", notes: "Placeholder estimate for arrival evening." },
    ],
    settlements: [
      { personName: "Marek", owesTo: "Kamil", amount: 1015, currency: "EUR", settled: false },
      { personName: "Ola", owesTo: "Anna", amount: 420, currency: "EUR", settled: false },
      { personName: "Anna", owesTo: "Kamil", amount: 280, currency: "EUR", settled: true },
    ],
  },
  "sicily-2026": {
    tripId: "sicily-2026", currency: "EUR", participantsCount: 2, totalBudget: 4200, totalSpent: 1570,
    costPerPerson: 785, paidPerPerson: 430, remainingPerPerson: 355,
    categories: [
      { category: "flights", amount: 410, percentage: 26 }, { category: "hotels", amount: 540, percentage: 34 },
      { category: "transport", amount: 620, percentage: 40 },
    ],
    expenses: [
      { id: "si-exp-1", tripId: "sicily-2026", category: "flights", title: "Flights to Palermo", amount: 410, currency: "EUR", paidBy: "Kamil", participantsCount: 2, costPerPerson: 205, status: "paid", date: "2026-03-10" },
      { id: "si-exp-2", tripId: "sicily-2026", category: "transport", title: "Road trip rental car", amount: 620, currency: "EUR", paidBy: "Anna", participantsCount: 2, costPerPerson: 310, status: "unpaid" },
      { id: "si-exp-3", tripId: "sicily-2026", category: "hotels", title: "Palermo boutique stay", amount: 540, currency: "EUR", paidBy: "Kamil", participantsCount: 2, costPerPerson: 270, status: "deposit", date: "2026-04-22" },
    ],
    settlements: [
      { personName: "Anna", owesTo: "Kamil", amount: 475, currency: "EUR", settled: false },
      { personName: "Kamil", owesTo: "Anna", amount: 310, currency: "EUR", settled: true },
    ],
  },
  "monaco-f1-weekend": {
    tripId: "monaco-f1-weekend", currency: "EUR", participantsCount: 3, totalBudget: 3900, totalSpent: 3000,
    costPerPerson: 1000, paidPerPerson: 680, remainingPerPerson: 320,
    categories: [
      { category: "attractions", amount: 1950, percentage: 65 }, { category: "hotels", amount: 960, percentage: 32 },
      { category: "transport", amount: 90, percentage: 3 },
    ],
    expenses: [
      { id: "mo-exp-1", tripId: "monaco-f1-weekend", category: "attractions", title: "Grand Prix tickets", amount: 1950, currency: "EUR", paidBy: "Marek", participantsCount: 3, costPerPerson: 650, status: "paid", date: "2025-12-14" },
      { id: "mo-exp-2", tripId: "monaco-f1-weekend", category: "hotels", title: "Nice Old Town hotel", amount: 960, currency: "EUR", paidBy: "Kamil", participantsCount: 3, costPerPerson: 320, status: "unpaid" },
      { id: "mo-exp-3", tripId: "monaco-f1-weekend", category: "transport", title: "Regional train passes", amount: 90, currency: "EUR", paidBy: "Ola", participantsCount: 3, costPerPerson: 30, status: "paid" },
    ],
    settlements: [
      { personName: "Ola", owesTo: "Marek", amount: 650, currency: "EUR", settled: false },
      { personName: "Marek", owesTo: "Kamil", amount: 320, currency: "EUR", settled: false },
      { personName: "Kamil", owesTo: "Ola", amount: 30, currency: "EUR", settled: true },
    ],
  },
  "new-york-2026": {
    tripId: "new-york-2026", currency: "USD", participantsCount: 2, totalBudget: 5600, totalSpent: 4010,
    costPerPerson: 2005, paidPerPerson: 1000, remainingPerPerson: 1005,
    categories: [
      { category: "flights", amount: 1480, percentage: 37 }, { category: "hotels", amount: 2240, percentage: 56 },
      { category: "attractions", amount: 290, percentage: 7 },
    ],
    expenses: [
      { id: "ny-exp-1", tripId: "new-york-2026", category: "flights", title: "Flights to New York", amount: 1480, currency: "USD", paidBy: "Kamil", participantsCount: 2, costPerPerson: 740, status: "paid", date: "2026-05-08" },
      { id: "ny-exp-2", tripId: "new-york-2026", category: "hotels", title: "Midtown Manhattan stay", amount: 2240, currency: "USD", paidBy: "Anna", participantsCount: 2, costPerPerson: 1120, status: "deposit", date: "2026-05-16" },
      { id: "ny-exp-3", tripId: "new-york-2026", category: "attractions", title: "Broadway tickets", amount: 290, currency: "USD", paidBy: "Kamil", participantsCount: 2, costPerPerson: 145, status: "unpaid" },
    ],
    settlements: [
      { personName: "Anna", owesTo: "Kamil", amount: 885, currency: "USD", settled: false },
      { personName: "Kamil", owesTo: "Anna", amount: 1120, currency: "USD", settled: false },
    ],
  },
};

export function getMockBudgetByTripId(tripId: string): TripBudget | undefined {
  return mockBudgets[tripId];
}
