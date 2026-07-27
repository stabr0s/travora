import { Pencil, Trash2, UserRound } from "lucide-react";

import { Badge, Button } from "@/components/ui";
import type { PersistedPackingItemWithPersonalState } from "@/features/packing/types/persisted-packing";
import {
  getPackingCategory,
  packingCategoryLabels,
} from "@/features/packing/utils/packing-display";
import { cn } from "@/lib/utils";

type PersistedPackingItemRowProps = {
  item: PersistedPackingItemWithPersonalState;
  isPending: boolean;
  canTogglePersonalState: boolean;
  onDelete?: (item: PersistedPackingItemWithPersonalState) => void;
  onEdit?: (item: PersistedPackingItemWithPersonalState) => void;
  onToggle?: (item: PersistedPackingItemWithPersonalState) => void;
};

const priorityDetails = {
  essential: { label: "Essential", variant: "error" as const },
  recommended: { label: "Recommended", variant: "default" as const },
  optional: { label: "Optional", variant: "outline" as const },
};

export function PersistedPackingItemRow({
  item,
  isPending,
  canTogglePersonalState,
  onDelete,
  onEdit,
  onToggle,
}: PersistedPackingItemRowProps) {
  const priority = priorityDetails[item.priority || "recommended"];
  const isShared = item.is_shared ?? true;
  const canToggle = canTogglePersonalState && Boolean(onToggle);
  const categoryLabel = packingCategoryLabels[getPackingCategory(item.category)];

  return (
    <div className="flex min-w-0 items-start gap-2 px-3 py-2.5 sm:px-4">
      <label className={cn(
        "-ml-1 flex size-10 shrink-0 items-center justify-center rounded-lg",
        canToggle ? "cursor-pointer hover:bg-surface" : "cursor-not-allowed",
      )}>
        <input
          type="checkbox"
          checked={item.isPackedForCurrentUser}
          disabled={isPending || !canToggle}
          onChange={() => {
            if (!canToggle) return;
            onToggle?.(item);
          }}
          aria-label={`Mark ${item.name} as ${item.isPackedForCurrentUser ? "not packed" : "packed"} for you`}
          aria-disabled={!canToggle}
          className="size-5 shrink-0 accent-primary disabled:cursor-not-allowed"
        />
      </label>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cn("break-words font-medium text-foreground", item.isPackedForCurrentUser && "text-muted line-through")}>{item.name}</p>
          </div>
          {onEdit && onDelete ? (
            <div className="flex shrink-0 gap-1">
              <Button size="sm" variant="ghost" className="size-8 px-0" onClick={() => onEdit(item)} disabled={isPending} aria-label={`Edit ${item.name}`}>
                <Pencil className="size-3.5" />
              </Button>
              <Button size="sm" variant="ghost" className="size-8 px-0 text-error" onClick={() => onDelete(item)} disabled={isPending} aria-label={`Delete ${item.name}`}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ) : null}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-muted">
          <span>{categoryLabel}</span>
          <Badge variant={priority.variant}>{priority.label}</Badge>
          <Badge variant={isShared ? "success" : "outline"}>{isShared ? "Shared" : "Private"}</Badge>
          {item.assigned_to_name ? <span className="inline-flex min-w-0 items-center gap-1.5"><UserRound className="size-3.5 shrink-0" /><span className="break-words">{item.assigned_to_name}</span></span> : null}
        </div>
        {item.notes ? <p className="mt-1.5 line-clamp-2 break-words text-xs leading-relaxed text-muted">{item.notes}</p> : null}
      </div>
    </div>
  );
}
