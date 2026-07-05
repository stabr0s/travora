import { ReceiptText, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { CreateBudgetExpenseActionState } from "@/features/budget/types/persisted-budget";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type PersistedAddExpensePanelProps = {
  tripId: string;
  actionState: CreateBudgetExpenseActionState;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  onClose: () => void;
};

export function PersistedAddExpensePanel({ tripId, actionState, formAction, isPending, onClose }: PersistedAddExpensePanelProps) {
  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <form action={formAction}>
        <input type="hidden" name="tripId" value={tripId} />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle"><ReceiptText className="size-5 text-primary" /></span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Add expense</h2>
              <p className="mt-1 text-sm text-muted">Save a cost without payments or settlement processing.</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close add expense panel"><X className="size-4" /></Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground sm:col-span-2">Title<input className={fieldClassName} name="title" type="text" placeholder="e.g. Apartment deposit" required /></label>
          <label className="text-sm font-medium text-foreground">Category<select className={fieldClassName} defaultValue="hotels" name="category"><option value="flights">Flights</option><option value="hotels">Hotels</option><option value="transport">Transport</option><option value="attractions">Attractions</option><option value="insurance">Insurance</option><option value="food">Food</option><option value="other">Other</option></select></label>
          <label className="text-sm font-medium text-foreground">Paid by<input className={fieldClassName} name="paidByName" type="text" placeholder="Traveler name" /></label>
          <label className="text-sm font-medium text-foreground">Amount<input className={fieldClassName} name="amount" type="number" min="0.01" step="0.01" placeholder="0" required /></label>
          <label className="text-sm font-medium text-foreground">Currency<select className={fieldClassName} defaultValue="EUR" name="currency"><option value="EUR">EUR</option><option value="USD">USD</option><option value="PLN">PLN</option><option value="JPY">JPY</option></select></label>
          <label className="text-sm font-medium text-foreground">Participants<input className={fieldClassName} defaultValue="1" name="participantsCount" type="number" min="1" step="1" required /></label>
          <label className="text-sm font-medium text-foreground">Status<select className={fieldClassName} defaultValue="paid" name="status"><option value="paid">Paid</option><option value="deposit">Deposit</option><option value="unpaid">Unpaid</option></select></label>
          <label className="text-sm font-medium text-foreground sm:col-span-2">Expense date<input className={fieldClassName} name="expenseDate" type="date" /></label>
          <label className="text-sm font-medium text-foreground sm:col-span-2">Notes<textarea className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15" name="notes" placeholder="Optional expense context" /></label>
        </div>

        {actionState.message ? <p role={actionState.status === "error" ? "alert" : "status"} className={actionState.status === "error" ? "mt-5 rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error" : "mt-5 rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"}>{actionState.message}</p> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" size="md" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="md" disabled={isPending}>{isPending ? "Saving expense…" : "Save expense"}</Button>
        </div>
      </form>
    </Card>
  );
}
