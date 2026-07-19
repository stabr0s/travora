import { Luggage } from "lucide-react";

import { Badge, Card, Progress } from "@/components/ui";

type PackingProgressCardProps = {
  totalItems: number;
  packedItems: number;
  mode?: "shared" | "personal";
};

export function PackingProgressCard({
  totalItems,
  packedItems,
  mode = "shared",
}: PackingProgressCardProps) {
  const percentage = totalItems
    ? Math.round((packedItems / totalItems) * 100)
    : 0;

  return (
    <Card padding="md" className="hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <Luggage className="size-5 text-primary" />
          </span>
          <div>
            <h2 className="font-semibold tracking-tight text-foreground">
              {mode === "personal" ? "Your packing progress" : "Packing progress"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {mode === "personal"
                ? `${packedItems} of ${totalItems} items are packed by you.`
                : `${packedItems} of ${totalItems} items are ready.`}
            </p>
          </div>
        </div>
        <Badge variant={percentage === 100 ? "success" : "default"}>{percentage}%</Badge>
      </div>
      <Progress
        value={percentage}
        className="mt-6 h-3"
        indicatorClassName={percentage === 100 ? "bg-success" : "bg-primary"}
      />
    </Card>
  );
}
