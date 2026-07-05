"use client";

import { CalendarDays, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui";
import type { DashboardUser } from "@/features/dashboard/types/dashboard";

type DashboardHeroProps = {
  user: DashboardUser;
};

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardHero({ user }: DashboardHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6 shadow-sm md:p-8">
      <div className="absolute -right-8 -top-8 size-40 rounded-full bg-primary-subtle/60 blur-2xl" />
      <div className="absolute -bottom-12 right-16 size-32 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Badge variant="default" className="gap-1">
            <Sparkles className="size-3" />
            Travel planner
          </Badge>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {getGreeting()}, {user.name}
          </h2>

          <p className="max-w-xl text-sm leading-relaxed text-muted md:text-base">
            Your next adventure is coming up. Review your itinerary, places, and
            reservations — everything in one place.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface px-4 py-3 shadow-xs">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-subtle">
            <CalendarDays className="size-5 text-primary" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">This week</p>
            <p className="text-sm font-semibold text-foreground">3 trips in progress</p>
          </div>
        </div>
      </div>
    </section>
  );
}
