import { ReceiptText } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { BudgetExpenseCard } from "@/features/budget/components/BudgetExpenseCard";
import type { BudgetExpense } from "@/features/budget/types/budget";

type BudgetExpensesListProps = {
  expenses: BudgetExpense[];
};

export function BudgetExpensesList({ expenses }: BudgetExpensesListProps) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        icon={ReceiptText}
        title="No expenses yet"
        description="Trip costs will appear here once expenses are available."
        className="min-h-80"
      />
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Expenses</h2>
        <p className="mt-1 text-sm text-muted">Mock costs currently included in this trip budget.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {expenses.map((expense) => (
          <BudgetExpenseCard key={expense.id} expense={expense} />
        ))}
      </div>
    </section>
  );
}
