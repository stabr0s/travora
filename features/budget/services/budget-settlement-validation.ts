import type { CreateBudgetExpenseInput } from "@/features/budget/types/persisted-budget";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation/is-uuid";

type ServerSupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

type SupabaseDiagnostic = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

type ResolveBudgetSettlementFieldsResult =
  | {
      error: null;
      paidByUserId: string | null;
      splitBetweenUserIds: string[] | null;
      participantsCount: number;
    }
  | { error: string };

function normalizeUuidList(values: string[] | null | undefined) {
  if (!values) return values;
  return values.map((value) => value.trim()).filter(Boolean);
}

async function getActiveParticipantIds(
  supabase: ServerSupabaseClient,
  tripId: string,
  logError: (operation: string, error: SupabaseDiagnostic) => void,
) {
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("owner_id")
    .eq("id", tripId)
    .maybeSingle();

  if (tripError) {
    logError("trip participant owner lookup failed", tripError);
    return null;
  }

  const ids = new Set<string>();
  if (trip?.owner_id) ids.add(trip.owner_id);

  const { data: members, error: membersError } = await supabase
    .from("trip_members")
    .select("user_id")
    .eq("trip_id", tripId)
    .eq("status", "active");

  if (membersError) {
    logError("trip participant lookup failed", membersError);
    return null;
  }

  members?.forEach((member) => ids.add(member.user_id));
  return ids;
}

export async function resolveBudgetSettlementFields(
  supabase: ServerSupabaseClient,
  input: CreateBudgetExpenseInput,
  currentUserId: string,
  logError: (operation: string, error: SupabaseDiagnostic) => void,
): Promise<ResolveBudgetSettlementFieldsResult> {
  if (input.splitType && input.splitType !== "equal") {
    return { error: "Only equal split is supported in this MVP." };
  }

  const activeParticipantIds = await getActiveParticipantIds(supabase, input.tripId, logError);
  if (!activeParticipantIds) {
    return { error: "We couldn't confirm trip participants for this expense." };
  }

  const paidByUserId = input.paidByUserId === undefined
    ? activeParticipantIds.has(currentUserId) ? currentUserId : null
    : input.paidByUserId;

  if (paidByUserId && (!isUuid(paidByUserId) || !activeParticipantIds.has(paidByUserId))) {
    return { error: "Choose an active trip participant as payer." };
  }

  const normalizedSplitIds = normalizeUuidList(input.splitBetweenUserIds);
  if (normalizedSplitIds === undefined) {
    return {
      error: null,
      paidByUserId,
      splitBetweenUserIds: activeParticipantIds.size ? Array.from(activeParticipantIds) : null,
      participantsCount: activeParticipantIds.size || input.participantsCount || 1,
    };
  }

  if (normalizedSplitIds === null || normalizedSplitIds.length === 0) {
    return {
      error: null,
      paidByUserId,
      splitBetweenUserIds: null,
      participantsCount: input.participantsCount || 1,
    };
  }

  const uniqueIds = new Set(normalizedSplitIds);
  if (uniqueIds.size !== normalizedSplitIds.length) {
    return { error: "Split participants cannot include duplicates." };
  }
  if (normalizedSplitIds.some((id) => !isUuid(id) || !activeParticipantIds.has(id))) {
    return { error: "Split expenses only between active trip participants." };
  }

  return {
    error: null,
    paidByUserId,
    splitBetweenUserIds: normalizedSplitIds,
    participantsCount: normalizedSplitIds.length,
  };
}
