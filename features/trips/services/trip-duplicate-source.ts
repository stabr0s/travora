import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DuplicateTripOptions } from "@/features/trips/types/persisted-trip";
import type { Database } from "@/types/database";

type TableName = keyof Database["public"]["Tables"];
type TableRow<Name extends TableName> = Database["public"]["Tables"][Name]["Row"];
type SupabaseServerClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

export type DuplicateSourceRows = {
  places: TableRow<"places">[];
  planner: TableRow<"planner_items">[];
  reservations: TableRow<"reservations">[];
  travelLinks: TableRow<"travel_links">[];
  budget: TableRow<"budget_expenses">[];
  packing: TableRow<"packing_items">[];
  importantInfo: TableRow<"trip_important_info"> | null;
};

type SourceError = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

type SourceResult =
  | { data: DuplicateSourceRows; error: null }
  | { data: null; error: SourceError };

function emptyRows<Name extends TableName>() {
  return Promise.resolve({
    data: [] as TableRow<Name>[],
    error: null,
  });
}

export async function loadDuplicateSource(
  supabase: SupabaseServerClient,
  tripId: string,
  options: DuplicateTripOptions,
): Promise<SourceResult> {
  const [places, planner, reservations, budget, packing, importantInfo, travelLinks] =
    await Promise.all([
      options.places
        ? supabase.from("places").select("*").eq("trip_id", tripId)
        : emptyRows<"places">(),
      options.planner
        ? supabase.from("planner_items").select("*").eq("trip_id", tripId)
        : emptyRows<"planner_items">(),
      options.reservations
        ? supabase.from("reservations").select("*").eq("trip_id", tripId)
        : emptyRows<"reservations">(),
      options.budget
        ? supabase.from("budget_expenses").select("*").eq("trip_id", tripId)
        : emptyRows<"budget_expenses">(),
      options.packing
        ? supabase.from("packing_items").select("*").eq("trip_id", tripId)
        : emptyRows<"packing_items">(),
      options.importantInfo
        ? supabase.from("trip_important_info").select("*").eq("trip_id", tripId).maybeSingle()
        : Promise.resolve({
            data: null as TableRow<"trip_important_info"> | null,
            error: null,
          }),
      options.travelLinks
        ? options.reservations
          ? supabase.from("travel_links").select("*").eq("trip_id", tripId)
          : supabase.from("travel_links").select("*")
              .eq("trip_id", tripId)
              .is("reservation_id", null)
        : emptyRows<"travel_links">(),
    ]);

  const error = places.error || planner.error || reservations.error
    || budget.error || packing.error || importantInfo.error || travelLinks.error;
  if (error) return { data: null, error };

  return {
    data: {
      places: places.data || [],
      planner: planner.data || [],
      reservations: reservations.data || [],
      budget: budget.data || [],
      packing: packing.data || [],
      importantInfo: importantInfo.data,
      travelLinks: (travelLinks.data || []).filter(
        (link) => !link.reservation_id || options.reservations,
      ),
    },
    error: null,
  };
}
