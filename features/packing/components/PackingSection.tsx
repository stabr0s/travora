"use client";

import { useMemo, useState } from "react";
import { Luggage } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { AddPackingItemPanel } from "@/features/packing/components/AddPackingItemPanel";
import { PackingCategoryTabs } from "@/features/packing/components/PackingCategoryTabs";
import { PackingChecklist } from "@/features/packing/components/PackingChecklist";
import { PackingHeader } from "@/features/packing/components/PackingHeader";
import { PackingProgressCard } from "@/features/packing/components/PackingProgressCard";
import { PackingStats } from "@/features/packing/components/PackingStats";
import { PackingTravelerList } from "@/features/packing/components/PackingTravelerList";
import { getMockPackingByTripId } from "@/features/packing/data/mock-packing";
import type { PackingCategoryFilter } from "@/features/packing/types/packing";

type PackingSectionProps = {
  tripId: string;
};

export function PackingSection({ tripId }: PackingSectionProps) {
  const [activeCategory, setActiveCategory] = useState<PackingCategoryFilter>("all");
  const [packedOverrides, setPackedOverrides] = useState<Record<string, boolean>>({});
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const packing = getMockPackingByTripId(tripId);
  const effectiveItems = useMemo(
    () =>
      (packing?.items ?? []).map((item) => ({
        ...item,
        isPacked: packedOverrides[item.id] ?? item.isPacked,
      })),
    [packedOverrides, packing],
  );

  if (!packing || packing.items.length === 0) {
    return (
      <section className="space-y-6">
        <PackingHeader onAddItem={() => setIsAddPanelOpen(true)} />
        {isAddPanelOpen ? (
          <AddPackingItemPanel travelers={packing?.travelers ?? []} onClose={() => setIsAddPanelOpen(false)} />
        ) : null}
        <EmptyState
          icon={Luggage}
          title="No packing list yet"
          description="Shared and personal checklist items will appear here once this trip has packing data."
          className="min-h-96"
        />
      </section>
    );
  }

  const filteredItems = activeCategory === "all"
    ? effectiveItems
    : effectiveItems.filter((item) => item.category === activeCategory);
  const packedCount = effectiveItems.filter((item) => item.isPacked).length;

  function handleToggle(itemId: string) {
    const item = effectiveItems.find((candidate) => candidate.id === itemId);
    if (!item) return;
    setPackedOverrides((current) => ({ ...current, [itemId]: !item.isPacked }));
  }

  return (
    <section className="space-y-6">
      <PackingHeader onAddItem={() => setIsAddPanelOpen(true)} />

      {isAddPanelOpen ? (
        <AddPackingItemPanel travelers={packing.travelers} onClose={() => setIsAddPanelOpen(false)} />
      ) : null}

      <PackingStats items={effectiveItems} />
      <PackingProgressCard totalItems={effectiveItems.length} packedItems={packedCount} />
      <PackingCategoryTabs
        categories={packing.categories}
        items={effectiveItems}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <PackingChecklist items={filteredItems} travelers={packing.travelers} onToggle={handleToggle} />
        </div>
        <div className="xl:col-span-2">
          <PackingTravelerList travelers={packing.travelers} items={effectiveItems} />
        </div>
      </div>
    </section>
  );
}
