import { Plus } from "lucide-react";

import { Button, SectionHeader } from "@/components/ui";

type PlacesHeaderProps = {
  onAddPlace: () => void;
};

export function PlacesHeader({ onAddPlace }: PlacesHeaderProps) {
  return (
    <SectionHeader
      title="Places"
      description="Collect the sights, meals, stays, and small discoveries that will shape this trip."
      className="mb-0"
      action={
        <Button size="md" onClick={onAddPlace}>
          <Plus className="size-4" />
          Add place
        </Button>
      }
    />
  );
}
