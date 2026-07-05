import { Progress } from "@/components/ui";

type DayLoadIndicatorProps = {
  value: number;
};

export function DayLoadIndicator({ value }: DayLoadIndicatorProps) {
  const details =
    value >= 85
      ? { label: "Very full", color: "bg-error" }
      : value >= 65
        ? { label: "Busy", color: "bg-warning" }
        : value > 0
          ? { label: "Balanced", color: "bg-success" }
          : { label: "Open day", color: "bg-muted-foreground" };

  return (
    <div className="w-full max-w-52 space-y-2">
      <div className="flex items-center justify-between gap-4 text-xs">
        <span className="font-medium text-foreground">Day load</span>
        <span className="text-muted">{details.label} · {value}%</span>
      </div>
      <Progress value={value} indicatorClassName={details.color} />
    </div>
  );
}
