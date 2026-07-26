"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FilePlus2 } from "lucide-react";

import { Button } from "@/components/ui";
import {
  importantInfoTemplates,
  type ImportantInfoTemplate,
} from "@/features/trip-detail/utils/important-info-templates";

type ImportantInfoTemplatePickerProps = {
  onInsert: (template: ImportantInfoTemplate) => void;
};

export function ImportantInfoTemplatePicker({
  onInsert,
}: ImportantInfoTemplatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleInsert(template: ImportantInfoTemplate) {
    onInsert(template);
    setIsOpen(false);
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface/60">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="w-full justify-between px-3"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span className="inline-flex items-center gap-2">
          <FilePlus2 className="size-4 text-primary" />
          Insert template
        </span>
        {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </Button>

      {isOpen ? (
        <div className="border-t border-border-subtle p-3">
          <p className="mb-3 text-xs leading-relaxed text-muted">
            Choose editable starter content. Existing notes will stay in place.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {importantInfoTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                className="min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                onClick={() => handleInsert(template)}
              >
                <span className="block break-words text-sm font-medium text-foreground">
                  {template.label}
                </span>
                <span className="mt-0.5 block break-words text-xs leading-relaxed text-muted">
                  {template.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
