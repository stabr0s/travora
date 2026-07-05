import { Info, ReceiptText, X } from "lucide-react";

import { Button, Card } from "@/components/ui";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type AddExpensePanelProps = {
  onClose: () => void;
};

export function AddExpensePanel({ onClose }: AddExpensePanelProps) {
  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <ReceiptText className="size-5 text-primary" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Add expense</h2>
            <p className="mt-1 text-sm text-muted">Preview the details kept with a shared trip cost.</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close add expense panel">
          <X className="size-4" />
        </Button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Title
          <input className={fieldClassName} type="text" placeholder="e.g. Apartment deposit" />
        </label>

        <label className="text-sm font-medium text-foreground">
          Category
          <select className={fieldClassName} defaultValue="hotels">
            <option value="flights">Flights</option><option value="hotels">Hotels</option>
            <option value="transport">Transport</option><option value="attractions">Attractions</option>
            <option value="insurance">Insurance</option><option value="food">Food</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          Paid by
          <input className={fieldClassName} type="text" placeholder="Traveler name" />
        </label>

        <label className="text-sm font-medium text-foreground">
          Amount
          <input className={fieldClassName} type="number" min="0" placeholder="0" />
        </label>

        <label className="text-sm font-medium text-foreground">
          Currency
          <select className={fieldClassName} defaultValue="EUR">
            <option value="EUR">EUR</option><option value="USD">USD</option>
            <option value="PLN">PLN</option><option value="JPY">JPY</option>
          </select>
        </label>

        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Participants count
          <input className={fieldClassName} type="number" min="1" placeholder="2" />
        </label>

        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Notes
          <textarea
            className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            placeholder="Optional expense context"
          />
        </label>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl bg-primary-subtle p-3 text-xs text-primary">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>Adding expenses will be available after database setup.</p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
        <Button variant="outline" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" disabled>Add expense · Preview only</Button>
      </div>
    </Card>
  );
}
