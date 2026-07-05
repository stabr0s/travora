import { Wallet } from "lucide-react";

import { Badge, EmptyState, SectionHeader } from "@/components/ui";

export default function BudgetPage() {
  return (
    <>
      <SectionHeader
        title="Budget"
        description="Track costs per category and see spending per person at a glance."
        action={<Badge variant="outline">Per person</Badge>}
      />

      <EmptyState
        icon={Wallet}
        title="No budget data"
        description="Budget summaries will appear here once you add trips and reservations."
      />
    </>
  );
}
