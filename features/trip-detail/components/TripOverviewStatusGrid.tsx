import { CircleDollarSign, FileText, Info, Luggage, Share2 } from "lucide-react";

import { Badge, Card, Progress } from "@/components/ui";
import type { OverviewCurrencyTotal } from "@/features/trip-detail/utils/trip-overview-summary";

type TripOverviewStatusGridProps = {
  currencyTotals: OverviewCurrencyTotal[];
  expenseCount: number;
  unassignedExpenseCount: number;
  budgetError?: string;
  packingTotal: number;
  packedCount: number;
  packingError?: string;
  hasImportantInfo: boolean;
  importantInfoError?: string;
  publicShareEnabled: boolean;
  tripDocumentCount: number;
  tripDocumentsError?: string;
};

function formatMoney(total: OverviewCurrencyTotal) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: total.currency,
      maximumFractionDigits: 2,
    }).format(total.amount);
  } catch {
    return `${total.amount.toFixed(2)} ${total.currency}`;
  }
}

export function TripOverviewStatusGrid({
  currencyTotals,
  expenseCount,
  unassignedExpenseCount,
  budgetError,
  packingTotal,
  packedCount,
  packingError,
  hasImportantInfo,
  importantInfoError,
  publicShareEnabled,
  tripDocumentCount,
  tripDocumentsError,
}: TripOverviewStatusGridProps) {
  const packingProgress = packingTotal ? Math.round((packedCount / packingTotal) * 100) : 0;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <Card padding="sm" className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CircleDollarSign className="size-4 text-primary" />
          Budget
        </div>
        {budgetError ? (
          <p className="mt-3 text-xs text-error">Summary unavailable</p>
        ) : (
          <>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{expenseCount}</p>
            <p className="text-xs text-muted">{expenseCount === 1 ? "expense" : "expenses"}</p>
            <div className="mt-3 space-y-1 text-xs text-muted">
              {currencyTotals.length
                ? currencyTotals.map((total) => (
                    <p key={total.currency} className="break-words">{formatMoney(total)}</p>
                  ))
                : <p>No spending yet</p>}
            </div>
            <p className={unassignedExpenseCount ? "mt-3 text-xs text-warning" : "mt-3 text-xs text-success"}>
              {!expenseCount
                ? "No assignment needed"
                : unassignedExpenseCount
                ? `${unassignedExpenseCount} ${unassignedExpenseCount === 1 ? "expense needs" : "expenses need"} payer or split`
                : "All expenses assigned"}
            </p>
          </>
        )}
      </Card>

      <Card padding="sm" className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Luggage className="size-4 text-primary" />
          Personal packing
        </div>
        {packingError ? (
          <p className="mt-3 text-xs text-error">Progress unavailable</p>
        ) : (
          <>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              {packedCount}/{packingTotal}
            </p>
            <p className="text-xs text-muted">items packed</p>
            <Progress value={packingProgress} className="mt-3" />
          </>
        )}
      </Card>

      <Card padding="sm" className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Info className="size-4 text-primary" />
          Important Info
        </div>
        <div className="mt-4">
          <Badge variant={importantInfoError ? "error" : hasImportantInfo ? "success" : "outline"}>
            {importantInfoError ? "Unavailable" : hasImportantInfo ? "Added" : "Missing"}
          </Badge>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          {hasImportantInfo
            ? "Private trip notes are ready."
            : "Add essential addresses, contacts, and group notes."}
        </p>
      </Card>

      <Card padding="sm" className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <FileText className="size-4 text-primary" />
          Trip documents
        </div>
        <div className="mt-4">
          <Badge variant={tripDocumentsError ? "error" : tripDocumentCount ? "success" : "outline"}>
            {tripDocumentsError
              ? "Unavailable"
              : tripDocumentCount
                ? `Documents added · ${tripDocumentCount}`
                : "No trip documents yet"}
          </Badge>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          {tripDocumentsError
            ? "Trip document status could not be loaded."
            : "Insurance, entry guidance, itineraries, Google My Maps, and shared folders."}
        </p>
      </Card>

      <Card padding="sm" className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Share2 className="size-4 text-primary" />
          Public share
        </div>
        <div className="mt-4">
          <Badge variant={publicShareEnabled ? "success" : "outline"}>
            {publicShareEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          {publicShareEnabled
            ? "The selected read-only sections are available."
            : "No public read-only view is active."}
        </p>
      </Card>
    </div>
  );
}
