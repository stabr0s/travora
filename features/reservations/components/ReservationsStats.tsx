import { CircleDollarSign, CircleOff, ListChecks, ReceiptText } from "lucide-react";

import { Card } from "@/components/ui";
import type { Reservation } from "@/features/reservations/types/reservation";

type ReservationsStatsProps = {
  reservations: Reservation[];
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ReservationsStats({
  reservations,
}: ReservationsStatsProps) {
  const currency = reservations[0]?.currency ?? "EUR";
  const totalCost = reservations.reduce(
    (total, reservation) => total + reservation.totalPrice,
    0,
  );
  const stats = [
    { label: "Reservations", value: reservations.length, icon: ReceiptText },
    {
      label: "Paid",
      value: reservations.filter((reservation) => reservation.status === "paid").length,
      icon: ListChecks,
    },
    {
      label: "Unpaid",
      value: reservations.filter((reservation) => reservation.status === "unpaid").length,
      icon: CircleOff,
    },
    {
      label: "Total cost",
      value: formatCurrency(totalCost, currency),
      icon: CircleDollarSign,
    },
  ];

  return (
    <section aria-label="Reservation statistics" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} padding="sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted sm:text-sm">{stat.label}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{stat.value}</p>
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
