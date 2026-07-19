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
  paidByUserId?: string | null;
  participantsCount?: number;
  splitBetweenUserIds?: string[] | null;
  splitType?: "equal";
  status?: ExpenseStatus;
  expenseDate?: string;
  notes?: string;
};

export type UpdateBudgetExpenseInput = CreateBudgetExpenseInput & { id: string };

export type DeleteBudgetExpenseInput = { tripId: string; id: string };

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

export type BudgetParticipantOption = {
  userId: string;
  name: string;
};

export type BudgetPersonBalance = {
  userId: string;
  name: string;
  paid: number;
  owed: number;
  balance: number;
};

export type BudgetSettlementSuggestion = {
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  amount: number;
};

export type BudgetSettlementCurrencySummary = {
  currency: string;
  balances: BudgetPersonBalance[];
  suggestions: BudgetSettlementSuggestion[];
  assignedExpenseCount: number;
  unassignedExpenseCount: number;
};

export type BudgetServiceResult<T> =
  | { data: T; error: null }
  | {
      data: null;
      error: {
        code:
          | "AUTH_REQUIRED"
          | "INVALID_TRIP"
          | "INVALID_RECORD"
          | "LOAD_FAILED"
          | "CREATE_FAILED"
          | "UPDATE_FAILED"
          | "DELETE_FAILED";
        message: string;
      };
    };

export type CreateBudgetExpenseActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};
