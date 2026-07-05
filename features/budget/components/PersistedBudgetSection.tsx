"use client";

import { useActionState, useMemo, useState } from "react";
import { WalletCards } from "lucide-react";

import { Button, Card, EmptyState } from "@/components/ui";
import { createBudgetExpenseAction } from "@/features/budget/actions/budget-actions";
import { BudgetHeader } from "@/features/budget/components/BudgetHeader";
import { PersistedAddExpensePanel } from "@/features/budget/components/PersistedAddExpensePanel";
import { PersistedBudgetCategoryBreakdown } from "@/features/budget/components/PersistedBudgetCategoryBreakdown";
import { PersistedBudgetExpenseCard } from "@/features/budget/components/PersistedBudgetExpenseCard";
import { PersistedBudgetStats } from "@/features/budget/components/PersistedBudgetStats";
import type {
  CategoryTotal,
  CreateBudgetExpenseActionState,
  CurrencyTotal,
  PersistedBudgetExpense,
} from "@/features/budget/types/persisted-budget";

type PersistedBudgetSectionProps = {
  tripId: string;
  expenses: PersistedBudgetExpense[];
  loadError?: string;
};

const initialCreateState: CreateBudgetExpenseActionState = { status: "idle" };

function calculateSummaries(expenses: PersistedBudgetExpense[]) {
  const totals = new Map<string, CurrencyTotal>();
  const categoryAmounts = new Map<string, number>();

  expenses.forEach((expense) => {
    const currency = (expense.currency || "EUR").toUpperCase();
    const participants = Math.max(expense.participants_count || 1, 1);
    const current = totals.get(currency) || { currency, total: 0, sharedCost: 0, expenseCount: 0 };
    current.total += expense.amount;
    current.sharedCost += expense.amount / participants;
    current.expenseCount += 1;
    totals.set(currency, current);

    const category = expense.category || "other";
    const key = `${currency}:${category}`;
    categoryAmounts.set(key, (categoryAmounts.get(key) || 0) + expense.amount);
  });

  const categories: CategoryTotal[] = Array.from(categoryAmounts, ([key, amount]) => {
    const [currency, category] = key.split(":");
    const currencyTotal = totals.get(currency)?.total || 0;
    return {
      currency,
      category,
      amount,
      percentage: currencyTotal ? Math.round((amount / currencyTotal) * 100) : 0,
    };
  });

  return { totals: Array.from(totals.values()), categories };
}

export function PersistedBudgetSection({ tripId, expenses, loadError }: PersistedBudgetSectionProps) {
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [createState, createAction, isPending] = useActionState(
    createBudgetExpenseAction,
    initialCreateState,
  );
  const summaries = useMemo(() => calculateSummaries(expenses), [expenses]);

  return (
    <section className="space-y-6">
      <BudgetHeader onAddExpense={() => setIsAddPanelOpen(true)} />
      {isAddPanelOpen ? (
        <PersistedAddExpensePanel
          tripId={tripId}
          actionState={createState}
          formAction={createAction}
          isPending={isPending}
          onClose={() => setIsAddPanelOpen(false)}
        />
      ) : null}
      {loadError ? <Card padding="sm" className="text-sm text-error">{loadError}</Card> : null}

      {!expenses.length ? (
        <EmptyState
          icon={WalletCards}
          title="No expenses yet"
          description="Add the first expense to start tracking trip costs."
          action={<Button onClick={() => setIsAddPanelOpen(true)}>Add first expense</Button>}
        />
      ) : (
        <>
          <PersistedBudgetStats totals={summaries.totals} />
          <PersistedBudgetCategoryBreakdown categories={summaries.categories} />
          <section className="space-y-3" aria-label="Saved expenses">
            {expenses.map((expense) => <PersistedBudgetExpenseCard key={expense.id} expense={expense} />)}
          </section>
        </>
      )}
    </section>
  );
}
