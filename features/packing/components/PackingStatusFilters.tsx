import type { PackingStatusFilter } from "@/features/packing/utils/packing-display";
import { cn } from "@/lib/utils";

type PackingStatusFiltersProps = {
  activeFilter: PackingStatusFilter;
  totalCount: number;
  packedCount: number;
  onChange: (filter: PackingStatusFilter) => void;
};

export function PackingStatusFilters({
  activeFilter,
  totalCount,
  packedCount,
  onChange,
}: PackingStatusFiltersProps) {
  const filters = [
    { value: "all" as const, label: "All", count: totalCount },
    { value: "missing" as const, label: "Missing", count: totalCount - packedCount },
    { value: "packed" as const, label: "Packed", count: packedCount },
  ];

  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-background p-0.5" aria-label="Personal packing status">
      {filters.map((filter) => {
        const isActive = filter.value === activeFilter;

        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(filter.value)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted hover:bg-surface hover:text-foreground",
            )}
          >
            {filter.label}
            <span className={cn("rounded-full px-1.5 py-0.5 text-[10px]", isActive ? "bg-white/15" : "bg-surface")}>
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
