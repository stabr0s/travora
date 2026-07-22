"use client";

import { useMemo, useState } from "react";

import { TripsAccessNotice } from "@/features/trips/components/TripsAccessNotice";
import { TripsFilters } from "@/features/trips/components/TripsFilters";
import { createFirstTripAction, TripsGrid } from "@/features/trips/components/TripsGrid";
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
  const isSavedEmptyState = mode === "saved" && trips.length === 0;

  return (
    <div className="space-y-5">
      <TripsHeader />
      {mode !== "saved" ? <TripsAccessNotice mode={mode} /> : null}
      <TripsStats trips={trips} />
      <TripsFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <TripsGrid
        trips={filteredTrips}
        emptyTitle={isSavedEmptyState ? "Create your first trip" : undefined}
        emptyDescription={isSavedEmptyState
          ? "Start with the essentials now. Places, plans, reservations, budget, packing, and access can follow."
          : undefined}
        emptyAction={isSavedEmptyState ? createFirstTripAction() : undefined}
      />
    </div>
  );
}
