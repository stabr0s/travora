"use client";

import { useActionState, useMemo, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";

import { Button, Card, EmptyState, SectionHeader } from "@/components/ui";
import { createPlannerItemAction } from "@/features/planner/actions/planner-actions";
import { PersistedAddPlanItemPanel } from "@/features/planner/components/PersistedAddPlanItemPanel";
import { PersistedPlanItemCard } from "@/features/planner/components/PersistedPlanItemCard";
import type {
  CreatePlannerItemActionState,
  PersistedPlannerItem,
} from "@/features/planner/types/persisted-planner";

type PersistedPlannerSectionProps = {
  tripId: string;
  items: PersistedPlannerItem[];
  loadError?: string;
};

const initialCreateState: CreatePlannerItemActionState = { status: "idle" };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function PersistedPlannerSection({
  tripId,
  items,
  loadError,
}: PersistedPlannerSectionProps) {
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [createState, createAction, isPending] = useActionState(
    createPlannerItemAction,
    initialCreateState,
  );
  const groups = useMemo(() => {
    const grouped = new Map<string, PersistedPlannerItem[]>();

    items.forEach((item) => {
      const key = item.date || "unscheduled";
      grouped.set(key, [...(grouped.get(key) || []), item]);
    });

    return Array.from(grouped.entries());
  }, [items]);

  return (
    <section className="space-y-6">
      <SectionHeader
        title="Plan"
        description="Organize dated activities and keep flexible ideas ready for later."
        className="mb-0"
        action={
          <Button size="md" onClick={() => setIsAddPanelOpen(true)}>
            <Plus className="size-4" />
            Add item
          </Button>
        }
      />

      {isAddPanelOpen ? (
        <PersistedAddPlanItemPanel
          tripId={tripId}
          actionState={createState}
          formAction={createAction}
          isPending={isPending}
          onClose={() => setIsAddPanelOpen(false)}
        />
      ) : null}

      {loadError ? <Card padding="sm" className="text-sm text-error">{loadError}</Card> : null}

      {!items.length ? (
        <EmptyState
          icon={CalendarDays}
          title="No plan items yet"
          description="Start shaping this trip by adding a dated activity or an unscheduled idea."
          action={<Button onClick={() => setIsAddPanelOpen(true)}>Add first item</Button>}
        />
      ) : (
        <div className="space-y-8">
          {groups.map(([date, groupItems]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-baseline justify-between gap-4 border-b border-border-subtle pb-2">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {date === "unscheduled" ? "Unscheduled" : formatDate(date)}
                </h2>
                <span className="text-xs text-muted">
                  {groupItems.length} {groupItems.length === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="space-y-3">
                {groupItems.map((item) => <PersistedPlanItemCard key={item.id} item={item} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
