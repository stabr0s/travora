import { ChartNoAxesColumnIncreasing } from "lucide-react";

import { Card, Progress } from "@/components/ui";
import type { BudgetCategoryTotal } from "@/features/budget/types/budget";

const categoryLabels: Record<BudgetCategoryTotal["category"], string> = {
  flights: "Flights", hotels: "Hotels", transport: "Transport",
  attractions: "Attractions", insurance: "Insurance", food: "Food", other: "Other",
};

type BudgetCategoryBreakdownProps = {
  categories: BudgetCategoryTotal[];
  currency: string;
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BudgetCategoryBreakdown({
  categories,
  currency,
}: BudgetCategoryBreakdownProps) {
  return (
    <Card padding="md" className="hover:shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
          <ChartNoAxesColumnIncreasing className="size-5 text-primary" />
        </span>
        <div>
          <h2 className="font-semibold tracking-tight text-foreground">Category breakdown</h2>
          <p className="mt-1 text-sm text-muted">Where the current trip spending goes.</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {categories.map((category) => (
          <div key={category.category} className="space-y-2">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-medium text-foreground">{categoryLabels[category.category]}</span>
              <span className="text-muted">
                {formatCurrency(category.amount, currency)} · {category.percentage}%
              </span>
            </div>
            <Progress value={category.percentage} />
          </div>
        ))}
      </div>
    </Card>
  );
}
