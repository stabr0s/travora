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
  Users,
} from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type {
  Reservation,
  ReservationStatus,
  ReservationType,
} from "@/features/reservations/types/reservation";

const typeDetails: Record<ReservationType, { label: string; icon: LucideIcon }> = {
  flight: { label: "Flight", icon: Plane },
  hotel: { label: "Hotel", icon: BedDouble },
  car: { label: "Car", icon: Car },
  ticket: { label: "Ticket", icon: TicketCheck },
  insurance: { label: "Insurance", icon: ShieldCheck },
  transport: { label: "Transport", icon: TrainFront },
  other: { label: "Other", icon: ReceiptText },
};

const statusDetails: Record<
  ReservationStatus,
  { label: string; variant: "success" | "warning" | "error" }
> = {
  paid: { label: "Paid", variant: "success" },
  deposit: { label: "Deposit", variant: "warning" },
  unpaid: { label: "Unpaid", variant: "error" },
};

type ReservationCardProps = {
  reservation: Reservation;
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  const type = typeDetails[reservation.type];
  const status = statusDetails[reservation.status];
  const Icon = type.icon;
  const settledCount = reservation.participants.filter(
    (participant) => participant.settled,
  ).length;

  return (
    <Card padding="md" className="h-full hover:shadow-sm">
      <div className="flex gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
          <Icon className="size-5 text-primary" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-muted">{type.label}</p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{reservation.title}</h3>
              {reservation.provider ? <p className="mt-1 text-sm text-muted">{reservation.provider}</p> : null}
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          <div className="mt-4 space-y-2 text-xs text-muted">
            <p className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 size-3.5 shrink-0" />
              <span>{formatDate(reservation.startDate)}{reservation.endDate ? ` – ${formatDate(reservation.endDate)}` : ""}</span>
            </p>
            {reservation.location ? (
              <p className="flex items-center gap-2"><MapPin className="size-3.5" />{reservation.location}</p>
            ) : null}
            {reservation.reservationNumber ? (
              <p className="flex items-center gap-2"><ReceiptText className="size-3.5" />Ref. {reservation.reservationNumber}</p>
            ) : null}
          </div>

          {reservation.notes ? <p className="mt-4 text-xs leading-relaxed text-muted">{reservation.notes}</p> : null}

          <div className="mt-5 flex flex-col gap-3 border-t border-border-subtle pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs text-muted">Total price</p>
              <p className="mt-0.5 text-xl font-semibold tracking-tight text-foreground">
                {formatCurrency(reservation.totalPrice, reservation.currency)}
              </p>
            </div>
            <div className="space-y-1 text-xs text-muted sm:text-right">
              <p className="flex items-center gap-1.5 sm:justify-end"><UserRound className="size-3.5" />Paid by {reservation.payer}</p>
              <p className="flex items-center gap-1.5 sm:justify-end"><Users className="size-3.5" />{settledCount}/{reservation.participants.length} settled</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
