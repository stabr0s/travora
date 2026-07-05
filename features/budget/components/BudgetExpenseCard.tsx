import { CalendarDays, UserRound, Users } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type {
  BudgetExpense,
  ExpenseStatus,
} from "@/features/budget/types/budget";

const statusDetails: Record<
  ExpenseStatus,
  { label: string; variant: "success" | "warning" | "error" }
> = {
  paid: { label: "Paid", variant: "success" },
  deposit: { label: "Deposit", variant: "warning" },
  unpaid: { label: "Unpaid", variant: "error" },
};

const categoryLabels: Record<BudgetExpense["category"], string> = {
  flights: "Flights", hotels: "Hotels", transport: "Transport",
  attractions: "Attractions", insurance: "Insurance", food: "Food", other: "Other",
};

type BudgetExpenseCardProps = {
  expense: BudgetExpense;
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function BudgetExpenseCard({ expense }: BudgetExpenseCardProps) {
  const status = statusDetails[expense.status];

  return (
    <Card padding="sm" className="hover:shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{categoryLabels[expense.category]}</Badge>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <h3 className="mt-3 font-semibold tracking-tight text-foreground">{expense.title}</h3>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5"><UserRound className="size-3.5" />Paid by {expense.paidBy}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="size-3.5" />{expense.participantsCount} travelers</span>
            {expense.date ? <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" />{formatDate(expense.date)}</span> : null}
          </div>
          {expense.notes ? <p className="mt-3 text-xs leading-relaxed text-muted">{expense.notes}</p> : null}
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="text-xl font-semibold tracking-tight text-foreground">
            {formatCurrency(expense.amount, expense.currency)}
          </p>
          <p className="mt-1 text-xs text-muted">
            {formatCurrency(expense.costPerPerson, expense.currency)} / person
          </p>
        </div>
      </div>
    </Card>
  );
}
