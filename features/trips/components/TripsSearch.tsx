import { Search, X } from "lucide-react";

type TripsSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

export function TripsSearch({ query, onQueryChange }: TripsSearchProps) {
  return (
    <div className="relative min-w-0">
      <label htmlFor="trips-search" className="sr-only">Search trips</label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <input
        id="trips-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search trips…"
        autoComplete="off"
        className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
      />
      {query ? (
        <button
          type="button"
          onClick={() => onQueryChange("")}
          className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label="Clear trip search"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
