"use server";

import { revalidatePath } from "next/cache";

import { createBudgetExpense } from "@/features/budget/services/budget-service";
import type { CreateBudgetExpenseActionState } from "@/features/budget/types/persisted-budget";
import type { BudgetCategory, ExpenseStatus } from "@/features/budget/types/budget";
import { isUuid } from "@/lib/validation/is-uuid";

const categories: BudgetCategory[] = ["flights", "hotels", "transport", "attractions", "insurance", "food", "other"];
const statuses: ExpenseStatus[] = ["paid", "deposit", "unpaid"];

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function createBudgetExpenseAction(
  _previousState: CreateBudgetExpenseActionState,
  formData: FormData,
): Promise<CreateBudgetExpenseActionState> {
  const tripId = readField(formData, "tripId");
  const title = readField(formData, "title");
  const amount = Number(readField(formData, "amount"));
  const participantsCount = Number(readField(formData, "participantsCount") || "1");
  const category = readField(formData, "category") as BudgetCategory;
  const status = readField(formData, "status") as ExpenseStatus;
  const expenseDate = readField(formData, "expenseDate");

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!title) return { status: "error", message: "Enter a title for this expense." };
  if (!Number.isFinite(amount) || amount <= 0) {
    return { status: "error", message: "Amount must be greater than zero." };
  }
  if (!Number.isInteger(participantsCount) || participantsCount < 1) {
    return { status: "error", message: "Participants count must be at least one." };
  }
  const parsedExpenseDate = expenseDate ? new Date(`${expenseDate}T00:00:00Z`) : null;
  if (expenseDate && (!/^\d{4}-\d{2}-\d{2}$/.test(expenseDate)
    || Number.isNaN(parsedExpenseDate?.getTime())
    || parsedExpenseDate?.toISOString().slice(0, 10) !== expenseDate)) {
    return { status: "error", message: "Enter a valid expense date." };
  }

  const result = await createBudgetExpense({
    tripId,
    title,
    amount,
    category: categories.includes(category) ? category : "other",
    currency: (readField(formData, "currency") || "EUR").toUpperCase(),
    paidByName: readField(formData, "paidByName"),
    participantsCount,
    status: statuses.includes(status) ? status : "paid",
    expenseDate,
    notes: readField(formData, "notes"),
  });

  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Expense saved to this trip." };
}
