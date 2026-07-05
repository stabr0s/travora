import type {
  PackingCategory,
  PackingCategoryFilter,
  PackingItem,
} from "@/features/packing/types/packing";
import { cn } from "@/lib/utils";

const categoryLabels: Record<PackingCategory, string> = {
  documents: "Documents", electronics: "Electronics", clothes: "Clothes",
  toiletries: "Toiletries", health: "Health", travel: "Travel", other: "Other",
};

type PackingCategoryTabsProps = {
  categories: PackingCategory[];
  items: PackingItem[];
  activeCategory: PackingCategoryFilter;
  onCategoryChange: (category: PackingCategoryFilter) => void;
};

export function PackingCategoryTabs({
  categories,
  items,
  activeCategory,
  onCategoryChange,
}: PackingCategoryTabsProps) {
  const tabs: Array<{ value: PackingCategoryFilter; label: string; count: number }> = [
    { value: "all", label: "All", count: items.length },
    ...categories.map((category) => ({
      value: category,
      label: categoryLabels[category],
      count: items.filter((item) => item.category === category).length,
    })),
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface-elevated p-1.5 shadow-sm">
      <div className="flex min-w-max gap-1" role="tablist" aria-label="Packing categories">
        {tabs.map((tab) => {
          const isActive = tab.value === activeCategory;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(tab.value)}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted hover:bg-surface hover:text-foreground",
              )}
            >
              {tab.label}
              <span className={cn("rounded-full px-1.5 py-0.5 text-[10px]", isActive ? "bg-white/15" : "bg-surface")}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
