import type { LucideIcon } from "lucide-react";
import {
  BedDouble,
  CalendarDays,
  Car,
  MapPin,
  Plane,
  ReceiptText,
  ShieldCheck,
  TicketCheck,
  TrainFront,
  UserRound,
} from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";

type PersistedReservationCardProps = {
  reservation: PersistedReservation;
  isPending?: boolean;
  onDelete?: (reservation: PersistedReservation) => void;
  onEdit?: (reservation: PersistedReservation) => void;
};

const typeIcons: Record<string, LucideIcon> = {
  flight: Plane,
  hotel: BedDouble,
  car: Car,
  ticket: TicketCheck,
  insurance: ShieldCheck,
  transport: TrainFront,
  other: ReceiptText,
};

const statusDetails = {
  paid: { label: "Paid", variant: "success" as const },
  deposit: { label: "Deposit", variant: "warning" as const },
  unpaid: { label: "Unpaid", variant: "error" as const },
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function PersistedReservationCard({ reservation, isPending, onDelete, onEdit }: PersistedReservationCardProps) {
  const Icon = typeIcons[reservation.type || "other"] || ReceiptText;
  const status = statusDetails[reservation.status || "unpaid"];

  return (
    <Card padding="md" className="h-full">
      <div className="flex flex-col gap-4 sm:flex-row">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
          <Icon className="size-5 text-primary" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              {reservation.type ? <p className="text-xs font-medium capitalize text-muted">{reservation.type}</p> : null}
              <h3 className="mt-1 break-words text-lg font-semibold tracking-tight text-foreground">{reservation.title}</h3>
              {reservation.provider ? <p className="mt-1 break-words text-sm text-muted">{reservation.provider}</p> : null}
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          <div className="mt-4 space-y-2 text-xs text-muted">
            {reservation.start_date ? (
              <p className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 size-3.5 shrink-0" />
                <span className="min-w-0 break-words">{formatDate(reservation.start_date)}{reservation.end_date ? ` – ${formatDate(reservation.end_date)}` : ""}</span>
              </p>
            ) : null}
            {reservation.location ? <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-3.5 shrink-0" /><span className="min-w-0 break-words">{reservation.location}</span></p> : null}
            {reservation.reservation_number ? <p className="flex items-start gap-2"><ReceiptText className="mt-0.5 size-3.5 shrink-0" /><span className="min-w-0 break-words">Ref. {reservation.reservation_number}</span></p> : null}
            {reservation.payer_name ? <p className="flex items-start gap-2"><UserRound className="mt-0.5 size-3.5 shrink-0" /><span className="min-w-0 break-words">Paid by {reservation.payer_name}</span></p> : null}
          </div>

          {reservation.notes ? <p className="mt-4 break-words text-xs leading-relaxed text-muted">{reservation.notes}</p> : null}
          {reservation.total_price !== null ? (
            <div className="mt-5 border-t border-border-subtle pt-4">
              <p className="text-xs text-muted">Total price</p>
              <p className="mt-0.5 text-xl font-semibold tracking-tight text-foreground">
                {reservation.currency
                  ? formatCurrency(reservation.total_price, reservation.currency)
                  : reservation.total_price}
              </p>
            </div>
          ) : null}
          {onEdit && onDelete ? (
            <div className="mt-4 flex flex-col gap-2 border-t border-border-subtle pt-3 sm:flex-row">
              <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => onEdit(reservation)} disabled={isPending}>Edit</Button>
              <Button size="sm" variant="ghost" className="w-full text-error sm:w-auto" onClick={() => onDelete(reservation)} disabled={isPending}>Delete</Button>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
