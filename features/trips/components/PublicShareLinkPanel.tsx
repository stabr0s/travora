"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Copy, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui";

type PublicShareLinkPanelProps = {
  sharePath: string;
  isPending: boolean;
};

function subscribeToLocation() {
  return () => undefined;
}

export function PublicShareLinkPanel({
  sharePath,
  isPending,
}: PublicShareLinkPanelProps) {
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const origin = useSyncExternalStore(
    subscribeToLocation,
    () => window.location.origin,
    () => "",
  );
  const shareUrl = origin ? `${origin}${sharePath}` : sharePath;

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  function showCopyMessage(message: string) {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setCopyMessage(message);
    feedbackTimer.current = setTimeout(() => setCopyMessage(null), 2500);
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl)
      .then(() => showCopyMessage("Public link copied."))
      .catch(() => showCopyMessage("Copy the public link manually."));
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-surface/60 p-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Public URL
        </p>
        <code className="mt-2 block min-w-0 break-all rounded-xl border border-border bg-background px-3 py-2 text-xs leading-relaxed text-foreground sm:text-sm">
          {shareUrl}
        </code>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          size="sm"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={copyLink}
          disabled={isPending}
        >
          <Copy className="size-4" />
          Copy link
        </Button>
        <a
          href={sharePath}
          className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-surface sm:w-auto"
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink className="size-4" />
          Preview public share
        </a>
      </div>
      <p className="min-h-4 text-xs text-muted" role="status" aria-live="polite">
        {copyMessage || "Preview opens the existing public page in a new tab."}
      </p>
    </div>
  );
}
