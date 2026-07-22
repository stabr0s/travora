"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, ExternalLink, LinkIcon, RotateCw } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import {
  disablePublicShareAction,
  enablePublicShareAction,
  regeneratePublicShareAction,
  updatePublicShareSectionsAction,
} from "@/features/trips/actions/public-share-actions";
import { PublicShareSectionControls } from "@/features/trips/components/PublicShareSectionControls";
import type { PublicShareSections } from "@/features/public-share/types/public-share";
import type { PersistedTrip } from "@/features/trips/types/persisted-trip";

type PublicShareSettingsCardProps = {
  trip: PersistedTrip;
  canManageSettings: boolean;
};

function normalizeSections(input: unknown): PublicShareSections {
  if (!input || typeof input !== "object") {
    return {
      overview: true,
      places: true,
      planner: true,
      reservations: true,
      budget: true,
      packing: true,
    };
  }

  const candidate = input as Partial<Record<keyof PublicShareSections, unknown>>;
  return {
    overview: true,
    places: typeof candidate.places === "boolean" ? candidate.places : true,
    planner: typeof candidate.planner === "boolean" ? candidate.planner : true,
    reservations: typeof candidate.reservations === "boolean" ? candidate.reservations : true,
    budget: typeof candidate.budget === "boolean" ? candidate.budget : true,
    packing: typeof candidate.packing === "boolean" ? candidate.packing : true,
  };
}

export function PublicShareSettingsCard({
  trip,
  canManageSettings,
}: PublicShareSettingsCardProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const initialSections = normalizeSections(trip.public_share_sections);
  const [sections, setSections] = useState<PublicShareSections>(initialSections);

  const sharePath = trip.public_share_token ? `/share/${trip.public_share_token}` : "";
  const isEnabled = trip.public_share_enabled && Boolean(trip.public_share_token);
  const hasSectionChanges = JSON.stringify(sections) !== JSON.stringify(initialSections);

  function runAction(action: (tripId: string) => Promise<{ status: string; message?: string }>) {
    startTransition(async () => {
      const result = await action(trip.id);
      setMessage(result.message || null);
      if (result.status === "success") router.refresh();
    });
  }

  function saveSections() {
    startTransition(async () => {
      const result = await updatePublicShareSectionsAction(trip.id, sections);
      setMessage(result.message || null);
      if (result.status === "success") router.refresh();
    });
  }

  function copyLink() {
    if (!sharePath) return;
    const shareUrl = `${window.location.origin}${sharePath}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => setMessage("Public link copied."))
      .catch(() => setMessage("Copy the public link manually."));
  }

  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight text-foreground">Public share link</h3>
            <Badge variant={isEnabled ? "success" : "outline"}>{isEnabled ? "Enabled" : "Off"}</Badge>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Share a read-only trip page without app navigation. Editing, participant emails,
            reservation references and internal IDs stay hidden.
          </p>
        </div>
        <LinkIcon className="size-5 shrink-0 text-muted" />
      </div>

      {!canManageSettings ? (
        <div className="rounded-2xl bg-surface px-4 py-3 text-sm text-muted">
          Only the trip owner can manage public sharing.
        </div>
      ) : null}

      {isEnabled && sharePath ? (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Read-only URL</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <code className="min-w-0 flex-1 break-all rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground">
              {sharePath}
            </code>
            <Button variant="outline" className="w-full sm:w-auto" onClick={copyLink} disabled={!canManageSettings || isPending}>
              <Copy className="size-4" />
              Copy
            </Button>
          </div>
          <a
            href={sharePath}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover"
            target="_blank"
            rel="noreferrer"
          >
            Open public page <ExternalLink className="size-3.5" />
          </a>
        </div>
      ) : null}

      <PublicShareSectionControls
        sections={sections}
        canManageSettings={canManageSettings}
        isPending={isPending}
        hasSectionChanges={hasSectionChanges}
        onChange={setSections}
        onSave={saveSections}
      />

      {canManageSettings ? (
        <div className="flex flex-col gap-2 border-t border-border-subtle pt-4 sm:flex-row">
          <Button
            className="w-full sm:w-auto"
            onClick={() => runAction(enablePublicShareAction)}
            disabled={isPending || isEnabled}
          >
            Enable public link
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => runAction(regeneratePublicShareAction)}
            disabled={isPending}
          >
            <RotateCw className="size-4" />
            Regenerate link
          </Button>
          <Button
            variant="ghost"
            className="w-full text-error sm:w-auto"
            onClick={() => runAction(disablePublicShareAction)}
            disabled={isPending || !isEnabled}
          >
            Disable link
          </Button>
        </div>
      ) : null}

      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </Card>
  );
}
