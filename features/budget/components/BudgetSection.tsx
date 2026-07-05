"use client";

import { useState } from "react";
import { WalletCards } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { AddExpensePanel } from "@/features/budget/components/AddExpensePanel";
import { BudgetCategoryBreakdown } from "@/features/budget/components/BudgetCategoryBreakdown";
import { BudgetExpensesList } from "@/features/budget/components/BudgetExpensesList";
import { BudgetHeader } from "@/features/budget/components/BudgetHeader";
import { BudgetPerPersonCard } from "@/features/budget/components/BudgetPerPersonCard";
import { BudgetProgressCard } from "@/features/budget/components/BudgetProgressCard";
import { BudgetStats } from "@/features/budget/components/BudgetStats";
import { SettlementSummary } from "@/features/budget/components/SettlementSummary";
import { getMockBudgetByTripId } from "@/features/budget/data/mock-budget";

type BudgetSectionProps = {
  tripId: string;
};

export function BudgetSection({ tripId }: BudgetSectionProps) {
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const budget = getMockBudgetByTripId(tripId);

  if (!budget || budget.expenses.length === 0) {
    return (
      <section className="space-y-6">
        <BudgetHeader onAddExpense={() => setIsAddPanelOpen(true)} />
        {isAddPanelOpen ? (
          <AddExpensePanel onClose={() => setIsAddPanelOpen(false)} />
        ) : null}
        <EmptyState
          icon={WalletCards}
          title="No budget data yet"
          description="Expenses and per-person costs will appear here once this trip has budget data."
          className="min-h-96"
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <BudgetHeader onAddExpense={() => setIsAddPanelOpen(true)} />

      {isAddPanelOpen ? (
        <AddExpensePanel onClose={() => setIsAddPanelOpen(false)} />
      ) : null}

      <BudgetStats budget={budget} />

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3"><BudgetProgressCard budget={budget} /></div>
        <div className="xl:col-span-2"><BudgetPerPersonCard budget={budget} /></div>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <BudgetCategoryBreakdown categories={budget.categories} currency={budget.currency} />
        </div>
        <div className="xl:col-span-2"><SettlementSummary settlements={budget.settlements} /></div>
      </div>

      <BudgetExpensesList expenses={budget.expenses} />
    </section>
  );
}
