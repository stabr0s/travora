"use client";

import Link from "next/link";
import { useState } from "react";
import { Plane } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { BudgetSection } from "@/features/budget";
import { MapSection } from "@/features/map";
import { PackingSection } from "@/features/packing";
import { ParticipantsSection } from "@/features/participants";
import { PlacesSection } from "@/features/places";
import { PlannerSection } from "@/features/planner";
import { ReservationsSection } from "@/features/reservations";
import { TripHero } from "@/features/trip-detail/components/TripHero";
import { TripOverview } from "@/features/trip-detail/components/TripOverview";
import { TripTabs } from "@/features/trip-detail/components/TripTabs";
import { getMockTripDetail } from "@/features/trip-detail/data/mock-trip-detail";
import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";

type TripDetailScreenProps = {
  tripId: string;
};

export function TripDetailScreen({ tripId }: TripDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<TripDetailTabId>("overview");
  const trip = getMockTripDetail(tripId);

  if (!trip) {
    return (
      <EmptyState
        icon={Plane}
        title="Trip not found"
        description="This trip is not available in your travel plans. Return to Trips and choose another journey."
        className="min-h-[32rem]"
        action={
          <Link
            href="/trips"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
          >
            Back to trips
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <TripHero trip={trip} />
      <TripTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "overview" ? (
        <TripOverview trip={trip} />
      ) : activeTab === "places" ? (
        <PlacesSection tripId={tripId} />
      ) : activeTab === "map" ? (
        <MapSection tripId={tripId} />
      ) : activeTab === "plan" ? (
        <PlannerSection tripId={tripId} />
      ) : activeTab === "reservations" ? (
        <ReservationsSection tripId={tripId} />
      ) : activeTab === "budget" ? (
        <BudgetSection tripId={tripId} />
      ) : activeTab === "packing" ? (
        <PackingSection tripId={tripId} />
      ) : (
        <ParticipantsSection tripId={tripId} />
      )}
    </div>
  );
}
