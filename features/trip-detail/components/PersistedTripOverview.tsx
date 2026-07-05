import { DatabaseZap } from "lucide-react";

import { EmptyState } from "@/components/ui";

export function PersistedTripOverview() {
  return (
    <EmptyState
      icon={DatabaseZap}
      title="Your trip is saved"
      description="Basic trip information is connected to Supabase. Places are available in the Places tab, while the remaining planning modules will be connected in later tasks."
      className="min-h-80"
    />
  );
}
