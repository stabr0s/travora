import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "places", label: "Places" },
  { id: "plan", label: "Plan" },
  { id: "reservations", label: "Reservations" },
  { id: "budget", label: "Budget" },
  { id: "packing", label: "Packing" },
  { id: "participants", label: "Participants" },
] as const;

const settingsTab = { id: "settings", label: "Settings" } as const;

type TripTabsProps = {
  activeTab: TripDetailTabId;
  onTabChange: (tab: TripDetailTabId) => void;
  showSettings?: boolean;
};

export function TripTabs({ activeTab, onTabChange, showSettings = false }: TripTabsProps) {
  const visibleTabs = showSettings ? [...tabs, settingsTab] : tabs;

  return (
    <nav
      aria-label="Trip sections"
      className="max-w-full overflow-x-auto rounded-lg border border-border bg-background p-0.5"
    >
      <div className="flex min-w-max gap-1">
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "inline-flex h-8 scroll-mx-3 items-center whitespace-nowrap rounded-md px-2.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:bg-surface hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
