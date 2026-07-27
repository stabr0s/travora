import Link from "next/link";
import { ArrowUpRight, FileText, Info, ListChecks, ReceiptText, Share2, WalletCards } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";

type TripOverviewQuickActionsProps = {
  canEditTrip: boolean;
  isOwner: boolean;
  publicSharePath?: string;
  onNavigate: (tab: TripDetailTabId) => void;
};

const previewClassName =
  "inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:w-auto";

export function TripOverviewQuickActions({
  canEditTrip,
  isOwner,
  publicSharePath,
  onNavigate,
}: TripOverviewQuickActionsProps) {
  function scrollToImportantInfo() {
    document.getElementById("trip-important-info")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function scrollToTravelLinks() {
    document.getElementById("trip-travel-links")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <Card padding="sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Quick actions</h2>
          <p className="mt-1 text-xs text-muted">
            {canEditTrip ? "Continue planning in the right workspace." : "Jump to trip details."}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => onNavigate("plan")}>
            <ListChecks className="size-4" />
            {canEditTrip ? "Open Plan" : "View Plan"}
          </Button>
          <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => onNavigate("reservations")}>
            <ReceiptText className="size-4" />
            {canEditTrip ? "Reservations" : "View reservations"}
          </Button>
          <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => onNavigate("budget")}>
            <WalletCards className="size-4" />
            {canEditTrip ? "Budget" : "View budget"}
          </Button>
          <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={scrollToImportantInfo}>
            <Info className="size-4" />
            Important Info
          </Button>
          <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={scrollToTravelLinks}>
            <FileText className="size-4" />
            {canEditTrip ? "Manage trip links" : "View trip links"}
          </Button>
          {isOwner ? (
            <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => onNavigate("settings")}>
              <Share2 className="size-4" />
              Share settings
            </Button>
          ) : null}
          {isOwner && publicSharePath ? (
            <Link href={publicSharePath} className={previewClassName} target="_blank" rel="noreferrer">
              Preview share
              <ArrowUpRight className="size-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
