import { CalendarClock, TicketCheck } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type { PersistedPlannerItem } from "@/features/planner/types/persisted-planner";
import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";
import {
  formatReservationDate,
  getReservationStatusDetails,
  getReservationTypeLabel,
} from "@/features/reservations/utils/reservation-display";
import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";

type TripOverviewUpcomingProps = {
  plannerItems: PersistedPlannerItem[];
  reservations: PersistedReservation[];
  plannerError?: string;
  reservationsError?: string;
  onNavigate: (tab: TripDetailTabId) => void;
};

function formatPlanDate(item: PersistedPlannerItem) {
  if (!item.date) return "Date not set";
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${item.date}T00:00:00Z`));
  return item.start_time ? `${date} · ${item.start_time.slice(0, 5)}` : date;
}

export function TripOverviewUpcoming({
  plannerItems,
  reservations,
  plannerError,
  reservationsError,
  onNavigate,
}: TripOverviewUpcomingProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card padding="md" className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <CalendarClock className="mt-0.5 size-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <h2 className="font-semibold tracking-tight text-foreground">Next in plan</h2>
              <p className="mt-1 text-xs text-muted">Your next itinerary moments.</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={() => onNavigate("plan")}>Plan</Button>
        </div>
        {plannerError ? (
          <p className="mt-4 text-sm text-error">Planner summary is unavailable.</p>
        ) : plannerItems.length ? (
          <div className="mt-4 divide-y divide-border-subtle">
            {plannerItems.map((item) => (
              <div key={item.id} className="flex min-w-0 items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="break-words text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted">{formatPlanDate(item)}</p>
                </div>
                <Badge variant="outline" className="shrink-0 capitalize">{item.type || "Plan"}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Nothing upcoming yet. Open Plan to add the first itinerary item.
          </p>
        )}
      </Card>

      <Card padding="md" className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <TicketCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <h2 className="font-semibold tracking-tight text-foreground">Upcoming reservations</h2>
              <p className="mt-1 text-xs text-muted">Bookings coming up next.</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={() => onNavigate("reservations")}>View</Button>
        </div>
        {reservationsError ? (
          <p className="mt-4 text-sm text-error">Reservation summary is unavailable.</p>
        ) : reservations.length ? (
          <div className="mt-4 divide-y divide-border-subtle">
            {reservations.map((reservation) => {
              const status = getReservationStatusDetails(reservation.status);
              return (
                <div key={reservation.id} className="min-w-0 py-3 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-foreground">{reservation.title}</p>
                      <p className="mt-1 text-xs text-muted">
                        {getReservationTypeLabel(reservation.type)} · {formatReservationDate(reservation.start_date)}
                      </p>
                    </div>
                    <Badge variant={status.variant} className="shrink-0">{status.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            No upcoming bookings. Open Reservations when travel details arrive.
          </p>
        )}
      </Card>
    </div>
  );
}
