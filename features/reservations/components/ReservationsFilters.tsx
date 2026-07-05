import type { ReservationFilter } from "@/features/reservations/types/reservation";
import { cn } from "@/lib/utils";

const filters: Array<{ label: string; value: ReservationFilter }> = [
  { label: "All", value: "all" },
  { label: "Flights", value: "flights" },
  { label: "Hotels", value: "hotels" },
  { label: "Transport", value: "transport" },
  { label: "Tickets", value: "tickets" },
  { label: "Unpaid", value: "unpaid" },
];

type ReservationsFiltersProps = {
  activeFilter: ReservationFilter;
  onFilterChange: (filter: ReservationFilter) => void;
};

export function ReservationsFilters({
  activeFilter,
  onFilterChange,
}: ReservationsFiltersProps) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-background p-1 shadow-xs" aria-label="Filter reservations">
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
