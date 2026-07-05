import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border",
        "bg-surface-elevated px-6 py-16 text-center shadow-sm",
        className,
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-surface shadow-xs">
        <Icon className="size-6 text-muted" strokeWidth={1.5} />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
        {description}
      </p>

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
