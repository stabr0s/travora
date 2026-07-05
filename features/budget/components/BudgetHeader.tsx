import { Plus } from "lucide-react";

import { Button, SectionHeader } from "@/components/ui";

type BudgetHeaderProps = {
  onAddExpense: () => void;
};

export function BudgetHeader({ onAddExpense }: BudgetHeaderProps) {
  return (
    <SectionHeader
      title="Budget"
      description="See the shape of trip spending, shared costs, and what remains per traveler."
      className="mb-0"
      action={
        <Button size="md" onClick={onAddExpense}>
          <Plus className="size-4" />
          Add expense
        </Button>
      }
    />
  );
}
