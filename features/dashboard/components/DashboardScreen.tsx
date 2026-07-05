import { Plus } from "lucide-react";

import { Button, SectionHeader } from "@/components/ui";
import { DashboardHero } from "@/features/dashboard/components/DashboardHero";
import { NextTripCard } from "@/features/dashboard/components/NextTripCard";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { RecentPlaces } from "@/features/dashboard/components/RecentPlaces";
import { StatsGrid } from "@/features/dashboard/components/StatsGrid";
import { UpcomingReservations } from "@/features/dashboard/components/UpcomingReservations";
import { mockDashboardData } from "@/features/dashboard/data/mock-dashboard";
import type { DashboardData } from "@/features/dashboard/types/dashboard";

type DashboardScreenProps = {
  data?: DashboardData;
};

export function DashboardScreen({ data = mockDashboardData }: DashboardScreenProps) {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Dashboard"
        description="Overview of your trips, progress, and upcoming plans."
        action={
          <Button size="md">
            <Plus className="size-4" />
            New trip
          </Button>
        }
      />

      <DashboardHero user={data.user} />

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <NextTripCard trip={data.nextTrip} />
        </div>
        <div className="xl:col-span-2">
          <QuickActions actions={data.quickActions} />
        </div>
      </div>

      <StatsGrid stats={data.stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentPlaces places={data.recentPlaces} />
        <UpcomingReservations reservations={data.upcomingReservations} />
      </div>
    </div>
  );
}
