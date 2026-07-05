"use client";

import { useMemo, useState } from "react";

import { TripsAccessNotice } from "@/features/trips/components/TripsAccessNotice";
import { TripsFilters } from "@/features/trips/components/TripsFilters";
import { TripsGrid } from "@/features/trips/components/TripsGrid";
import { TripsHeader } from "@/features/trips/components/TripsHeader";
import { TripsStats } from "@/features/trips/components/TripsStats";
import type { Trip, TripFilter } from "@/features/trips/types/trip";

type TripsScreenProps = {
  trips: Trip[];
  mode?: "saved" | "demo" | "fallback";
};

export function TripsScreen({ trips, mode = "saved" }: TripsScreenProps) {
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
      {mode !== "saved" ? <TripsAccessNotice mode={mode} /> : null}
      <TripsStats trips={trips} />
      <TripsFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <TripsGrid trips={filteredTrips} />
    </div>
  );
}
