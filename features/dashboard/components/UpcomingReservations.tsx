import { Building2, Car, Plane, Ticket } from "lucide-react";

import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { UpcomingReservation } from "@/features/dashboard/types/dashboard";

type UpcomingReservationsProps = {
  reservations: UpcomingReservation[];
};

const typeIcons = {
  flight: Plane,
  hotel: Building2,
  transport: Car,
  ticket: Ticket,
} as const;

const typeLabels = {
  flight: "Flight",
  hotel: "Hotel",
  transport: "Transport",
  ticket: "Ticket",
} as const;

const statusVariants = {
  paid: "success",
  deposit: "warning",
  unpaid: "error",
} as const;

const statusLabels = {
  paid: "Paid",
  deposit: "Deposit",
  unpaid: "Unpaid",
} as const;

function formatReservationDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function UpcomingReservations({ reservations }: UpcomingReservationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming reservations</CardTitle>
        <CardDescription>Flights, hotels, and tickets on your horizon.</CardDescription>
      </CardHeader>

      <ul className="divide-y divide-border-subtle pt-2">
        {reservations.map((reservation) => {
          const Icon = typeIcons[reservation.type];

          return (
            <li
              key={reservation.id}
              className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface">
                <Icon className="size-4 text-primary" strokeWidth={1.75} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {reservation.title}
                  </p>
                  <Badge variant="outline" className="shrink-0">
                    {typeLabels[reservation.type]}
                  </Badge>
                </div>

                <p className="mt-0.5 truncate text-xs text-muted">
                  {reservation.tripTitle}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatReservationDate(reservation.date)}
                </p>
              </div>

              <Badge variant={statusVariants[reservation.status]} className="shrink-0">
                {statusLabels[reservation.status]}
              </Badge>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
