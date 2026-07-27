import type {
  PackingCategory,
  PackingCategoryFilter,
  PackingItem,
} from "@/features/packing/types/packing";
import { packingCategoryLabels } from "@/features/packing/utils/packing-display";
import { cn } from "@/lib/utils";

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
    ...categories
      .map((category) => ({
        value: category,
        label: packingCategoryLabels[category],
        count: items.filter((item) => item.category === category).length,
      }))
      .filter((tab) => tab.count > 0 || tab.value === activeCategory),
  ];

  return (
    <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-background p-0.5">
      <div className="flex min-w-max gap-0.5" role="tablist" aria-label="Packing categories">
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
                "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                isActive
                  ? "bg-primary text-primary-foreground"
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
