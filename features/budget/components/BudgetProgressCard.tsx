import { Target } from "lucide-react";

import { Badge, Card, Progress } from "@/components/ui";
import type { TripBudget } from "@/features/budget/types/budget";

type BudgetProgressCardProps = {
  budget: TripBudget;
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BudgetProgressCard({ budget }: BudgetProgressCardProps) {
  const percentage = budget.totalBudget > 0
    ? Math.min(100, Math.round((budget.totalSpent / budget.totalBudget) * 100))
    : 0;

  return (
    <Card padding="md" className="h-full hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <Target className="size-5 text-primary" />
          </span>
          <div>
            <h2 className="font-semibold tracking-tight text-foreground">Budget progress</h2>
            <p className="mt-1 text-sm text-muted">Spending against the current trip budget.</p>
          </div>
        </div>
        <Badge variant={percentage >= 85 ? "warning" : "success"}>{percentage}% used</Badge>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-muted">Spent</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {formatCurrency(budget.totalSpent, budget.currency)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">Total budget</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {formatCurrency(budget.totalBudget, budget.currency)}
          </p>
        </div>
      </div>

      <Progress
        value={percentage}
        className="mt-6 h-3"
        indicatorClassName={percentage >= 85 ? "bg-warning" : "bg-success"}
      />
    </Card>
  );
}
