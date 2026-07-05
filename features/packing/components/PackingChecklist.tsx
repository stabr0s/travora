import { ListX } from "lucide-react";

import { Card, EmptyState } from "@/components/ui";
import { PackingItemRow } from "@/features/packing/components/PackingItemRow";
import type {
  PackingCategory,
  PackingItem,
  PackingTraveler,
} from "@/features/packing/types/packing";

const categoryLabels: Record<PackingCategory, string> = {
  documents: "Documents", electronics: "Electronics", clothes: "Clothes",
  toiletries: "Toiletries", health: "Health", travel: "Travel", other: "Other",
};

type PackingChecklistProps = {
  items: PackingItem[];
  travelers: PackingTraveler[];
  onToggle: (itemId: string) => void;
};

export function PackingChecklist({
  items,
  travelers,
  onToggle,
}: PackingChecklistProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={ListX}
        title="No items in this category"
        description="Choose another category or open the add item preview."
        className="min-h-80"
      />
    );
  }

  const categories = Array.from(new Set(items.map((item) => item.category)));

  return (
    <div className="space-y-5">
      {categories.map((category) => {
        const categoryItems = items.filter((item) => item.category === category);

        return (
          <Card key={category} padding="none" className="overflow-hidden hover:shadow-sm">
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
              <h2 className="font-semibold tracking-tight text-foreground">{categoryLabels[category]}</h2>
              <span className="text-xs text-muted">{categoryItems.length} items</span>
            </div>
            <div className="divide-y divide-border-subtle">
              {categoryItems.map((item) => (
                <PackingItemRow
                  key={item.id}
                  item={item}
                  assignedTraveler={travelers.find((traveler) => traveler.id === item.assignedTo)?.name}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
