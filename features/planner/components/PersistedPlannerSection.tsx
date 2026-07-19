"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarDays, Plus } from "lucide-react";

import { Button, Card, EmptyState, SectionHeader } from "@/components/ui";
import { deletePlannerItemAction } from "@/features/planner/actions/planner-actions";
import { reorderPlannerItemAction } from "@/features/planner/actions/planner-usability-actions";
import { PersistedAddPlanItemPanel } from "@/features/planner/components/PersistedAddPlanItemPanel";
import { PersistedCopyDayPanel } from "@/features/planner/components/PersistedCopyDayPanel";
import { PersistedPlanItemCard } from "@/features/planner/components/PersistedPlanItemCard";
import { PersistedQuickAddPlanItem } from "@/features/planner/components/PersistedQuickAddPlanItem";
import { useScrollIntoViewOnOpen } from "@/hooks/useScrollIntoViewOnOpen";
import type {
  CreatePlannerItemActionState,
  PersistedPlannerItem,
} from "@/features/planner/types/persisted-planner";
import type { PersistedPlace } from "@/features/places/types/persisted-place";

type PersistedPlannerSectionProps = {
  tripId: string;
  items: PersistedPlannerItem[];
  places?: PersistedPlace[];
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

function compareNullable(valueA: string | null, valueB: string | null) {
  if (valueA && valueB) return valueA.localeCompare(valueB);
  if (valueA) return -1;
  if (valueB) return 1;
  return 0;
}

function sortDayItems(items: PersistedPlannerItem[]) {
  return items
    .map((item, fallbackIndex) => ({ item, fallbackIndex }))
    .sort((left, right) => {
      const orderDiff = (left.item.order_index ?? left.fallbackIndex)
        - (right.item.order_index ?? right.fallbackIndex);
      if (orderDiff) return orderDiff;

      return compareNullable(left.item.start_time, right.item.start_time)
        || compareNullable(left.item.created_at, right.item.created_at);
    })
    .map(({ item }) => item);
}

export function PersistedPlannerSection({
  tripId,
  items,
  places = [],
  loadError,
  canEditTrip,
}: PersistedPlannerSectionProps) {
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PersistedPlannerItem | null>(null);
  const [message, setMessage] = useState<CreatePlannerItemActionState | null>(null);
  const [isPending, startTransition] = useTransition();
  const panelRef = useScrollIntoViewOnOpen<HTMLDivElement>(isAddPanelOpen);
  const groups = useMemo(() => {
    const grouped = new Map<string, PersistedPlannerItem[]>();

    items.forEach((item) => {
      const key = item.date || "unscheduled";
      grouped.set(key, [...(grouped.get(key) || []), item]);
    });

    return Array.from(grouped.entries())
      .map(([date, groupItems]) => [date, sortDayItems(groupItems)] as const)
      .sort(([dateA], [dateB]) => {
        if (dateA === "unscheduled") return 1;
        if (dateB === "unscheduled") return -1;
        return dateA.localeCompare(dateB);
      });
  }, [items]);
  const copyableDays = groups
    .filter(([date]) => date !== "unscheduled")
    .map(([date, groupItems]) => ({
      date,
      label: formatDate(date),
      count: groupItems.length,
    }));

  function openAddPanel() {
    setEditingItem(null);
    setIsAddPanelOpen(true);
  }

  function handleDelete(item: PersistedPlannerItem) {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    startTransition(async () => setMessage(await deletePlannerItemAction(tripId, item.id)));
  }

  function handleMove(groupItems: PersistedPlannerItem[], item: PersistedPlannerItem, direction: "up" | "down") {
    const currentIndex = groupItems.findIndex((groupItem) => groupItem.id === item.id);
    const siblingIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const sibling = groupItems[siblingIndex];
    if (currentIndex < 0 || !sibling) return;

    startTransition(async () => {
      setMessage(await reorderPlannerItemAction(
        tripId,
        item.id,
        sibling.id,
        item.order_index ?? currentIndex,
        sibling.order_index ?? siblingIndex,
      ));
    });
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
        <div ref={panelRef}>
          <PersistedAddPlanItemPanel
            key={editingItem?.id || "new"}
            tripId={tripId}
            item={editingItem}
            places={places}
            onClose={() => setIsAddPanelOpen(false)}
          />
        </div>
      ) : null}

      {canEditTrip ? <PersistedCopyDayPanel tripId={tripId} days={copyableDays} /> : null}

      {loadError ? <Card padding="sm" className="text-sm text-error">{loadError}</Card> : !items.length ? (
        <EmptyState
          icon={CalendarDays}
          title="No plan items yet"
          description={places.length
            ? "Start with a quick activity, or use a saved Place in the full Add item form."
            : "Start with a quick activity, then add saved Places when your itinerary grows."}
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
                {canEditTrip && date !== "unscheduled" ? (
                  <PersistedQuickAddPlanItem tripId={tripId} date={date} places={places} />
                ) : null}
                {groupItems.map((item, index) => (
                  <PersistedPlanItemCard
                    key={item.id}
                    item={item}
                    isPending={isPending}
                    onEdit={canEditTrip ? (selected) => { setEditingItem(selected); setIsAddPanelOpen(true); } : undefined}
                    onDelete={canEditTrip ? handleDelete : undefined}
                    onMoveUp={canEditTrip && index > 0 ? (selected) => handleMove(groupItems, selected, "up") : undefined}
                    onMoveDown={canEditTrip && index < groupItems.length - 1 ? (selected) => handleMove(groupItems, selected, "down") : undefined}
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
