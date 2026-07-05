import type { MapFilter } from "@/features/map/types/map";
import { cn } from "@/lib/utils";

const filters: Array<{ label: string; value: MapFilter }> = [
  { label: "All", value: "all" },
  { label: "Planned", value: "planned" },
  { label: "Must see", value: "must-see" },
  { label: "Hotels", value: "hotels" },
  { label: "Restaurants", value: "restaurants" },
];

type MapFiltersProps = {
  activeFilter: MapFilter;
  onFilterChange: (filter: MapFilter) => void;
};

export function MapFilters({
  activeFilter,
  onFilterChange,
}: MapFiltersProps) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-background p-1 shadow-xs" aria-label="Filter map points">
      {filters.map((filter) => {
        const isActive = filter.value === activeFilter;

        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "h-9 shrink-0 rounded-lg px-4 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              isActive
                ? "bg-surface-elevated text-foreground shadow-sm"
                : "text-muted hover:text-foreground",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
