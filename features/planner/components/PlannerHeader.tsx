import { Plus } from "lucide-react";

import { Button, SectionHeader } from "@/components/ui";

type PlannerHeaderProps = {
  onAddItem: () => void;
};

export function PlannerHeader({ onAddItem }: PlannerHeaderProps) {
  return (
    <SectionHeader
      title="Plan"
      description="Shape each day around fixed bookings, places, meals, and breathing room."
      className="mb-0"
      action={
        <Button size="md" onClick={onAddItem}>
          <Plus className="size-4" />
          Add item
        </Button>
      }
    />
  );
}
