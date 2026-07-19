"use client";

import { useState, useTransition } from "react";
import { Link2 } from "lucide-react";

import { Button, Card } from "@/components/ui";
import { deleteTravelLinkAction } from "@/features/travel-links/actions/travel-link-actions";
import { TravelLinkForm } from "@/features/travel-links/components/TravelLinkForm";
import { TravelLinkItem } from "@/features/travel-links/components/TravelLinkItem";
import type {
  PersistedTravelLink,
  TravelLinkActionState,
} from "@/features/travel-links/types/travel-link";

type TravelLinksCardProps = {
  tripId: string;
  reservationId?: string | null;
  links: PersistedTravelLink[];
  loadError?: string;
  canEditTrip: boolean;
  title?: string;
  emptyDescription?: string;
  compact?: boolean;
};

export function TravelLinksCard({
  tripId,
  reservationId,
  links,
  loadError,
  canEditTrip,
  title = "Travel Links",
  emptyDescription = "Save booking pages, check-in links, insurance documents, and shared folders in one place.",
  compact,
}: TravelLinksCardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<PersistedTravelLink | null>(null);
  const [message, setMessage] = useState<TravelLinkActionState | null>(null);
  const [isPending, startTransition] = useTransition();

  function openForm(link?: PersistedTravelLink) {
    setEditingLink(link || null);
    setIsFormOpen(true);
  }

  function handleDelete(link: PersistedTravelLink) {
    if (!window.confirm(`Delete “${link.title}”? This cannot be undone.`)) return;
    startTransition(async () => setMessage(await deleteTravelLinkAction(tripId, link.id)));
  }

  const content = (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <Link2 className="size-5 text-primary" />
          </span>
          <div className="min-w-0">
            <h2 className={compact ? "font-semibold tracking-tight text-foreground" : "text-lg font-semibold tracking-tight text-foreground"}>
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted">{emptyDescription}</p>
          </div>
        </div>
        {canEditTrip && !isFormOpen ? (
          <Button type="button" size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => openForm()}>
            Add link
          </Button>
        ) : null}
      </div>

      {loadError ? <p className="rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error">{loadError}</p> : null}
      {message?.message ? (
        <p className={message.status === "error" ? "rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error" : "rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"}>
          {message.message}
        </p>
      ) : null}
      {isFormOpen && canEditTrip ? (
        <TravelLinkForm
          tripId={tripId}
          reservationId={reservationId || editingLink?.reservation_id || null}
          link={editingLink}
          onClose={() => setIsFormOpen(false)}
        />
      ) : null}
      {links.length ? (
        <div className="space-y-3">
          {links.map((link) => (
            <TravelLinkItem
              key={link.id}
              link={link}
              canEditTrip={canEditTrip}
              isPending={isPending}
              onEdit={openForm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : !loadError && !isFormOpen ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-4 py-5 text-sm text-muted">
          {emptyDescription}
        </div>
      ) : null}
    </>
  );

  return compact ? (
    <div className="space-y-4 rounded-2xl border border-border-subtle bg-surface p-4">{content}</div>
  ) : (
    <Card padding="md" className="space-y-5">{content}</Card>
  );
}
