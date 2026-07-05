import { Info, UserPlus, X } from "lucide-react";

import { Button, Card } from "@/components/ui";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type InviteParticipantPanelProps = {
  onClose: () => void;
};

export function InviteParticipantPanel({
  onClose,
}: InviteParticipantPanelProps) {
  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <UserPlus className="size-5 text-primary" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Invite participant</h2>
            <p className="mt-1 text-sm text-muted">Preview the future invitation experience.</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close invitation panel">
          <X className="size-4" />
        </Button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Email
          <input className={fieldClassName} type="email" placeholder="traveler@example.com" />
        </label>

        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Role
          <select className={fieldClassName} defaultValue="viewer">
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>

        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Message
          <textarea
            className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            placeholder="Optional invitation message"
          />
        </label>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl bg-primary-subtle p-3 text-xs text-primary">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>Inviting participants will be available after authentication and database setup.</p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
        <Button variant="outline" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" disabled>Send invite · Preview only</Button>
      </div>
    </Card>
  );
}
