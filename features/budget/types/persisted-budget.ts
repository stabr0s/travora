import type { BudgetCategory, ExpenseStatus } from "@/features/budget/types/budget";
import type { Database } from "@/types/database";

export type PersistedBudgetExpense =
  Database["public"]["Tables"]["budget_expenses"]["Row"];

export type CreateBudgetExpenseInput = {
  tripId: string;
  title: string;
  amount: number;
  category?: BudgetCategory;
  currency?: string;
  paidByName?: string;
  participantsCount?: number;
  status?: ExpenseStatus;
  expenseDate?: string;
  notes?: string;
};

export type CurrencyTotal = {
  currency: string;
  total: number;
  sharedCost: number;
  expenseCount: number;
};

export type CategoryTotal = {
  currency: string;
  category: string;
  amount: number;
  percentage: number;
};

export type BudgetServiceResult<T> =
  | { data: T; error: null }
  | {
      data: null;
      error: {
        code: "AUTH_REQUIRED" | "INVALID_TRIP" | "LOAD_FAILED" | "CREATE_FAILED";
        message: string;
      };
    };

export type CreateBudgetExpenseActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};
