import { MapPin, X } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { CreatePlaceActionState } from "@/features/places/types/persisted-place";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type AddPlacePanelProps = {
  tripId: string;
  mode: "mock" | "persisted";
  actionState: CreatePlaceActionState;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  onClose: () => void;
};

export function AddPlacePanel({
  tripId,
  mode,
  actionState,
  formAction,
  isPending,
  onClose,
}: AddPlacePanelProps) {
  const isPersisted = mode === "persisted";

  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <form action={isPersisted ? formAction : undefined}>
        <input type="hidden" name="tripId" value={tripId} />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
              <MapPin className="size-5 text-primary" />
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Add a place</h2>
              <p className="mt-1 text-sm text-muted">
                {isPersisted
                  ? "Save a place to this trip. Map features will be connected later."
                  : "This is a preview. Mock trips do not save places."}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close add place panel">
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Place name
            <input className={fieldClassName} name="title" type="text" placeholder="e.g. Senso-ji Temple" required={isPersisted} />
          </label>
          <label className="text-sm font-medium text-foreground">
            City
            <input className={fieldClassName} name="city" type="text" placeholder="Tokyo" />
          </label>
          <label className="text-sm font-medium text-foreground">
            Country
            <input className={fieldClassName} name="country" type="text" placeholder="Japan" />
          </label>
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Address
            <input className={fieldClassName} name="address" type="text" placeholder="Optional street address" />
          </label>
          <label className="text-sm font-medium text-foreground">
            Category
            <select className={fieldClassName} defaultValue="attraction" name="category">
              <option value="attraction">Attraction</option>
              <option value="restaurant">Restaurant</option>
              <option value="viewpoint">Viewpoint</option>
              <option value="hotel">Hotel</option>
              <option value="airport">Airport</option>
              <option value="transport">Transport</option>
              <option value="shop">Shop</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Priority
            <select className={fieldClassName} defaultValue="recommended" name="priority">
              <option value="must-see">Must see</option>
              <option value="recommended">Recommended</option>
              <option value="optional">Optional</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Status
            <select className={fieldClassName} defaultValue="idea" name="status">
              <option value="idea">Idea</option>
              <option value="planned">Planned</option>
              <option value="visited">Visited</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Website
            <input className={fieldClassName} name="websiteUrl" type="url" placeholder="https://" />
          </label>
          <label className="text-sm font-medium text-foreground sm:col-span-2">
            Notes
            <textarea
              className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              name="notes"
              placeholder="What makes this place worth adding?"
            />
          </label>
        </div>

        {isPersisted && actionState.message ? (
          <p
            role={actionState.status === "error" ? "alert" : "status"}
            className={actionState.status === "error"
              ? "mt-5 rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error"
              : "mt-5 rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"}
          >
            {actionState.message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
          <Button variant="outline" size="md" onClick={onClose}>Cancel</Button>
          <Button type={isPersisted ? "submit" : "button"} size="md" disabled={!isPersisted || isPending}>
            {isPersisted ? (isPending ? "Saving place…" : "Save place") : "Preview only"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
