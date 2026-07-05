import { CircleDollarSign, HandCoins, ReceiptText, WalletCards } from "lucide-react";

import { Card } from "@/components/ui";
import type { TripBudget } from "@/features/budget/types/budget";

type BudgetStatsProps = {
  budget: TripBudget;
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BudgetStats({ budget }: BudgetStatsProps) {
  const stats = [
    { label: "Total spent", value: budget.totalSpent, icon: ReceiptText },
    { label: "Cost per person", value: budget.costPerPerson, icon: CircleDollarSign },
    { label: "Paid per person", value: budget.paidPerPerson, icon: WalletCards },
    { label: "Remaining per person", value: budget.remainingPerPerson, icon: HandCoins },
  ];

  return (
    <section aria-label="Budget statistics" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} padding="sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted sm:text-sm">{stat.label}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {formatCurrency(stat.value, budget.currency)}
                </p>
              </div>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
                <Icon className="size-4 text-primary" strokeWidth={1.75} />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
