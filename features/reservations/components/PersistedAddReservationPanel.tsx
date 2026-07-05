import { ReceiptText, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { CreateReservationActionState } from "@/features/reservations/types/persisted-reservation";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type PersistedAddReservationPanelProps = {
  tripId: string;
  actionState: CreateReservationActionState;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  onClose: () => void;
};

export function PersistedAddReservationPanel({
  tripId,
  actionState,
  formAction,
  isPending,
  onClose,
}: PersistedAddReservationPanelProps) {
  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <form action={formAction}>
        <input type="hidden" name="tripId" value={tripId} />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
              <ReceiptText className="size-5 text-primary" />
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Add reservation</h2>
              <p className="mt-1 text-sm text-muted">Save the essential booking details for this trip.</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close add reservation panel">
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground">
            Type
            <select className={fieldClassName} defaultValue="flight" name="type">
              <option value="flight">Flight</option><option value="hotel">Hotel</option>
              <option value="car">Car</option><option value="ticket">Ticket</option>
              <option value="insurance">Insurance</option><option value="transport">Transport</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Title
            <input className={fieldClassName} name="title" type="text" placeholder="e.g. Flight to Tokyo" required />
          </label>
          <label className="text-sm font-medium text-foreground">
            Provider
            <input className={fieldClassName} name="provider" type="text" placeholder="Airline, hotel, or company" />
          </label>
          <label className="text-sm font-medium text-foreground">
            Reservation number
            <input className={fieldClassName} name="reservationNumber" type="text" placeholder="Optional reference" />
          </label>
          <label className="text-sm font-medium text-foreground">
            Start date
            <input className={fieldClassName} name="startDate" type="datetime-local" />
          </label>
          <label className="text-sm font-medium text-foreground">
            End date
            <input className={fieldClassName} name="endDate" type="datetime-local" />
          </label>
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Location
            <input className={fieldClassName} name="location" type="text" placeholder="Airport, hotel, or venue" />
          </label>
          <label className="text-sm font-medium text-foreground">
            Price
            <input className={fieldClassName} name="totalPrice" type="number" min="0" step="0.01" placeholder="0" />
          </label>
          <label className="text-sm font-medium text-foreground">
            Currency
            <select className={fieldClassName} defaultValue="EUR" name="currency">
              <option value="EUR">EUR</option><option value="USD">USD</option>
              <option value="PLN">PLN</option><option value="JPY">JPY</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Status
            <select className={fieldClassName} defaultValue="unpaid" name="status">
              <option value="unpaid">Unpaid</option><option value="deposit">Deposit</option><option value="paid">Paid</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Payer
            <input className={fieldClassName} name="payerName" type="text" placeholder="Traveler name" />
          </label>
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Notes
            <textarea className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15" name="notes" placeholder="Booking details or reminders" />
          </label>
        </div>

        {actionState.message ? (
          <p role={actionState.status === "error" ? "alert" : "status"} className={actionState.status === "error" ? "mt-5 rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error" : "mt-5 rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"}>
            {actionState.message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" size="md" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="md" disabled={isPending}>{isPending ? "Saving reservation…" : "Save reservation"}</Button>
        </div>
      </form>
    </Card>
  );
}
