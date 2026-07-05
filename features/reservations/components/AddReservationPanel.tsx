import { Info, ReceiptText, X } from "lucide-react";

import { Button, Card } from "@/components/ui";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type AddReservationPanelProps = {
  onClose: () => void;
};

export function AddReservationPanel({
  onClose,
}: AddReservationPanelProps) {
  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <ReceiptText className="size-5 text-primary" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Add reservation</h2>
            <p className="mt-1 text-sm text-muted">Preview the information kept with a booking.</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close add reservation panel">
          <X className="size-4" />
        </Button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-foreground">
          Reservation type
          <select className={fieldClassName} defaultValue="flight">
            <option value="flight">Flight</option><option value="hotel">Hotel</option>
            <option value="car">Car</option><option value="ticket">Ticket</option>
            <option value="insurance">Insurance</option><option value="transport">Transport</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          Title
          <input className={fieldClassName} type="text" placeholder="e.g. Flight to Tokyo" />
        </label>

        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Provider
          <input className={fieldClassName} type="text" placeholder="Airline, hotel, or booking company" />
        </label>

        <label className="text-sm font-medium text-foreground">
          Date
          <input className={fieldClassName} type="datetime-local" />
        </label>

        <label className="text-sm font-medium text-foreground">
          Payer
          <input className={fieldClassName} type="text" placeholder="Traveler name" />
        </label>

        <label className="text-sm font-medium text-foreground">
          Price
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
          Notes
          <textarea
            className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            placeholder="Booking details or reminders"
          />
        </label>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl bg-primary-subtle p-3 text-xs text-primary">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>Adding reservations will be available after database setup.</p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
        <Button variant="outline" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" disabled>Add reservation · Preview only</Button>
      </div>
    </Card>
  );
}
