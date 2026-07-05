import { CheckCircle2, HandCoins } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { BudgetSettlement } from "@/features/budget/types/budget";

type SettlementSummaryProps = {
  settlements: BudgetSettlement[];
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SettlementSummary({
  settlements,
}: SettlementSummaryProps) {
  return (
    <Card padding="md" className="hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <HandCoins className="size-5 text-primary" />
          </span>
          <div>
            <h2 className="font-semibold tracking-tight text-foreground">Settlement summary</h2>
            <p className="mt-1 text-sm text-muted">Mock repayment status between travelers.</p>
          </div>
        </div>
        <Badge variant="outline">Preview only</Badge>
      </div>

      <div className="mt-5 space-y-3">
        {settlements.map((settlement) => (
          <div key={`${settlement.personName}-${settlement.owesTo}`} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {settlement.personName} → {settlement.owesTo}
              </p>
              <p className="mt-1 text-xs text-muted">Mock participant settlement</p>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(settlement.amount, settlement.currency)}
              </p>
              <Badge variant={settlement.settled ? "success" : "warning"}>
                {settlement.settled ? <CheckCircle2 className="mr-1 size-3" /> : null}
                {settlement.settled ? "Settled" : "Not settled"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
