import { Info, PackagePlus, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { PackingTraveler } from "@/features/packing/types/packing";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type AddPackingItemPanelProps = {
  travelers: PackingTraveler[];
  onClose: () => void;
};

export function AddPackingItemPanel({
  travelers,
  onClose,
}: AddPackingItemPanelProps) {
  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <PackagePlus className="size-5 text-primary" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Add packing item</h2>
            <p className="mt-1 text-sm text-muted">Preview how a new checklist item will be described.</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close add packing item panel">
          <X className="size-4" />
        </Button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Item name
          <input className={fieldClassName} type="text" placeholder="e.g. Universal power adapter" />
        </label>

        <label className="text-sm font-medium text-foreground">
          Category
          <select className={fieldClassName} defaultValue="travel">
            <option value="documents">Documents</option><option value="electronics">Electronics</option>
            <option value="clothes">Clothes</option><option value="toiletries">Toiletries</option>
            <option value="health">Health</option><option value="travel">Travel</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          Priority
          <select className={fieldClassName} defaultValue="recommended">
            <option value="essential">Essential</option>
            <option value="recommended">Recommended</option>
            <option value="optional">Optional</option>
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          Assigned traveler
          <select className={fieldClassName} defaultValue="">
            <option value="">Unassigned</option>
            {travelers.map((traveler) => (
              <option key={traveler.id} value={traveler.id}>{traveler.name}</option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          List type
          <select className={fieldClassName} defaultValue="shared">
            <option value="shared">Shared</option>
            <option value="private">Private</option>
          </select>
        </label>

        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Notes
          <textarea
            className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            placeholder="Optional packing reminder"
          />
        </label>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl bg-primary-subtle p-3 text-xs text-primary">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>Adding packing items will be available after database setup.</p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
        <Button variant="outline" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" disabled>Add item · Preview only</Button>
      </div>
    </Card>
  );
}
