"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";
import {
  buildTripSearchIndex,
  searchTripIndex,
  type TripSearchData,
  type TripSearchModule,
  type TripSearchResult,
} from "@/features/trip-detail/utils/trip-search";

type TripQuickSearchProps = TripSearchData & {
  onNavigate: (tab: TripDetailTabId, anchor?: string) => void;
};

const moduleLabels: Record<TripSearchModule, string> = {
  planner: "Planner",
  places: "Places",
  reservations: "Reservations",
  budget: "Budget",
  packing: "Packing",
  "travel-links": "Travel Links",
  "important-info": "Important Info",
};

export function TripQuickSearch({
  places,
  plannerItems,
  reservations,
  budgetExpenses,
  packingItems,
  travelLinks,
  importantInfo,
  onNavigate,
}: TripQuickSearchProps) {
  const [query, setQuery] = useState("");
  const index = useMemo(
    () => buildTripSearchIndex({
      places,
      plannerItems,
      reservations,
      budgetExpenses,
      packingItems,
      travelLinks,
      importantInfo,
    }),
    [
      budgetExpenses,
      importantInfo,
      packingItems,
      places,
      plannerItems,
      reservations,
      travelLinks,
    ],
  );
  const trimmedQuery = query.trim();
  const results = useMemo(
    () => searchTripIndex(index, trimmedQuery),
    [index, trimmedQuery],
  );
  const isSearching = trimmedQuery.length >= 2;

  function handleResultClick(result: TripSearchResult) {
    setQuery("");
    onNavigate(result.targetTab, result.targetAnchor);
  }

  return (
    <Card padding="sm" className="relative">
      <label htmlFor="trip-quick-search" className="sr-only">
        Search this trip
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          id="trip-quick-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search this trip…"
          autoComplete="off"
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Clear trip search"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {isSearching ? (
        <div className="mt-2 overflow-hidden rounded-xl border border-border-subtle bg-background">
          {results.length ? (
            <div role="list" aria-label="Trip search results">
              {results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => handleResultClick(result)}
                  className="flex w-full min-w-0 items-start gap-3 border-b border-border-subtle px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30"
                >
                  <Badge variant="outline" className="mt-0.5 shrink-0">
                    {moduleLabels[result.module]}
                  </Badge>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {result.title}
                    </span>
                    {result.subtitle ? (
                      <span className="mt-0.5 block truncate text-xs text-muted">
                        {result.subtitle}
                      </span>
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="px-3 py-4 text-center text-sm text-muted">
              No results in this trip.
            </p>
          )}
        </div>
      ) : null}
    </Card>
  );
}
