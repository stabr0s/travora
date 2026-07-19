"use client";

import { useMemo, useState, useTransition } from "react";
import { WalletCards } from "lucide-react";

import { Button, Card, EmptyState } from "@/components/ui";
import { deleteBudgetExpenseAction } from "@/features/budget/actions/budget-actions";
import { BudgetHeader } from "@/features/budget/components/BudgetHeader";
import { PersistedAddExpensePanel } from "@/features/budget/components/PersistedAddExpensePanel";
import { PersistedBudgetCategoryBreakdown } from "@/features/budget/components/PersistedBudgetCategoryBreakdown";
import { PersistedBudgetExpenseCard } from "@/features/budget/components/PersistedBudgetExpenseCard";
import { PersistedBudgetStats } from "@/features/budget/components/PersistedBudgetStats";
import { PersistedSettlementSummary } from "@/features/budget/components/PersistedSettlementSummary";
import type { PersistedParticipant } from "@/features/participants/types/persisted-participant";
import { useScrollIntoViewOnOpen } from "@/hooks/useScrollIntoViewOnOpen";
import type {
  BudgetParticipantOption,
  CategoryTotal,
  CreateBudgetExpenseActionState,
  CurrencyTotal,
  PersistedBudgetExpense,
} from "@/features/budget/types/persisted-budget";
import { calculateBudgetSettlements } from "@/features/budget/utils/settlement-calculator";

type PersistedBudgetSectionProps = {
  tripId: string;
  expenses: PersistedBudgetExpense[];
  tripCurrency?: string;
  loadError?: string;
  canEditTrip: boolean;
  participants: PersistedParticipant[];
  currentUserId: string | null;
};

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

function getParticipantName(participant: PersistedParticipant) {
  return participant.fullName || participant.email || "Trip member";
}

export function PersistedBudgetSection({
  tripId,
  expenses,
  tripCurrency,
  loadError,
  canEditTrip,
  participants,
  currentUserId,
}: PersistedBudgetSectionProps) {
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<PersistedBudgetExpense | null>(null);
  const [message, setMessage] = useState<CreateBudgetExpenseActionState | null>(null);
  const [isPending, startTransition] = useTransition();
  const panelRef = useScrollIntoViewOnOpen<HTMLDivElement>(isAddPanelOpen);
  const summaries = useMemo(() => calculateSummaries(expenses), [expenses]);
  const activeParticipants = useMemo<BudgetParticipantOption[]>(() => (
    participants
      .filter((participant) => participant.status === "active")
      .map((participant) => ({ userId: participant.userId, name: getParticipantName(participant) }))
  ), [participants]);
  const settlementSummaries = useMemo(
    () => calculateBudgetSettlements(expenses, activeParticipants),
    [activeParticipants, expenses],
  );

  function openAddPanel() {
    setEditingExpense(null);
    setIsAddPanelOpen(true);
  }

  function handleDelete(expense: PersistedBudgetExpense) {
    if (!window.confirm(`Delete “${expense.title}”? This cannot be undone.`)) return;
    startTransition(async () => setMessage(await deleteBudgetExpenseAction(tripId, expense.id)));
  }

  return (
    <section className="space-y-6">
      <BudgetHeader onAddExpense={canEditTrip ? openAddPanel : undefined} />
      {isAddPanelOpen && canEditTrip ? (
        <div ref={panelRef}>
          <PersistedAddExpensePanel
            key={editingExpense?.id || "new"}
            tripId={tripId}
            expense={editingExpense}
            tripCurrency={tripCurrency}
            participants={activeParticipants}
            currentUserId={currentUserId}
            onClose={() => setIsAddPanelOpen(false)}
          />
        </div>
      ) : null}
      {loadError ? <Card padding="sm" className="text-sm text-error">{loadError}</Card> : !expenses.length ? (
        <EmptyState
          icon={WalletCards}
          title="No expenses yet"
          description="Track flights, stays, food, and shared costs here. Add the first expense when money starts moving."
          action={canEditTrip ? <Button onClick={openAddPanel}>Add first expense</Button> : undefined}
        />
      ) : (
        <>
          {message?.message ? <Card padding="sm" className={message.status === "error" ? "text-sm text-error" : "text-sm text-success"}>{message.message}</Card> : null}
          <PersistedBudgetStats totals={summaries.totals} />
          <PersistedBudgetCategoryBreakdown categories={summaries.categories} />
          <PersistedSettlementSummary summaries={settlementSummaries} />
          <section className="space-y-3" aria-label="Saved expenses">
            {expenses.map((expense) => (
              <PersistedBudgetExpenseCard
                key={expense.id}
                expense={expense}
                participants={activeParticipants}
                isPending={isPending}
                onEdit={canEditTrip ? (selected) => { setEditingExpense(selected); setIsAddPanelOpen(true); } : undefined}
                onDelete={canEditTrip ? handleDelete : undefined}
              />
            ))}
          </section>
        </>
      )}
    </section>
  );
}
