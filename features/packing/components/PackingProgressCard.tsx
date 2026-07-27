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
  const missingItems = Math.max(0, totalItems - packedItems);

  return (
    <Card padding="sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            {mode === "personal" ? "Your packing progress" : "Packing progress"}
          </h2>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {packedItems} / {totalItems} packed
            </p>
            <p className="text-xs text-muted">{missingItems} missing</p>
          </div>
        </div>
        <Badge variant={percentage === 100 ? "success" : "default"}>{percentage}%</Badge>
      </div>
      <Progress
        value={percentage}
        className="mt-3 h-2"
        indicatorClassName={percentage === 100 ? "bg-success" : "bg-primary"}
      />
    </Card>
  );
}
