"use client";

import { CalendarDays, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui";
import type { DashboardUser } from "@/features/dashboard/types/dashboard";

type DashboardHeroProps = {
  user: DashboardUser;
  tripCount?: number;
  persisted?: boolean;
};

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardHero({ user, tripCount = 3, persisted = false }: DashboardHeroProps) {
  return (
    <section className="rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Badge variant="outline" className="gap-1">
            <Sparkles className="size-3" />
            Workspace
          </Badge>

          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            {getGreeting()}, {user.name}
          </h2>

          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            {persisted
              ? "Review your saved trips, open recent workspaces, and keep planning momentum."
              : "Your next adventure is coming up. Review your itinerary, places, and reservations — everything in one place."}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface px-3 py-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary-subtle">
            <CalendarDays className="size-4 text-primary" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">This week</p>
            <p className="text-sm font-semibold text-foreground">
              {persisted ? `${tripCount} saved trips` : "3 trips in progress"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
