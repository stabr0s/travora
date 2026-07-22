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
import { ReservationCalendarButton } from "@/features/reservations/components/ReservationCalendarButton";
import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";
import {
  formatReservationCurrency,
  formatReservationDateRange,
  getReservationStatusDetails,
  getReservationTypeLabel,
} from "@/features/reservations/utils/reservation-display";
import { TravelLinksCard } from "@/features/travel-links";
import type { PersistedTravelLink } from "@/features/travel-links/types/travel-link";

type PersistedReservationCardProps = {
  reservation: PersistedReservation;
  isPending?: boolean;
  onDelete?: (reservation: PersistedReservation) => void;
  onEdit?: (reservation: PersistedReservation) => void;
  canEditTrip?: boolean;
  travelLinks?: PersistedTravelLink[];
  travelLinksError?: string;
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

function shortenNotes(notes: string | null) {
  if (!notes) return null;
  return notes.length > 180 ? `${notes.slice(0, 177).trim()}…` : notes;
}

export function PersistedReservationCard({
  reservation,
  isPending,
  onDelete,
  onEdit,
  canEditTrip = false,
  travelLinks = [],
  travelLinksError,
}: PersistedReservationCardProps) {
  const Icon = typeIcons[reservation.type || "other"] || ReceiptText;
  const status = getReservationStatusDetails(reservation.status);
  const typeLabel = getReservationTypeLabel(reservation.type);
  const notes = shortenNotes(reservation.notes);

  return (
    <Card padding="sm" className="h-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
          <Icon className="size-5 text-primary" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted">{typeLabel}</p>
              <h3 className="mt-0.5 break-words text-base font-semibold tracking-tight text-foreground">{reservation.title}</h3>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          <p className="mt-3 flex items-start gap-2 text-sm font-medium text-foreground">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted" />
            <span className="min-w-0 break-words">{formatReservationDateRange(reservation)}</span>
          </p>

          <div className="mt-3 grid gap-2 text-xs text-muted sm:grid-cols-2">
            {reservation.provider ? <p className="min-w-0 break-words"><span className="text-foreground">Provider:</span> {reservation.provider}</p> : null}
            {reservation.reservation_number ? <p className="min-w-0 break-words"><span className="text-foreground">Ref:</span> {reservation.reservation_number}</p> : null}
            {reservation.location ? <p className="flex min-w-0 items-start gap-1.5 break-words"><MapPin className="mt-0.5 size-3.5 shrink-0" />{reservation.location}</p> : null}
            {reservation.payer_name ? <p className="flex min-w-0 items-start gap-1.5 break-words"><UserRound className="mt-0.5 size-3.5 shrink-0" />Paid by {reservation.payer_name}</p> : null}
          </div>

          {reservation.total_price !== null ? (
            <p className="mt-3 text-sm text-muted">
              Price <span className="font-semibold text-foreground">{formatReservationCurrency(reservation.total_price, reservation.currency)}</span>
            </p>
          ) : null}

          {notes ? (
            <p className="mt-3 break-words rounded-xl bg-surface px-3 py-2 text-xs leading-relaxed text-muted">
              {notes}
            </p>
          ) : null}

          <div className="mt-4 flex flex-col gap-2 border-t border-border-subtle pt-3 sm:flex-row sm:flex-wrap">
            <ReservationCalendarButton reservation={reservation} />
            {onEdit && onDelete ? (
              <>
                <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => onEdit(reservation)} disabled={isPending}>Edit</Button>
                <Button size="sm" variant="ghost" className="w-full text-error sm:w-auto" onClick={() => onDelete(reservation)} disabled={isPending}>Delete</Button>
              </>
            ) : null}
          </div>
          <div className="mt-3">
            <TravelLinksCard
              tripId={reservation.trip_id}
              reservationId={reservation.id}
              links={travelLinks}
              loadError={travelLinksError}
              canEditTrip={canEditTrip}
              compact
              title="Documents & links"
              emptyDescription="Attach booking pages, check-in links, tickets, or shared folders for this reservation."
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
