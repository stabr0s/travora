"use client";

import { useActionState } from "react";
import { ReceiptText, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import {
  createBudgetExpenseAction,
  updateBudgetExpenseAction,
} from "@/features/budget/actions/budget-actions";
import type {
  BudgetParticipantOption,
  CreateBudgetExpenseActionState,
  PersistedBudgetExpense,
} from "@/features/budget/types/persisted-budget";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type PersistedAddExpensePanelProps = {
  tripId: string;
  expense?: PersistedBudgetExpense | null;
  tripCurrency?: string;
  participants: BudgetParticipantOption[];
  currentUserId: string | null;
  onClose: () => void;
};

const initialState: CreateBudgetExpenseActionState = { status: "idle" };

export function PersistedAddExpensePanel({
  tripId,
  expense,
  tripCurrency,
  participants,
  currentUserId,
  onClose,
}: PersistedAddExpensePanelProps) {
  const isEditing = Boolean(expense);
  const defaultCurrency = expense?.currency || tripCurrency || "EUR";
  const currentUserIsParticipant = participants.some((participant) => participant.userId === currentUserId);
  const defaultPayerId = expense?.paid_by_user_id || (currentUserIsParticipant ? currentUserId : "") || "";
  const splitIds = new Set(expense?.split_between_user_ids || []);
  const [actionState, formAction, isPending] = useActionState(
    isEditing ? updateBudgetExpenseAction : createBudgetExpenseAction,
    initialState,
  );

  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <form action={formAction}>
        <input type="hidden" name="tripId" value={tripId} />
        {expense ? <input type="hidden" name="recordId" value={expense.id} /> : null}
        <input type="hidden" name="paidByName" value={expense?.paid_by_name || ""} />
        <input type="hidden" name="participantsCount" value={expense?.participants_count || participants.length || 1} />
        <input type="hidden" name="splitSelectionSubmitted" value="1" />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle"><ReceiptText className="size-5 text-primary" /></span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{isEditing ? "Edit expense" : "Add expense"}</h2>
              <p className="mt-1 text-sm text-muted">{isEditing ? "Update this saved trip cost and its equal split." : "Save a shared cost without payments or settlement processing."}</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close add expense panel"><X className="size-4" /></Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground sm:col-span-2">Title<input className={fieldClassName} defaultValue={expense?.title} name="title" type="text" placeholder="e.g. Apartment deposit" required /></label>
          <label className="text-sm font-medium text-foreground">Category<select className={fieldClassName} defaultValue={expense?.category || "hotels"} name="category"><option value="flights">Flights</option><option value="hotels">Hotels</option><option value="transport">Transport</option><option value="attractions">Attractions</option><option value="insurance">Insurance</option><option value="food">Food</option><option value="other">Other</option></select></label>
          <label className="text-sm font-medium text-foreground">Paid by<select className={fieldClassName} defaultValue={defaultPayerId} name="paidByUserId"><option value="">Unassigned</option>{participants.map((participant) => <option key={participant.userId} value={participant.userId}>{participant.name}</option>)}</select><span className="mt-1 block text-xs text-muted">Unassigned expenses are saved, but they are not included in settlement suggestions.</span></label>
          <label className="text-sm font-medium text-foreground">Amount<input className={fieldClassName} defaultValue={expense?.amount} name="amount" type="number" min="0.01" step="0.01" placeholder="0" required /></label>
          <label className="text-sm font-medium text-foreground">Currency<input className={fieldClassName} defaultValue={defaultCurrency} list="budget-currency-options" maxLength={12} name="currency" type="text" placeholder="EUR" required /><datalist id="budget-currency-options"><option value="EUR" /><option value="USD" /><option value="PLN" /><option value="JOD" /><option value="CNY" /><option value="MAD" /></datalist><span className="mt-1 block text-xs text-muted">Currency defaults from trip settings. Custom codes are supported.</span></label>
          <label className="text-sm font-medium text-foreground">Status<select className={fieldClassName} defaultValue={expense?.status || "paid"} name="status"><option value="paid">Paid</option><option value="deposit">Deposit</option><option value="unpaid">Unpaid</option></select></label>
          <label className="text-sm font-medium text-foreground sm:col-span-2">Expense date<input className={fieldClassName} defaultValue={expense?.expense_date || ""} name="expenseDate" type="date" /></label>
          <div className="space-y-3 text-sm font-medium text-foreground sm:col-span-2">
            <div>
              <p>Split between</p>
              <p className="mt-1 text-xs font-normal text-muted">Split equally between selected people.</p>
              <p className="mt-1 text-xs font-normal text-muted">Expenses without split participants are not included in settlement suggestions.</p>
            </div>
            {participants.length ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {participants.map((participant) => {
                  const isChecked = isEditing ? splitIds.has(participant.userId) : true;
                  return (
                    <label key={participant.userId} className="flex min-w-0 items-center gap-3 rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm font-normal text-foreground">
                      <input
                        className="size-4 rounded border-border text-primary"
                        defaultChecked={isChecked}
                        name="splitBetweenUserIds"
                        type="checkbox"
                        value={participant.userId}
                      />
                      <span className="break-words">{participant.name}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl bg-surface px-3 py-3 text-xs font-normal text-muted">
                Add active trip participants to calculate settlements.
              </p>
            )}
          </div>
          <label className="text-sm font-medium text-foreground sm:col-span-2">Notes<textarea className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15" defaultValue={expense?.notes || ""} name="notes" placeholder="Optional expense context" /></label>
        </div>

        {actionState.message ? <p role={actionState.status === "error" ? "alert" : "status"} className={actionState.status === "error" ? "mt-5 rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error" : "mt-5 rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"}>{actionState.message}</p> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" size="md" className="w-full sm:w-auto" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="md" className="w-full sm:w-auto" disabled={isPending}>{isPending ? "Saving expense…" : isEditing ? "Update expense" : "Save expense"}</Button>
        </div>
      </form>
    </Card>
  );
}
