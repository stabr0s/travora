import { Plus } from "lucide-react";

import { Button, SectionHeader } from "@/components/ui";

type PlacesHeaderProps = {
  onAddPlace?: () => void;
};

export function PlacesHeader({ onAddPlace }: PlacesHeaderProps) {
  return (
    <SectionHeader
      title="Places"
      description="Saved stops, meals, stays, and ideas for this trip."
      className="mb-0"
      action={onAddPlace ? (
        <Button size="md" onClick={onAddPlace}>
          <Plus className="size-4" />
          Add place
        </Button>
      ) : undefined}
    />
  );
}
