import { UserRound } from "lucide-react";

import { Badge } from "@/components/ui";
import type {
  PackingCategory,
  PackingItem,
  PackingPriority,
} from "@/features/packing/types/packing";
import { cn } from "@/lib/utils";

const categoryLabels: Record<PackingCategory, string> = {
  documents: "Documents", electronics: "Electronics", clothes: "Clothes",
  toiletries: "Toiletries", health: "Health", travel: "Travel", other: "Other",
};

const priorityDetails: Record<
  PackingPriority,
  { label: string; variant: "error" | "default" | "outline" }
> = {
  essential: { label: "Essential", variant: "error" },
  recommended: { label: "Recommended", variant: "default" },
  optional: { label: "Optional", variant: "outline" },
};

type PackingItemRowProps = {
  item: PackingItem;
  assignedTraveler?: string;
  onToggle: (itemId: string) => void;
};

export function PackingItemRow({
  item,
  assignedTraveler,
  onToggle,
}: PackingItemRowProps) {
  const priority = priorityDetails[item.priority];

  return (
    <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
      <input
        type="checkbox"
        checked={item.isPacked}
        onChange={() => onToggle(item.id)}
        aria-label={`Mark ${item.name} as ${item.isPacked ? "not packed" : "packed"}`}
        className="mt-0.5 size-5 shrink-0 cursor-pointer accent-primary"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className={cn("font-medium text-foreground", item.isPacked && "text-muted line-through")}>
              {item.name}
            </p>
            {item.notes ? <p className="mt-1 text-xs leading-relaxed text-muted">{item.notes}</p> : null}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={priority.variant}>{priority.label}</Badge>
            <Badge variant={item.isShared ? "success" : "outline"}>
              {item.isShared ? "Shared" : "Private"}
            </Badge>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
          <span>{categoryLabels[item.category]}</span>
          {assignedTraveler ? (
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="size-3.5" />{assignedTraveler}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
