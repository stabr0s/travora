import { Link2, LockKeyhole } from "lucide-react";

import { Badge, Card } from "@/components/ui";

type SharingPreviewCardProps = {
  tripId: string;
};

export function SharingPreviewCard({ tripId }: SharingPreviewCardProps) {
  return (
    <Card padding="md" className="h-full overflow-hidden hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <Link2 className="size-5 text-primary" />
          </span>
          <div>
            <h2 className="font-semibold tracking-tight text-foreground">Sharing preview</h2>
            <p className="mt-1 text-sm text-muted">A visual preview of future trip sharing.</p>
          </div>
        </div>
        <Badge variant="outline">Inactive</Badge>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Mock share address</p>
        <code className="mt-2 block break-all text-sm font-medium text-foreground">
          travora.app/share/{tripId}
        </code>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl bg-primary-subtle p-3 text-xs leading-relaxed text-primary">
        <LockKeyhole className="mt-0.5 size-4 shrink-0" />
        This preview is not a real link and has no access token or permissions.
      </div>
    </Card>
  );
}
