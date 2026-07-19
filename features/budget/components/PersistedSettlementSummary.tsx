import { ArrowRightLeft, Info } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { BudgetSettlementCurrencySummary } from "@/features/budget/types/persisted-budget";

type PersistedSettlementSummaryProps = {
  summaries: BudgetSettlementCurrencySummary[];
};

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function PersistedSettlementSummary({ summaries }: PersistedSettlementSummaryProps) {
  const hasAssignedExpenses = summaries.some((summary) => summary.assignedExpenseCount > 0);
  const hasUnassignedExpenses = summaries.some((summary) => summary.unassignedExpenseCount > 0);

  return (
    <Card padding="md" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Who owes whom</p>
          <p className="mt-1 text-sm text-muted">
            Equal split suggestions are calculated separately per currency. Currencies are not converted.
          </p>
        </div>
        <Badge variant="outline">Settlements MVP</Badge>
      </div>

      {!hasAssignedExpenses ? (
        <div className="rounded-2xl bg-surface px-4 py-4 text-sm text-muted">
          Add a payer and split participants to expenses to see suggested settlements.
        </div>
      ) : (
        <div className="space-y-4">
          {summaries.filter((summary) => summary.assignedExpenseCount > 0).map((summary) => (
            <section key={summary.currency} className="space-y-3 rounded-2xl border border-border-subtle p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-foreground">{summary.currency}</p>
                <p className="text-xs text-muted">{summary.assignedExpenseCount} assigned expenses</p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {summary.balances.map((person) => (
                  <div key={person.userId} className="rounded-xl bg-surface px-3 py-3 text-sm">
                    <p className="break-words font-medium text-foreground">{person.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      Paid {formatCurrency(person.paid, summary.currency)} · Owes {formatCurrency(person.owed, summary.currency)}
                    </p>
                    <p className={person.balance >= 0 ? "mt-2 text-sm font-semibold text-success" : "mt-2 text-sm font-semibold text-error"}>
                      {person.balance >= 0 ? "+" : ""}{formatCurrency(person.balance, summary.currency)}
                    </p>
                  </div>
                ))}
              </div>

              {summary.suggestions.length ? (
                <div className="space-y-2">
                  {summary.suggestions.map((suggestion) => (
                    <div
                      key={`${suggestion.fromUserId}-${suggestion.toUserId}-${suggestion.amount}`}
                      className="flex flex-col gap-2 rounded-xl bg-background px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="inline-flex min-w-0 items-center gap-2">
                        <ArrowRightLeft className="size-4 shrink-0 text-muted" />
                        <span className="break-words text-foreground">
                          {suggestion.fromName} pays {suggestion.toName}
                        </span>
                      </span>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(suggestion.amount, summary.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">Everyone is balanced for this currency.</p>
              )}
            </section>
          ))}
        </div>
      )}

      {hasUnassignedExpenses ? (
        <p className="inline-flex items-start gap-2 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          Some expenses are unassigned and are not included in settlements yet.
        </p>
      ) : null}
    </Card>
  );
}
