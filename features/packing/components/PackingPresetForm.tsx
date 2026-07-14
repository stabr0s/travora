"use client";

import { useActionState, useMemo, useState } from "react";
import { PackagePlus, Plus, Trash2, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import {
  createPackingPresetAction,
  updatePackingPresetAction,
} from "@/features/packing/actions/packing-preset-actions";
import type {
  PackingPresetActionState,
  PackingPresetWithItems,
} from "@/features/packing/types/packing-preset";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";
const textareaClassName =
  "mt-2 min-h-20 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";
const initialState: PackingPresetActionState = { status: "idle" };

type PresetItemRow = {
  id: string;
  name: string;
  category: string;
  priority: string;
  notes: string;
};

type PackingPresetFormProps = {
  tripId: string;
  preset?: PackingPresetWithItems | null;
  onClose: () => void;
};

function emptyRow(): PresetItemRow {
  return {
    id: crypto.randomUUID(),
    name: "",
    category: "travel",
    priority: "recommended",
    notes: "",
  };
}

export function PackingPresetForm({
  tripId,
  preset,
  onClose,
}: PackingPresetFormProps) {
  const isEditing = Boolean(preset);
  const initialRows = useMemo<PresetItemRow[]>(() => {
    if (!preset?.items.length) return [emptyRow()];
    return preset.items.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category || "travel",
      priority: item.priority || "recommended",
      notes: item.notes || "",
    }));
  }, [preset]);
  const [rows, setRows] = useState(initialRows);
  const [actionState, formAction, isPending] = useActionState(
    isEditing ? updatePackingPresetAction : createPackingPresetAction,
    initialState,
  );

  function updateRow(id: string, key: keyof Omit<PresetItemRow, "id">, value: string) {
    setRows((current) => current.map((row) => (
      row.id === id ? { ...row, [key]: value } : row
    )));
  }

  function removeRow(id: string) {
    setRows((current) => current.length === 1
      ? current
      : current.filter((row) => row.id !== id));
  }

  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="tripId" value={tripId} />
        {preset ? <input type="hidden" name="presetId" value={preset.id} /> : null}

        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
              <PackagePlus className="size-5 text-primary" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {isEditing ? "Edit packing preset" : "Create packing preset"}
              </h2>
              <p className="mt-1 text-sm text-muted">
                Save your own reusable checklist. Presets are private to your account.
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close preset form">
            <X className="size-4" />
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground">
            Preset name
            <input
              className={fieldClassName}
              defaultValue={preset?.name || ""}
              name="name"
              placeholder="e.g. Summer city break"
              required
            />
          </label>
          <label className="text-sm font-medium text-foreground">
            Description
            <input
              className={fieldClassName}
              defaultValue={preset?.description || ""}
              name="description"
              placeholder="Optional note"
            />
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Preset items</h3>
              <p className="mt-1 text-sm text-muted">Quantity is intentionally not part of presets yet.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setRows((current) => [...current, emptyRow()])}>
              <Plus className="size-4" />
              Add row
            </Button>
          </div>

          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="rounded-2xl border border-border-subtle bg-background p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-foreground sm:col-span-2">
                    Item name
                    <input className={fieldClassName} name="itemName" value={row.name} onChange={(event) => updateRow(row.id, "name", event.target.value)} placeholder="e.g. Passport" />
                  </label>
                  <label className="text-sm font-medium text-foreground">
                    Category
                    <select className={fieldClassName} name="itemCategory" value={row.category} onChange={(event) => updateRow(row.id, "category", event.target.value)}>
                      <option value="documents">Documents</option><option value="electronics">Electronics</option>
                      <option value="clothes">Clothes</option><option value="toiletries">Toiletries</option>
                      <option value="health">Health</option><option value="travel">Travel</option><option value="other">Other</option>
                    </select>
                  </label>
                  <label className="text-sm font-medium text-foreground">
                    Priority
                    <select className={fieldClassName} name="itemPriority" value={row.priority} onChange={(event) => updateRow(row.id, "priority", event.target.value)}>
                      <option value="essential">Essential</option>
                      <option value="recommended">Recommended</option>
                      <option value="optional">Optional</option>
                    </select>
                  </label>
                  <label className="text-sm font-medium text-foreground sm:col-span-2">
                    Notes
                    <textarea className={textareaClassName} name="itemNotes" value={row.notes} onChange={(event) => updateRow(row.id, "notes", event.target.value)} placeholder="Optional reminder" />
                  </label>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeRow(row.id)} disabled={rows.length === 1}>
                    <Trash2 className="size-4" />
                    Remove row
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {actionState.message ? (
          <p role={actionState.status === "error" ? "alert" : "status"} className={actionState.status === "error" ? "rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error" : "rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"}>
            {actionState.message}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" size="md" className="w-full sm:w-auto" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="md" className="w-full sm:w-auto" disabled={isPending}>
            {isPending ? "Saving preset…" : isEditing ? "Update preset" : "Save preset"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
