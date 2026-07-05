import { BedDouble, CircleDollarSign, MapPin, Users } from "lucide-react";

import { Card } from "@/components/ui";
import type { TripDetail } from "@/features/trip-detail/types/trip-detail";

type TripSummaryCardsProps = {
  trip: TripDetail;
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

export function TripSummaryCards({ trip }: TripSummaryCardsProps) {
  const cards = [
    { label: "Travelers", value: trip.participantsCount, icon: Users },
    { label: "Saved places", value: trip.placesCount, icon: MapPin },
    { label: "Reservations", value: trip.reservationsCount, icon: BedDouble },
    {
      label: "Cost per person",
      value: formatCurrency(trip.costPerPerson, trip.currency),
      icon: CircleDollarSign,
    },
  ];

  return (
    <section aria-label="Trip summary" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.label} padding="sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted sm:text-sm">{card.label}</p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {card.value}
                </p>
              </div>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
                <Icon className="size-4 text-primary" strokeWidth={1.75} />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
