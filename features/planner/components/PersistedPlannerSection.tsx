"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarDays, Plus } from "lucide-react";

import { Button, Card, EmptyState, SectionHeader } from "@/components/ui";
import { deletePlannerItemAction } from "@/features/planner/actions/planner-actions";
import { PersistedAddPlanItemPanel } from "@/features/planner/components/PersistedAddPlanItemPanel";
import { PersistedPlanItemCard } from "@/features/planner/components/PersistedPlanItemCard";
import type {
  CreatePlannerItemActionState,
  PersistedPlannerItem,
} from "@/features/planner/types/persisted-planner";

type PersistedPlannerSectionProps = {
  tripId: string;
  items: PersistedPlannerItem[];
  loadError?: string;
  canEditTrip: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function PersistedPlannerSection({
  tripId,
  items,
  loadError,
  canEditTrip,
}: PersistedPlannerSectionProps) {
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PersistedPlannerItem | null>(null);
  const [message, setMessage] = useState<CreatePlannerItemActionState | null>(null);
  const [isPending, startTransition] = useTransition();
  const groups = useMemo(() => {
    const grouped = new Map<string, PersistedPlannerItem[]>();

    items.forEach((item) => {
      const key = item.date || "unscheduled";
      grouped.set(key, [...(grouped.get(key) || []), item]);
    });

    return Array.from(grouped.entries());
  }, [items]);

  function openAddPanel() {
    setEditingItem(null);
    setIsAddPanelOpen(true);
  }

  function handleDelete(item: PersistedPlannerItem) {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    startTransition(async () => setMessage(await deletePlannerItemAction(tripId, item.id)));
  }

  return (
    <section className="space-y-6">
      <SectionHeader
        title="Plan"
        description="Organize dated activities and keep flexible ideas ready for later."
        className="mb-0"
        action={canEditTrip ? (
          <Button size="md" onClick={openAddPanel}>
            <Plus className="size-4" />
            Add item
          </Button>
        ) : undefined}
      />

      {isAddPanelOpen && canEditTrip ? (
        <PersistedAddPlanItemPanel
          key={editingItem?.id || "new"}
          tripId={tripId}
          item={editingItem}
          onClose={() => setIsAddPanelOpen(false)}
        />
      ) : null}

      {loadError ? <Card padding="sm" className="text-sm text-error">{loadError}</Card> : !items.length ? (
        <EmptyState
          icon={CalendarDays}
          title="No plan items yet"
          description="Start shaping this trip by adding a dated activity or an unscheduled idea."
          action={canEditTrip ? <Button onClick={openAddPanel}>Add first item</Button> : undefined}
        />
      ) : (
        <div className="space-y-8">
          {message?.message ? <Card padding="sm" className={message.status === "error" ? "text-sm text-error" : "text-sm text-success"}>{message.message}</Card> : null}
          {groups.map(([date, groupItems]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-baseline justify-between gap-4 border-b border-border-subtle pb-2">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {date === "unscheduled" ? "Unscheduled" : formatDate(date)}
                </h2>
                <span className="text-xs text-muted">
                  {groupItems.length} {groupItems.length === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="space-y-3">
                {groupItems.map((item) => (
                  <PersistedPlanItemCard
                    key={item.id}
                    item={item}
                    isPending={isPending}
                    onEdit={canEditTrip ? (selected) => { setEditingItem(selected); setIsAddPanelOpen(true); } : undefined}
                    onDelete={canEditTrip ? handleDelete : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
