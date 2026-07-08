import { CalendarDays, UserRound, Users } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type { PersistedBudgetExpense } from "@/features/budget/types/persisted-budget";

type PersistedBudgetExpenseCardProps = {
  expense: PersistedBudgetExpense;
  isPending?: boolean;
  onDelete?: (expense: PersistedBudgetExpense) => void;
  onEdit?: (expense: PersistedBudgetExpense) => void;
};

const statusDetails = {
  paid: { label: "Paid", variant: "success" as const },
  deposit: { label: "Deposit", variant: "warning" as const },
  unpaid: { label: "Unpaid", variant: "error" as const },
};

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function PersistedBudgetExpenseCard({ expense, isPending, onDelete, onEdit }: PersistedBudgetExpenseCardProps) {
  const status = statusDetails[expense.status || "paid"];
  const currency = expense.currency || "EUR";
  const participants = Math.max(expense.participants_count || 1, 1);

  return (
    <Card padding="sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {expense.category ? <Badge variant="outline" className="capitalize">{expense.category}</Badge> : null}
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <h3 className="mt-3 break-words font-semibold tracking-tight text-foreground">{expense.title}</h3>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
            {expense.paid_by_name ? <span className="inline-flex min-w-0 items-center gap-1.5"><UserRound className="size-3.5 shrink-0" /><span className="break-words">Paid by {expense.paid_by_name}</span></span> : null}
            <span className="inline-flex items-center gap-1.5"><Users className="size-3.5" />{participants} {participants === 1 ? "traveler" : "travelers"}</span>
            {expense.expense_date ? <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" />{formatDate(expense.expense_date)}</span> : null}
          </div>
          {expense.notes ? <p className="mt-3 break-words text-xs leading-relaxed text-muted">{expense.notes}</p> : null}
          {onEdit && onDelete ? (
            <div className="mt-4 flex flex-col gap-2 border-t border-border-subtle pt-3 sm:flex-row">
              <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => onEdit(expense)} disabled={isPending}>Edit</Button>
              <Button size="sm" variant="ghost" className="w-full text-error sm:w-auto" onClick={() => onDelete(expense)} disabled={isPending}>Delete</Button>
            </div>
          ) : null}
        </div>
        <div className="min-w-0 shrink-0 sm:text-right">
          <p className="break-words text-xl font-semibold tracking-tight text-foreground">{formatCurrency(expense.amount, currency)}</p>
          <p className="mt-1 text-xs text-muted">{formatCurrency(expense.amount / participants, currency)} / person</p>
        </div>
      </div>
    </Card>
  );
}
