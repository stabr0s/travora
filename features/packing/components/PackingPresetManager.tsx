"use client";

import { useState, useTransition } from "react";
import { PackageCheck, Pencil, Plus, Trash2 } from "lucide-react";

import { Button, Card } from "@/components/ui";
import {
  applyCustomPackingPresetAction,
  deletePackingPresetAction,
} from "@/features/packing/actions/packing-preset-actions";
import { addPackingPresetAction } from "@/features/packing/actions/packing-actions";
import { PackingPresetForm } from "@/features/packing/components/PackingPresetForm";
import { packingPresets } from "@/features/packing/data/packing-presets";
import { useScrollIntoViewOnOpen } from "@/hooks/useScrollIntoViewOnOpen";
import type {
  PackingPresetActionState,
  PackingPresetWithItems,
} from "@/features/packing/types/packing-preset";

type PackingPresetManagerProps = {
  tripId: string;
  presets: PackingPresetWithItems[];
};

export function PackingPresetManager({
  tripId,
  presets,
}: PackingPresetManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<PackingPresetWithItems | null>(null);
  const [message, setMessage] = useState<PackingPresetActionState | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useScrollIntoViewOnOpen<HTMLDivElement>(isFormOpen);

  function openCreateForm() {
    setEditingPreset(null);
    setIsFormOpen(true);
  }

  function openEditForm(preset: PackingPresetWithItems) {
    setEditingPreset(preset);
    setIsFormOpen(true);
  }

  function applyBuiltInPreset(presetId: string) {
    startTransition(async () => {
      setMessage(await addPackingPresetAction(tripId, presetId));
    });
  }

  function applyCustomPreset(presetId: string) {
    startTransition(async () => {
      setMessage(await applyCustomPackingPresetAction(tripId, presetId));
    });
  }

  function deletePreset(preset: PackingPresetWithItems) {
    if (!window.confirm(`Delete “${preset.name}”? Your trip packing items will stay unchanged.`)) return;
    startTransition(async () => {
      setMessage(await deletePackingPresetAction(tripId, preset.id));
      if (editingPreset?.id === preset.id) setIsFormOpen(false);
    });
  }

  return (
    <div className="space-y-4">
      <Card padding="sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">Packing presets</h2>
            <p className="mt-1 text-sm text-muted">
              Apply a built-in starter or create private presets for repeatable trips.
            </p>
          </div>
          <Button type="button" size="sm" className="w-full sm:w-auto" onClick={openCreateForm}>
            <Plus className="size-4" />
            New preset
          </Button>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-border-subtle bg-background p-4">
            <h3 className="text-sm font-semibold text-foreground">Built-in presets</h3>
            <p className="mt-1 text-xs text-muted">Code-only starters. They are not editable.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {packingPresets.map((preset) => (
                <Button
                  key={preset.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  disabled={isPending}
                  onClick={() => applyBuiltInPreset(preset.id)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-background p-4">
            <h3 className="text-sm font-semibold text-foreground">My presets</h3>
            <p className="mt-1 text-xs text-muted">Saved to your account and visible only to you.</p>
            <div className="mt-3 space-y-3">
              {presets.length ? presets.map((preset) => (
                <div key={preset.id} className="rounded-xl border border-border-subtle bg-surface-elevated p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-foreground">{preset.name}</p>
                      <p className="mt-1 text-xs text-muted">
                        {preset.items.length} items{preset.description ? ` · ${preset.description}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={() => applyCustomPreset(preset.id)}>
                        <PackageCheck className="size-4" />
                        Apply
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => openEditForm(preset)}>
                        <Pencil className="size-4" />
                        Edit
                      </Button>
                      <Button type="button" variant="ghost" size="sm" disabled={isPending} onClick={() => deletePreset(preset)}>
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="rounded-xl border border-dashed border-border bg-surface px-3.5 py-3 text-sm text-muted">
                  No custom presets yet. Create one from your usual essentials.
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {message?.message ? (
        <Card padding="sm" className={message.status === "error" ? "text-sm text-error" : "text-sm text-success"}>
          {message.message}
        </Card>
      ) : null}

      {isFormOpen ? (
        <div ref={formRef}>
          <PackingPresetForm
            key={editingPreset?.id || "new-preset"}
            tripId={tripId}
            preset={editingPreset}
            onClose={() => setIsFormOpen(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
