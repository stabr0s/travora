import { randomUUID } from "node:crypto";

import type {
  BudgetServiceResult,
  CreateBudgetExpenseInput,
  DeleteBudgetExpenseInput,
  PersistedBudgetExpense,
  UpdateBudgetExpenseInput,
} from "@/features/budget/types/persisted-budget";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";
import type { Database } from "@/types/database";

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

function logBudgetError(operation: string, error: SupabaseDiagnostic) {
  if (process.env.NODE_ENV !== "development") return;

  console.error(`[Budget] ${operation}`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
}

async function getAuthContext() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  return { supabase, user: data.user };
}

export async function getBudgetExpensesForTrip(
  tripId: string,
): Promise<BudgetServiceResult<PersistedBudgetExpense[]>> {
  if (!isUuid(tripId)) {
    return {
      data: null,
      error: { code: "INVALID_TRIP", message: "This saved trip is not available." },
    };
  }

  const { supabase, user } = await getAuthContext();

  if (!user) {
    return {
      data: null,
      error: { code: "AUTH_REQUIRED", message: "Sign in to view saved expenses." },
    };
  }

  const { data, error } = await supabase
    .from("budget_expenses")
    .select("*")
    .eq("trip_id", tripId)
    .order("expense_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    logBudgetError("expenses query failed", error);
    return {
      data: null,
      error: { code: "LOAD_FAILED", message: "We couldn't load expenses for this trip." },
    };
  }

  return { data, error: null };
}

export async function createBudgetExpense(
  input: CreateBudgetExpenseInput,
): Promise<BudgetServiceResult<PersistedBudgetExpense>> {
  if (!isUuid(input.tripId) || !input.title.trim()) {
    return {
      data: null,
      error: { code: "INVALID_TRIP", message: "Choose a saved trip and enter a title." },
    };
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0
    || !Number.isInteger(input.participantsCount ?? 1) || (input.participantsCount ?? 1) < 1) {
    return {
      data: null,
      error: { code: "CREATE_FAILED", message: "Enter a valid amount and participant count." },
    };
  }

  const { supabase, user } = await getAuthContext();

  if (!user) {
    return {
      data: null,
      error: { code: "AUTH_REQUIRED", message: "Sign in to save expenses." },
    };
  }

  const expenseId = randomUUID();
  const payload: Database["public"]["Tables"]["budget_expenses"]["Insert"] = {
    id: expenseId,
    trip_id: input.tripId,
    category: input.category || null,
    title: input.title.trim(),
    amount: input.amount,
    currency: input.currency || "EUR",
    paid_by_name: input.paidByName || null,
    participants_count: input.participantsCount ?? 1,
    status: input.status || "paid",
    expense_date: input.expenseDate || null,
    notes: input.notes || null,
  };

  const { error: insertError } = await supabase.from("budget_expenses").insert(payload);

  if (insertError) {
    logBudgetError("expense insert failed", insertError);
    return {
      data: null,
      error: { code: "CREATE_FAILED", message: "We couldn't save this expense." },
    };
  }

  const { data: expense, error: readError } = await supabase
    .from("budget_expenses")
    .select("*")
    .eq("id", expenseId)
    .single();

  if (readError) logBudgetError("created expense readback failed", readError);

  const fallbackExpense: PersistedBudgetExpense = {
    id: expenseId,
    trip_id: input.tripId,
    category: input.category || null,
    title: input.title.trim(),
    amount: input.amount,
    currency: input.currency || "EUR",
    paid_by_name: input.paidByName || null,
    participants_count: input.participantsCount ?? 1,
    status: input.status || "paid",
    expense_date: input.expenseDate || null,
    notes: input.notes || null,
    created_at: null,
    updated_at: null,
  };

  return { data: expense || fallbackExpense, error: null };
}

export async function updateBudgetExpense(
  input: UpdateBudgetExpenseInput,
): Promise<BudgetServiceResult<PersistedBudgetExpense>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (!isUuid(input.id) || !input.title.trim()) {
    return { data: null, error: { code: "INVALID_RECORD", message: "Choose a valid expense and enter its title." } };
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0
    || !Number.isInteger(input.participantsCount ?? 1) || (input.participantsCount ?? 1) < 1) {
    return { data: null, error: { code: "UPDATE_FAILED", message: "Enter a valid amount and participant count." } };
  }

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to edit expenses." } };

  const payload: Database["public"]["Tables"]["budget_expenses"]["Update"] = {
    category: input.category || null,
    title: input.title.trim(),
    amount: input.amount,
    currency: input.currency || "EUR",
    paid_by_name: input.paidByName || null,
    participants_count: input.participantsCount ?? 1,
    status: input.status || "paid",
    expense_date: input.expenseDate || null,
    notes: input.notes || null,
  };
  const { error } = await supabase.from("budget_expenses").update(payload)
    .eq("id", input.id).eq("trip_id", input.tripId);
  if (error) {
    logBudgetError("expense update failed", error);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't update this expense." } };
  }

  const { data, error: readError } = await supabase.from("budget_expenses").select("*")
    .eq("id", input.id).eq("trip_id", input.tripId).maybeSingle();
  if (readError || !data) {
    if (readError) logBudgetError("updated expense readback failed", readError);
    return { data: null, error: { code: "UPDATE_FAILED", message: "We couldn't confirm the expense update." } };
  }
  return { data, error: null };
}

export async function deleteBudgetExpense(
  input: DeleteBudgetExpenseInput,
): Promise<BudgetServiceResult<null>> {
  if (!isUuid(input.tripId)) return { data: null, error: { code: "INVALID_TRIP", message: "This saved trip is not available." } };
  if (!isUuid(input.id)) return { data: null, error: { code: "INVALID_RECORD", message: "This expense is not available." } };

  const { supabase, user } = await getAuthContext();
  if (!user) return { data: null, error: { code: "AUTH_REQUIRED", message: "Sign in to delete expenses." } };

  const { error } = await supabase.from("budget_expenses").delete()
    .eq("id", input.id).eq("trip_id", input.tripId);
  if (error) {
    logBudgetError("expense delete failed", error);
    return { data: null, error: { code: "DELETE_FAILED", message: "We couldn't delete this expense." } };
  }
  return { data: null, error: null };
}
