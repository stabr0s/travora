import { UserRound } from "lucide-react";

import { Card } from "@/components/ui";
import type { TripBudget } from "@/features/budget/types/budget";

type BudgetPerPersonCardProps = {
  budget: TripBudget;
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BudgetPerPersonCard({ budget }: BudgetPerPersonCardProps) {
  return (
    <Card padding="md" className="h-full bg-primary text-primary-foreground hover:shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white/70">Cost per person</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">
            {formatCurrency(budget.costPerPerson, budget.currency)}
          </p>
        </div>
        <span className="flex size-11 items-center justify-center rounded-xl bg-white/10">
          <UserRound className="size-5" />
        </span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
        <div>
          <p className="text-xs text-white/60">Paid</p>
          <p className="mt-1 text-lg font-semibold">{formatCurrency(budget.paidPerPerson, budget.currency)}</p>
        </div>
        <div>
          <p className="text-xs text-white/60">Remaining</p>
          <p className="mt-1 text-lg font-semibold">{formatCurrency(budget.remainingPerPerson, budget.currency)}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-white/60">Based on {budget.participantsCount} travelers</p>
    </Card>
  );
}
