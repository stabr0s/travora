import Link from "next/link";
import { Plane, Plus } from "lucide-react";

import { EmptyState, SectionHeader } from "@/components/ui";
import { DashboardHero } from "@/features/dashboard/components/DashboardHero";
import { GettingStartedCard } from "@/features/dashboard/components/GettingStartedCard";
import { NextTripCard } from "@/features/dashboard/components/NextTripCard";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { RecentPlaces } from "@/features/dashboard/components/RecentPlaces";
import { RecentTrips } from "@/features/dashboard/components/RecentTrips";
import { StatsGrid } from "@/features/dashboard/components/StatsGrid";
import { UpcomingReservations } from "@/features/dashboard/components/UpcomingReservations";
import { mockDashboardData } from "@/features/dashboard/data/mock-dashboard";
import type { DashboardData } from "@/features/dashboard/types/dashboard";

type DashboardScreenProps = {
  data?: DashboardData;
};

export function DashboardScreen({ data = mockDashboardData }: DashboardScreenProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard"
        description="Overview of your trips, progress, and upcoming plans."
        action={
          <Link
            href="/trips/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
          >
            <Plus className="size-4" />
            New trip
          </Link>
        }
      />

      <DashboardHero
        user={data.user}
        persisted={data.isPersisted}
        tripCount={Number(data.stats[0]?.value || 0)}
      />

      {data.nextTrip ? (
        <NextTripCard trip={data.nextTrip} />
      ) : (
        <EmptyState
          icon={Plane}
          title="No upcoming trips yet"
          description="Create a trip with dates to make it your next adventure."
          className="min-h-56"
          action={
            <Link
              href="/trips/new"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
            >
              Create trip
            </Link>
          }
        />
      )}

      {data.isPersisted ? <RecentTrips trips={data.recentTrips} /> : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <QuickActions actions={data.quickActions} />
        <GettingStartedCard />
      </div>

      <StatsGrid stats={data.stats} />

      {!data.isPersisted ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <RecentPlaces places={data.recentPlaces} />
          <UpcomingReservations reservations={data.upcomingReservations} />
        </div>
      ) : null}
    </div>
  );
}
