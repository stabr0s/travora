import type { PlannerDay } from "@/features/planner/types/planner";
import { cn } from "@/lib/utils";

type DaySelectorProps = {
  days: PlannerDay[];
  selectedDayId: string;
  onDayChange: (dayId: string) => void;
};

function formatDay(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function DaySelector({
  days,
  selectedDayId,
  onDayChange,
}: DaySelectorProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface-elevated p-2 shadow-sm">
      <div className="flex min-w-max gap-2" role="tablist" aria-label="Trip days">
        {days.map((day) => {
          const isSelected = day.id === selectedDayId;

          return (
            <button
              key={day.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onDayChange(day.id)}
              className={cn(
                "min-w-32 rounded-xl px-4 py-3 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-surface text-foreground hover:bg-primary-subtle",
              )}
            >
              <span className={cn("block text-xs font-medium", isSelected ? "text-white/70" : "text-muted")}>
                Day {day.dayNumber} · {formatDay(day.date)}
              </span>
              <span className="mt-1 block text-sm font-semibold">{day.city}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
