"use client";

import { useMemo, useState } from "react";

import { TripsFilters } from "@/features/trips/components/TripsFilters";
import { TripsGrid } from "@/features/trips/components/TripsGrid";
import { TripsHeader } from "@/features/trips/components/TripsHeader";
import { TripsStats } from "@/features/trips/components/TripsStats";
import { mockTrips } from "@/features/trips/data/mock-trips";
import type { Trip, TripFilter } from "@/features/trips/types/trip";

type TripsScreenProps = {
  trips?: Trip[];
};

export function TripsScreen({ trips = mockTrips }: TripsScreenProps) {
  const [activeFilter, setActiveFilter] = useState<TripFilter>("all");

  const filteredTrips = useMemo(
    () =>
      activeFilter === "all"
        ? trips
        : trips.filter((trip) => trip.status === activeFilter),
    [activeFilter, trips],
  );

  return (
    <div className="space-y-8">
      <TripsHeader />
      <TripsStats trips={trips} />
      <TripsFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <TripsGrid trips={filteredTrips} />
    </div>
  );
}
