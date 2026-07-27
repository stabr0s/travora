"use client";

import { ExternalLink, Link2 } from "lucide-react";

import { Badge, Button } from "@/components/ui";
import type { PersistedTravelLink } from "@/features/travel-links/types/travel-link";
import { getTravelLinkTypeLabel } from "@/features/travel-links/utils/travel-link-display";
import { cn } from "@/lib/utils";

type TravelLinkItemProps = {
  link: PersistedTravelLink;
  canEditTrip: boolean;
  isPending?: boolean;
  compact?: boolean;
  onEdit: (link: PersistedTravelLink) => void;
  onDelete: (link: PersistedTravelLink) => void;
};

export function TravelLinkItem({
  link,
  canEditTrip,
  isPending,
  compact,
  onEdit,
  onDelete,
}: TravelLinkItemProps) {
  return (
    <div className={cn("min-w-0 rounded-xl border border-border-subtle bg-background", compact ? "p-2.5" : "p-3")}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {!compact ? (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
              <Link2 className="size-4 text-primary" />
            </span>
          ) : null}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="break-words text-sm font-semibold text-foreground">{link.title}</h4>
              <Badge variant="outline">{getTravelLinkTypeLabel(link.link_type)}</Badge>
            </div>
            {link.note ? (
              <p className={cn("mt-1 break-words text-xs leading-relaxed text-muted", compact && "line-clamp-2")}>
                {link.note}
              </p>
            ) : null}
            {!compact ? <p className="mt-1 break-all text-xs text-muted">{link.url}</p> : null}
          </div>
        </div>
        <div className={cn("flex gap-2", compact ? "flex-row flex-wrap" : "flex-col sm:flex-row")}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-surface active:bg-border-subtle",
              compact ? "w-auto" : "w-full sm:w-auto",
            )}
          >
            <ExternalLink className="size-4" />
            Open
          </a>
          {canEditTrip ? (
            <>
              <Button size="sm" variant="ghost" className={compact ? "w-auto" : "w-full sm:w-auto"} disabled={isPending} onClick={() => onEdit(link)}>
                Edit
              </Button>
              <Button size="sm" variant="ghost" className={compact ? "w-auto text-error" : "w-full text-error sm:w-auto"} disabled={isPending} onClick={() => onDelete(link)}>
                Delete
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
