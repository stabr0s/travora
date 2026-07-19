import { UserRound } from "lucide-react";

import { Badge, Button } from "@/components/ui";
import type { PersistedPackingItem } from "@/features/packing/types/persisted-packing";
import { cn } from "@/lib/utils";

type PersistedPackingItemRowProps = {
  item: PersistedPackingItem;
  isPending: boolean;
  canEditTrip: boolean;
  onDelete?: (item: PersistedPackingItem) => void;
  onEdit?: (item: PersistedPackingItem) => void;
  onToggle?: (item: PersistedPackingItem) => void;
};

const priorityDetails = {
  essential: { label: "Essential", variant: "error" as const },
  recommended: { label: "Recommended", variant: "default" as const },
  optional: { label: "Optional", variant: "outline" as const },
};

export function PersistedPackingItemRow({
  item,
  isPending,
  canEditTrip,
  onDelete,
  onEdit,
  onToggle,
}: PersistedPackingItemRowProps) {
  const priority = priorityDetails[item.priority || "recommended"];
  const isShared = item.is_shared ?? true;
  const canToggle = canEditTrip && Boolean(onToggle);

  return (
    <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
      <input
        type="checkbox"
        checked={item.is_packed ?? false}
        disabled={isPending || !canEditTrip}
        onChange={() => {
          if (!canToggle) return;
          onToggle?.(item);
        }}
        aria-label={`Mark ${item.name} as ${item.is_packed ? "not packed" : "packed"}`}
        aria-disabled={!canToggle}
        className={cn(
          "mt-0.5 size-5 shrink-0 accent-primary disabled:cursor-not-allowed",
          canToggle ? "cursor-pointer" : "cursor-not-allowed",
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className={cn("break-words font-medium text-foreground", item.is_packed && "text-muted line-through")}>{item.name}</p>
            {item.notes ? <p className="mt-1 break-words text-xs leading-relaxed text-muted">{item.notes}</p> : null}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={priority.variant}>{priority.label}</Badge>
            <Badge variant={isShared ? "success" : "outline"}>{isShared ? "Shared" : "Private label"}</Badge>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
          <span className="capitalize">{item.category || "Other"}</span>
          {item.assigned_to_name ? <span className="inline-flex min-w-0 items-center gap-1.5"><UserRound className="size-3.5 shrink-0" /><span className="break-words">{item.assigned_to_name}</span></span> : null}
        </div>
        {onEdit && onDelete ? (
          <div className="mt-4 flex flex-col gap-2 border-t border-border-subtle pt-3 sm:flex-row">
            <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => onEdit(item)} disabled={isPending}>Edit</Button>
            <Button size="sm" variant="ghost" className="w-full text-error sm:w-auto" onClick={() => onDelete(item)} disabled={isPending}>Delete</Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
