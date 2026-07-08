import {
  BedDouble,
  CalendarRange,
  CircleDollarSign,
  LayoutDashboard,
  Luggage,
  MapPin,
  Settings,
  Users,
} from "lucide-react";

import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "places", label: "Places", icon: MapPin },
  { id: "plan", label: "Plan", icon: CalendarRange },
  { id: "reservations", label: "Reservations", icon: BedDouble },
  { id: "budget", label: "Budget", icon: CircleDollarSign },
  { id: "packing", label: "Packing", icon: Luggage },
  { id: "participants", label: "Participants", icon: Users },
] as const;

const settingsTab = { id: "settings", label: "Settings", icon: Settings } as const;

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
      className="max-w-full overflow-x-auto rounded-2xl border border-border bg-surface-elevated p-1.5 shadow-sm"
    >
      <div className="flex min-w-max gap-1">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "inline-flex h-11 scroll-mx-3 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted hover:bg-surface hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
