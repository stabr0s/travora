import { ChartNoAxesColumnIncreasing } from "lucide-react";

import { Card, Progress } from "@/components/ui";
import type { CategoryTotal } from "@/features/budget/types/persisted-budget";

type PersistedBudgetCategoryBreakdownProps = { categories: CategoryTotal[] };

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function PersistedBudgetCategoryBreakdown({
  categories,
}: PersistedBudgetCategoryBreakdownProps) {
  const currencies = Array.from(new Set(categories.map((category) => category.currency)));

  return (
    <Card padding="md">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
          <ChartNoAxesColumnIncreasing className="size-5 text-primary" />
        </span>
        <div>
          <h2 className="font-semibold tracking-tight text-foreground">Category breakdown</h2>
          <p className="mt-1 text-sm text-muted">Each currency is calculated separately.</p>
        </div>
      </div>

      <div className="mt-6 space-y-7">
        {currencies.map((currency) => (
          <section key={currency} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{currency}</h3>
            {categories.filter((item) => item.currency === currency).map((category) => (
              <div key={`${currency}-${category.category}`} className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium capitalize text-foreground">{category.category}</span>
                  <span className="text-muted">
                    {formatCurrency(category.amount, currency)} · {category.percentage}%
                  </span>
                </div>
                <Progress value={category.percentage} />
              </div>
            ))}
          </section>
        ))}
      </div>
    </Card>
  );
}
