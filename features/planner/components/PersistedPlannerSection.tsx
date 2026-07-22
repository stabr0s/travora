"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarDays, Plus } from "lucide-react";

import { Button, Card, EmptyState, SectionHeader } from "@/components/ui";
import { deletePlannerItemAction } from "@/features/planner/actions/planner-actions";
import { reorderPlannerItemAction } from "@/features/planner/actions/planner-usability-actions";
import { PersistedAddPlanItemPanel } from "@/features/planner/components/PersistedAddPlanItemPanel";
import { PersistedCopyDayPanel } from "@/features/planner/components/PersistedCopyDayPanel";
import { PersistedPlanItemCard } from "@/features/planner/components/PersistedPlanItemCard";
import { PersistedPlannerPresetPicker } from "@/features/planner/components/PersistedPlannerPresetPicker";
import { PersistedQuickAddPlanItem } from "@/features/planner/components/PersistedQuickAddPlanItem";
import { useScrollIntoViewOnOpen } from "@/hooks/useScrollIntoViewOnOpen";
import type {
  CreatePlannerItemActionState,
  PersistedPlannerItem,
} from "@/features/planner/types/persisted-planner";
import {
  formatPlannerDate,
  getPlannedPlaceLabels,
  groupPlannerItemsByDay,
} from "@/features/planner/utils/planner-display";
import type { PersistedPlace } from "@/features/places/types/persisted-place";

type PersistedPlannerSectionProps = {
  tripId: string;
  items: PersistedPlannerItem[];
  places?: PersistedPlace[];
  loadError?: string;
  canEditTrip: boolean;
};

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
  const groups = useMemo(() => groupPlannerItemsByDay(items), [items]);
  const plannedPlaceLabels = useMemo(() => getPlannedPlaceLabels(groups), [groups]);
  const placeById = useMemo(
    () => new Map(places.map((place) => [place.id, place])),
    [places],
  );
  const copyableDays = groups
    .filter(([date]) => date !== "unscheduled")
    .map(([date, groupItems]) => ({
      date,
      label: formatPlannerDate(date),
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
            plannedPlaceLabels={plannedPlaceLabels}
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
            ? "Start by adding the first day item, or use a saved Place from the Add item form."
            : "Start with one activity or travel step. Saved Places can be linked later."}
          action={canEditTrip ? <Button onClick={openAddPanel}>Add first plan item</Button> : undefined}
        />
      ) : (
        <div className="space-y-8">
          {message?.message ? <Card padding="sm" className={message.status === "error" ? "text-sm text-error" : "text-sm text-success"}>{message.message}</Card> : null}
          {groups.map(([date, groupItems], dayIndex) => (
            <Card key={date} padding="md" className="space-y-4">
              <div className="flex flex-col gap-3 border-b border-border-subtle pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                    {date === "unscheduled" ? "Flexible ideas" : `Day ${dayIndex + 1}`}
                  </p>
                  <h2 className="mt-1 break-words text-xl font-semibold tracking-tight text-foreground">
                    {date === "unscheduled" ? "Unscheduled" : formatPlannerDate(date)}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {date === "unscheduled"
                      ? "Keep flexible ideas here until they have a date."
                      : "Quick add is attached to this day, so new items land in the right place."}
                  </p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
                  {groupItems.length} {groupItems.length === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="space-y-3">
                {groupItems.map((item, index) => (
                  <PersistedPlanItemCard
                    key={item.id}
                    item={item}
                    linkedPlace={item.place_id ? placeById.get(item.place_id) : undefined}
                    isPending={isPending}
                    onEdit={canEditTrip ? (selected) => { setEditingItem(selected); setIsAddPanelOpen(true); } : undefined}
                    onDelete={canEditTrip ? handleDelete : undefined}
                    onMoveUp={canEditTrip && index > 0 ? (selected) => handleMove(groupItems, selected, "up") : undefined}
                    onMoveDown={canEditTrip && index < groupItems.length - 1 ? (selected) => handleMove(groupItems, selected, "down") : undefined}
                  />
                ))}
                {canEditTrip && date !== "unscheduled" ? (
                  <div className="space-y-2">
                    <PersistedQuickAddPlanItem
                      tripId={tripId}
                      date={date}
                      places={places}
                      plannedPlaceLabels={plannedPlaceLabels}
                    />
                    <PersistedPlannerPresetPicker tripId={tripId} date={date} />
                  </div>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
