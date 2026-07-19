"use client";

import { useMemo, useState, useTransition } from "react";
import { Luggage } from "lucide-react";

import { Button, Card, EmptyState } from "@/components/ui";
import {
  deletePackingItemAction,
  togglePersonalPackingItemStateAction,
} from "@/features/packing/actions/packing-actions";
import { PackingCategoryTabs } from "@/features/packing/components/PackingCategoryTabs";
import { PackingHeader } from "@/features/packing/components/PackingHeader";
import { PackingProgressCard } from "@/features/packing/components/PackingProgressCard";
import { PackingStats } from "@/features/packing/components/PackingStats";
import { PersistedAddPackingItemPanel } from "@/features/packing/components/PersistedAddPackingItemPanel";
import { PersistedPackingItemRow } from "@/features/packing/components/PersistedPackingItemRow";
import { PackingPresetManager } from "@/features/packing/components/PackingPresetManager";
import { useScrollIntoViewOnOpen } from "@/hooks/useScrollIntoViewOnOpen";
import type {
  PackingActionState,
  PersistedPackingItem,
  PersistedPackingItemState,
  PersistedPackingItemWithPersonalState,
} from "@/features/packing/types/persisted-packing";
import type { PackingPresetWithItems } from "@/features/packing/types/packing-preset";
import type {
  PackingCategory,
  PackingCategoryFilter,
  PackingItem,
} from "@/features/packing/types/packing";

type PersistedPackingSectionProps = {
  tripId: string;
  items: PersistedPackingItem[];
  itemStates: PersistedPackingItemState[];
  customPresets?: PackingPresetWithItems[];
  loadError?: string;
  canEditTrip: boolean;
  canTogglePersonalState: boolean;
};

const categories: PackingCategory[] = [
  "documents", "electronics", "clothes", "toiletries", "health", "travel", "other",
];
const categoryLabels: Record<PackingCategory, string> = {
  documents: "Documents", electronics: "Electronics", clothes: "Clothes",
  toiletries: "Toiletries", health: "Health", travel: "Travel", other: "Other",
};

function categoryOf(item: PersistedPackingItem): PackingCategory {
  return categories.includes(item.category as PackingCategory)
    ? item.category as PackingCategory
    : "other";
}

function toPackingItem(item: PersistedPackingItemWithPersonalState): PackingItem {
  return {
    id: item.id,
    tripId: item.trip_id,
    name: item.name,
    category: categoryOf(item),
    isShared: item.is_shared ?? true,
    isPacked: item.isPackedForCurrentUser,
    priority: item.priority || "recommended",
    notes: item.notes || undefined,
  };
}

export function PersistedPackingSection({
  tripId,
  items,
  itemStates,
  customPresets = [],
  loadError,
  canEditTrip,
  canTogglePersonalState,
}: PersistedPackingSectionProps) {
  const [activeCategory, setActiveCategory] = useState<PackingCategoryFilter>("all");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PersistedPackingItem | null>(null);
  const [message, setMessage] = useState<PackingActionState | null>(null);
  const [isPending, startTransition] = useTransition();
  const panelRef = useScrollIntoViewOnOpen<HTMLDivElement>(isPanelOpen);
  const itemsWithPersonalState = useMemo<PersistedPackingItemWithPersonalState[]>(() => {
    const stateByItemId = new Map(itemStates.map((state) => [state.packing_item_id, state.is_packed]));
    return items.map((item) => ({
      ...item,
      isPackedForCurrentUser: stateByItemId.get(item.id) ?? false,
    }));
  }, [items, itemStates]);
  const uiItems = useMemo(() => itemsWithPersonalState.map(toPackingItem), [itemsWithPersonalState]);
  const filteredItems = activeCategory === "all"
    ? itemsWithPersonalState
    : itemsWithPersonalState.filter((item) => categoryOf(item) === activeCategory);
  const packedCount = itemsWithPersonalState.filter((item) => item.isPackedForCurrentUser).length;
  const groupedItems = categories
    .map((category) => ({ category, items: filteredItems.filter((item) => categoryOf(item) === category) }))
    .filter((group) => group.items.length);

  function openAddPanel() {
    setEditingItem(null);
    setIsPanelOpen(true);
  }

  function handleDelete(item: PersistedPackingItemWithPersonalState) {
    if (!window.confirm(`Delete “${item.name}”? This cannot be undone.`)) return;
    startTransition(async () => setMessage(await deletePackingItemAction(tripId, item.id)));
  }

  function handleToggle(item: PersistedPackingItemWithPersonalState) {
    startTransition(async () => {
      setMessage(await togglePersonalPackingItemStateAction(tripId, item.id, !item.isPackedForCurrentUser));
    });
  }

  return (
    <section className="space-y-6">
      <PackingHeader onAddItem={canEditTrip ? openAddPanel : undefined} />
      {isPanelOpen && canEditTrip ? (
        <div ref={panelRef}>
          <PersistedAddPackingItemPanel
            key={editingItem?.id || "new"}
            tripId={tripId}
            item={editingItem}
            onClose={() => setIsPanelOpen(false)}
          />
        </div>
      ) : null}
      {canEditTrip ? <PackingPresetManager tripId={tripId} presets={customPresets} /> : null}
      {message?.message ? <Card padding="sm" className={message.status === "error" ? "text-sm text-error" : "text-sm text-success"}>{message.message}</Card> : null}
      {loadError ? <Card padding="sm" className="text-sm text-error">{loadError}</Card> : !items.length ? (
        <EmptyState
          icon={Luggage}
          title="No packing items yet"
          description="Build a shared checklist, then each traveler can track their own packed progress."
          action={canEditTrip ? <Button onClick={openAddPanel}>Add first item</Button> : undefined}
        />
      ) : (
        <>
          <PackingStats items={uiItems} mode="personal" />
          <PackingProgressCard totalItems={items.length} packedItems={packedCount} mode="personal" />
          <PackingCategoryTabs categories={categories} items={uiItems} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          {groupedItems.length ? (
            <div className="space-y-5">
              {groupedItems.map((group) => (
                <Card key={group.category} padding="none" className="overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
                    <h2 className="font-semibold tracking-tight text-foreground">{categoryLabels[group.category]}</h2>
                    <span className="text-xs text-muted">{group.items.length} items</span>
                  </div>
                  <div className="divide-y divide-border-subtle">
                    {group.items.map((item) => (
                      <PersistedPackingItemRow
                        key={item.id}
                        item={item}
                        isPending={isPending}
                        canTogglePersonalState={canTogglePersonalState}
                        onToggle={canTogglePersonalState ? handleToggle : undefined}
                        onEdit={canEditTrip ? (selected) => { setEditingItem(selected); setIsPanelOpen(true); } : undefined}
                        onDelete={canEditTrip ? handleDelete : undefined}
                      />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={Luggage} title="No items in this category" description="Choose another category, or add an item if this section needs something." className="min-h-80" />
          )}
        </>
      )}
    </section>
  );
}
