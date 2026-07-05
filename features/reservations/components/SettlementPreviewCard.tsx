import { CheckCircle2, HandCoins } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { Reservation } from "@/features/reservations/types/reservation";

type SettlementPreviewCardProps = {
  reservations: Reservation[];
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SettlementPreviewCard({
  reservations,
}: SettlementPreviewCardProps) {
  const unsettledItems = reservations.flatMap((reservation) =>
    reservation.participants
      .filter((participant) => !participant.settled)
      .map((participant) => ({
        id: `${reservation.id}-${participant.name}`,
        participant: participant.name,
        amount: participant.amount,
        currency: reservation.currency,
        payer: reservation.payer,
        reservationTitle: reservation.title,
      })),
  );

  return (
    <Card padding="md" className="hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <HandCoins className="size-5 text-primary" />
          </span>
          <div>
            <h2 className="font-semibold tracking-tight text-foreground">Settlement preview</h2>
            <p className="mt-1 text-sm text-muted">Mock amounts awaiting repayment to a payer.</p>
          </div>
        </div>
        <Badge variant="outline">Preview only</Badge>
      </div>

      {unsettledItems.length === 0 ? (
        <div className="mt-5 flex items-center gap-3 rounded-xl bg-success-subtle p-4 text-sm text-success">
          <CheckCircle2 className="size-5" />Everyone is marked as settled.
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {unsettledItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-3.5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.participant} → {item.payer}</p>
                <p className="mt-1 truncate text-xs text-muted">{item.reservationTitle}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-foreground">
                {formatCurrency(item.amount, item.currency)}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
