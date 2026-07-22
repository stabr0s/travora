import Link from "next/link";
import { Plane, Plus } from "lucide-react";

import { EmptyState, SectionHeader } from "@/components/ui";
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
    <div className="space-y-4">
      <SectionHeader
        title="Dashboard"
        description="Open the trip that needs attention and keep planning moving."
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

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)]">
        {data.nextTrip ? (
          <NextTripCard trip={data.nextTrip} />
        ) : (
          <EmptyState
            icon={Plane}
            title="No upcoming trips yet"
            description="Create a trip with dates to make it your next adventure."
            className="min-h-44"
            action={
              <Link
                href="/trips/new"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
              >
                Create trip
              </Link>
            }
          />
        )}
        {data.isPersisted ? <RecentTrips trips={data.recentTrips} /> : <StatsGrid stats={data.stats} />}
      </div>

      {data.isPersisted ? <StatsGrid stats={data.stats} /> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <QuickActions actions={data.quickActions} />
        <GettingStartedCard />
      </div>

      {!data.isPersisted ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <RecentPlaces places={data.recentPlaces} />
          <UpcomingReservations reservations={data.upcomingReservations} />
        </div>
      ) : null}
    </div>
  );
}
