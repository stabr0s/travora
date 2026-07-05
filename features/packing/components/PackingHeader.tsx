import { Plus } from "lucide-react";

import { Button, SectionHeader } from "@/components/ui";

type PackingHeaderProps = {
  onAddItem: () => void;
};

export function PackingHeader({ onAddItem }: PackingHeaderProps) {
  return (
    <SectionHeader
      title="Packing"
      description="Coordinate shared essentials and personal items before departure."
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
