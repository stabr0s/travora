"use client";

import { useState } from "react";
import { CalendarX2 } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { AddPlanItemPanel } from "@/features/planner/components/AddPlanItemPanel";
import { DayPlanCard } from "@/features/planner/components/DayPlanCard";
import { DaySelector } from "@/features/planner/components/DaySelector";
import { PlannerHeader } from "@/features/planner/components/PlannerHeader";
import { PlannerStats } from "@/features/planner/components/PlannerStats";
import { getMockPlannerByTripId } from "@/features/planner/data/mock-planner";

type PlannerSectionProps = {
  tripId: string;
};

export function PlannerSection({ tripId }: PlannerSectionProps) {
  const planner = getMockPlannerByTripId(tripId);
  const [selectedDayId, setSelectedDayId] = useState(
    planner?.days[0]?.id ?? "",
  );
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

  if (!planner || planner.days.length === 0) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="No trip plan yet"
        description="Planning days will appear here once this trip has a draft itinerary."
        className="min-h-96"
      />
    );
  }

  const selectedDay =
    planner.days.find((day) => day.id === selectedDayId) ?? planner.days[0];

  return (
    <section className="space-y-6">
      <PlannerHeader onAddItem={() => setIsAddPanelOpen(true)} />

      {isAddPanelOpen ? (
        <AddPlanItemPanel
          days={planner.days}
          selectedDayId={selectedDay.id}
          onClose={() => setIsAddPanelOpen(false)}
        />
      ) : null}

      <PlannerStats days={planner.days} />
      <DaySelector
        days={planner.days}
        selectedDayId={selectedDay.id}
        onDayChange={setSelectedDayId}
      />
      <DayPlanCard day={selectedDay} />
    </section>
  );
}
