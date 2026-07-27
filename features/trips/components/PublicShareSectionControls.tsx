"use client";

import { Badge, Button } from "@/components/ui";
import type { PublicShareSections } from "@/features/public-share/types/public-share";

const contentSections: Array<{ key: keyof Omit<PublicShareSections, "overview">; label: string }> = [
  { key: "places", label: "Places" },
  { key: "planner", label: "Planner" },
  { key: "reservations", label: "Reservations" },
  { key: "budget", label: "Budget" },
  { key: "packing", label: "Packing" },
];

type PublicShareSectionControlsProps = {
  sections: PublicShareSections;
  canManageSettings: boolean;
  isPending: boolean;
  hasSectionChanges: boolean;
  onChange: (sections: PublicShareSections) => void;
  onSave: () => void;
};

export function PublicShareSectionControls({
  sections,
  canManageSettings,
  isPending,
  hasSectionChanges,
  onChange,
  onSave,
}: PublicShareSectionControlsProps) {
  return (
    <div className="space-y-3 border-t border-border-subtle pt-4">
      <div>
        <h4 className="text-sm font-semibold text-foreground">Visible sections</h4>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Overview is always public when the link is enabled. Choose whether guests can
          also see Places, Planner, Reservations, Budget, and Packing.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Overview</p>
            <p className="text-xs text-muted">Always shown</p>
          </div>
          <Badge variant="outline">Locked</Badge>
        </div>

        {contentSections.map((section) => (
          <label
            key={section.key}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground"
          >
            <span>{section.label}</span>
            <input
              type="checkbox"
              className="size-4 accent-primary"
              checked={sections[section.key]}
              disabled={!canManageSettings || isPending}
              onChange={(event) => {
                onChange({
                  ...sections,
                  overview: true,
                  [section.key]: event.currentTarget.checked,
                });
              }}
            />
          </label>
        ))}
      </div>
      <div className="rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed text-muted">
        <p>Important Info and Travel Links stay private.</p>
        <p className="mt-1">Participants, emails, and internal IDs are never included.</p>
      </div>
      {canManageSettings ? (
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onSave}
          disabled={isPending || !hasSectionChanges}
        >
          Save visible sections
        </Button>
      ) : null}
    </div>
  );
}
