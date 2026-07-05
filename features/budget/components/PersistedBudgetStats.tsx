import { CircleDollarSign, ReceiptText } from "lucide-react";

import { Card } from "@/components/ui";
import type { CurrencyTotal } from "@/features/budget/types/persisted-budget";

type PersistedBudgetStatsProps = { totals: CurrencyTotal[] };

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function PersistedBudgetStats({ totals }: PersistedBudgetStatsProps) {
  return (
    <section aria-label="Budget totals" className="grid gap-4 md:grid-cols-2">
      {totals.map((total) => (
        <Card key={total.currency} padding="sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted">Total spent · {total.currency}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {formatCurrency(total.total, total.currency)}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
                <CircleDollarSign className="size-3.5" />
                {formatCurrency(total.sharedCost, total.currency)} summed per-person shares
              </p>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
              <ReceiptText className="size-4 text-primary" />
            </span>
          </div>
          <p className="mt-3 text-xs text-muted">{total.expenseCount} {total.expenseCount === 1 ? "expense" : "expenses"}</p>
        </Card>
      ))}
    </section>
  );
}
