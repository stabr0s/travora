"use client";

import { useActionState } from "react";
import { PackagePlus, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import {
  createPackingItemAction,
  updatePackingItemAction,
} from "@/features/packing/actions/packing-actions";
import type {
  PackingActionState,
  PersistedPackingItem,
} from "@/features/packing/types/persisted-packing";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";
const initialState: PackingActionState = { status: "idle" };

type PersistedAddPackingItemPanelProps = {
  tripId: string;
  item?: PersistedPackingItem | null;
  onClose: () => void;
};

export function PersistedAddPackingItemPanel({
  tripId,
  item,
  onClose,
}: PersistedAddPackingItemPanelProps) {
  const isEditing = Boolean(item);
  const [actionState, formAction, isPending] = useActionState(
    isEditing ? updatePackingItemAction : createPackingItemAction,
    initialState,
  );

  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <form action={formAction}>
        <input type="hidden" name="tripId" value={tripId} />
        <input type="hidden" name="isPacked" value={String(item?.is_packed ?? false)} />
        {item ? <input type="hidden" name="recordId" value={item.id} /> : null}

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
              <PackagePlus className="size-5 text-primary" />
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {isEditing ? "Edit packing item" : "Add packing item"}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {isEditing ? "Update this saved checklist item." : "Add an item to this trip checklist."}
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close packing item panel">
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Item name
            <input className={fieldClassName} defaultValue={item?.name} name="name" type="text" placeholder="e.g. Universal power adapter" required />
          </label>
          <label className="text-sm font-medium text-foreground">
            Category
            <select className={fieldClassName} defaultValue={item?.category || "travel"} name="category">
              <option value="documents">Documents</option><option value="electronics">Electronics</option>
              <option value="clothes">Clothes</option><option value="toiletries">Toiletries</option>
              <option value="health">Health</option><option value="travel">Travel</option><option value="other">Other</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Priority
            <select className={fieldClassName} defaultValue={item?.priority || "recommended"} name="priority">
              <option value="essential">Essential</option>
              <option value="recommended">Recommended</option>
              <option value="optional">Optional</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Assigned traveler
            <input className={fieldClassName} defaultValue={item?.assigned_to_name || ""} name="assignedToName" type="text" placeholder="Optional name" />
          </label>
          <label className="text-sm font-medium text-foreground">
            List type
            <select className={fieldClassName} defaultValue={String(item?.is_shared ?? true)} name="isShared">
              <option value="true">Shared</option>
              <option value="false">Private label</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Notes
            <textarea
              className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              defaultValue={item?.notes || ""}
              name="notes"
              placeholder="Optional packing reminder"
            />
          </label>
        </div>

        {actionState.message ? (
          <p role={actionState.status === "error" ? "alert" : "status"} className={actionState.status === "error" ? "mt-5 rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error" : "mt-5 rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"}>
            {actionState.message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" size="md" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="md" disabled={isPending}>
            {isPending ? "Saving item…" : isEditing ? "Update item" : "Save item"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
