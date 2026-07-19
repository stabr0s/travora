"use client";

import { ExternalLink, Link2 } from "lucide-react";

import { Badge, Button } from "@/components/ui";
import type { PersistedTravelLink } from "@/features/travel-links/types/travel-link";

type TravelLinkItemProps = {
  link: PersistedTravelLink;
  canEditTrip: boolean;
  isPending?: boolean;
  onEdit: (link: PersistedTravelLink) => void;
  onDelete: (link: PersistedTravelLink) => void;
};

function labelForType(type: string) {
  return type.replace("_", " ");
}

export function TravelLinkItem({
  link,
  canEditTrip,
  isPending,
  onEdit,
  onDelete,
}: TravelLinkItemProps) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-background p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <Link2 className="size-4 text-primary" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="break-words text-sm font-semibold text-foreground">{link.title}</h4>
              <Badge variant="outline" className="capitalize">{labelForType(link.link_type)}</Badge>
            </div>
            {link.note ? <p className="mt-1 break-words text-xs leading-relaxed text-muted">{link.note}</p> : null}
            <p className="mt-1 break-all text-xs text-muted">{link.url}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-surface active:bg-border-subtle sm:w-auto"
          >
            <ExternalLink className="size-4" />
            Open
          </a>
          {canEditTrip ? (
            <>
              <Button size="sm" variant="ghost" className="w-full sm:w-auto" disabled={isPending} onClick={() => onEdit(link)}>
                Edit
              </Button>
              <Button size="sm" variant="ghost" className="w-full text-error sm:w-auto" disabled={isPending} onClick={() => onDelete(link)}>
                Delete
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
