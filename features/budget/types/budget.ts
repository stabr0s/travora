export type BudgetCategory =
  | "flights"
  | "hotels"
  | "transport"
  | "attractions"
  | "insurance"
  | "food"
  | "other";

export type ExpenseStatus = "paid" | "deposit" | "unpaid";

export type BudgetCategoryTotal = {
  category: BudgetCategory;
  amount: number;
  percentage: number;
};

export type BudgetExpense = {
  id: string;
  tripId: string;
  category: BudgetCategory;
  title: string;
  amount: number;
  currency: string;
  paidBy: string;
  participantsCount: number;
  costPerPerson: number;
  status: ExpenseStatus;
  date?: string;
  notes?: string;
};

export type BudgetSettlement = {
  personName: string;
  owesTo: string;
  amount: number;
  currency: string;
  settled: boolean;
};

export type TripBudget = {
  tripId: string;
  currency: string;
  participantsCount: number;
  totalBudget: number;
  totalSpent: number;
  costPerPerson: number;
  paidPerPerson: number;
  remainingPerPerson: number;
  categories: BudgetCategoryTotal[];
  expenses: BudgetExpense[];
  settlements: BudgetSettlement[];
};
