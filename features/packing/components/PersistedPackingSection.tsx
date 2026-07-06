"use client";

import { useMemo, useState, useTransition } from "react";
import { Luggage } from "lucide-react";

import { Button, Card, EmptyState } from "@/components/ui";
import {
  deletePackingItemAction,
  togglePackingItemPackedAction,
} from "@/features/packing/actions/packing-actions";
import { PackingCategoryTabs } from "@/features/packing/components/PackingCategoryTabs";
import { PackingHeader } from "@/features/packing/components/PackingHeader";
import { PackingProgressCard } from "@/features/packing/components/PackingProgressCard";
import { PackingStats } from "@/features/packing/components/PackingStats";
import { PersistedAddPackingItemPanel } from "@/features/packing/components/PersistedAddPackingItemPanel";
import { PersistedPackingItemRow } from "@/features/packing/components/PersistedPackingItemRow";
import type {
  PackingActionState,
  PersistedPackingItem,
} from "@/features/packing/types/persisted-packing";
import type {
  PackingCategory,
  PackingCategoryFilter,
  PackingItem,
} from "@/features/packing/types/packing";

type PersistedPackingSectionProps = {
  tripId: string;
  items: PersistedPackingItem[];
  loadError?: string;
  canEditTrip: boolean;
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

function toPackingItem(item: PersistedPackingItem): PackingItem {
  return {
    id: item.id,
    tripId: item.trip_id,
    name: item.name,
    category: categoryOf(item),
    isShared: item.is_shared ?? true,
    isPacked: item.is_packed ?? false,
    priority: item.priority || "recommended",
    notes: item.notes || undefined,
  };
}

export function PersistedPackingSection({ tripId, items, loadError, canEditTrip }: PersistedPackingSectionProps) {
  const [activeCategory, setActiveCategory] = useState<PackingCategoryFilter>("all");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PersistedPackingItem | null>(null);
  const [message, setMessage] = useState<PackingActionState | null>(null);
  const [isPending, startTransition] = useTransition();
  const uiItems = useMemo(() => items.map(toPackingItem), [items]);
  const filteredItems = activeCategory === "all"
    ? items
    : items.filter((item) => categoryOf(item) === activeCategory);
  const packedCount = items.filter((item) => item.is_packed).length;
  const groupedItems = categories
    .map((category) => ({ category, items: filteredItems.filter((item) => categoryOf(item) === category) }))
    .filter((group) => group.items.length);

  function openAddPanel() {
    setEditingItem(null);
    setIsPanelOpen(true);
  }

  function handleDelete(item: PersistedPackingItem) {
    if (!window.confirm(`Delete “${item.name}”? This cannot be undone.`)) return;
    startTransition(async () => setMessage(await deletePackingItemAction(tripId, item.id)));
  }

  function handleToggle(item: PersistedPackingItem) {
    startTransition(async () => {
      setMessage(await togglePackingItemPackedAction(tripId, item.id, !(item.is_packed ?? false)));
    });
  }

  return (
    <section className="space-y-6">
      <PackingHeader onAddItem={canEditTrip ? openAddPanel : undefined} />
      {isPanelOpen && canEditTrip ? (
        <PersistedAddPackingItemPanel
          key={editingItem?.id || "new"}
          tripId={tripId}
          item={editingItem}
          onClose={() => setIsPanelOpen(false)}
        />
      ) : null}
      {loadError ? <Card padding="sm" className="text-sm text-error">{loadError}</Card> : !items.length ? (
        <EmptyState
          icon={Luggage}
          title="No packing items yet"
          description="Add the first item to start preparing this trip."
          action={canEditTrip ? <Button onClick={openAddPanel}>Add first item</Button> : undefined}
        />
      ) : (
        <>
          {message?.message ? <Card padding="sm" className={message.status === "error" ? "text-sm text-error" : "text-sm text-success"}>{message.message}</Card> : null}
          <PackingStats items={uiItems} />
          <PackingProgressCard totalItems={items.length} packedItems={packedCount} />
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
                        canEditTrip={canEditTrip}
                        onToggle={canEditTrip ? handleToggle : undefined}
                        onEdit={canEditTrip ? (selected) => { setEditingItem(selected); setIsPanelOpen(true); } : undefined}
                        onDelete={canEditTrip ? handleDelete : undefined}
                      />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={Luggage} title="No items in this category" description="Choose another category to see your packing items." className="min-h-80" />
          )}
        </>
      )}
    </section>
  );
}
