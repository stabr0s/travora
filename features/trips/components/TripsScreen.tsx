"use client";

import { useMemo, useState } from "react";

import { TripsAccessNotice } from "@/features/trips/components/TripsAccessNotice";
import { TripsFilters } from "@/features/trips/components/TripsFilters";
import { createFirstTripAction, TripsGrid } from "@/features/trips/components/TripsGrid";
import { TripsHeader } from "@/features/trips/components/TripsHeader";
import { TripsSearch } from "@/features/trips/components/TripsSearch";
import { TripsStats } from "@/features/trips/components/TripsStats";
import type { Trip, TripFilter } from "@/features/trips/types/trip";
import {
  organizeTrips,
  searchTrips,
} from "@/features/trips/utils/trip-organization";

type TripsScreenProps = {
  trips: Trip[];
  mode?: "saved" | "demo" | "fallback";
  today: string;
};

export function TripsScreen({ trips, mode = "saved", today }: TripsScreenProps) {
  const [activeFilter, setActiveFilter] = useState<TripFilter>("all");
  const [query, setQuery] = useState("");

  const statusFilteredTrips = useMemo(
    () => activeFilter === "all"
      ? trips
      : trips.filter((trip) => trip.status === activeFilter),
    [activeFilter, trips],
  );
  const filteredTrips = useMemo(
    () => searchTrips(statusFilteredTrips, query),
    [query, statusFilteredTrips],
  );
  const groups = useMemo(
    () => organizeTrips(filteredTrips, today),
    [filteredTrips, today],
  );
  const isSavedEmptyState = mode === "saved" && trips.length === 0;
  const isSearchActive = Boolean(query.trim());

  return (
    <div className="space-y-4">
      <TripsHeader />
      {mode !== "saved" ? <TripsAccessNotice mode={mode} /> : null}
      <TripsStats trips={trips} />
      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto]">
        <TripsSearch query={query} onQueryChange={setQuery} />
        <TripsFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>
      <TripsGrid
        groups={groups}
        showNewTripCard={!isSearchActive && trips.length > 0}
        emptyTitle={isSearchActive
          ? "No trips match your search."
          : isSavedEmptyState ? "Create your first trip" : undefined}
        emptyDescription={isSearchActive
          ? "Try another trip name or destination."
          : isSavedEmptyState
            ? "Start with the essentials now. Places, plans, reservations, budget, packing, and access can follow."
            : undefined}
        emptyAction={isSavedEmptyState ? createFirstTripAction() : undefined}
      />
    </div>
  );
}
