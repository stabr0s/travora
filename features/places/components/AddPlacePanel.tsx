import { MapPin, X } from "lucide-react";

import { Button, Card } from "@/components/ui";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

type AddPlacePanelProps = {
  onClose: () => void;
};

export function AddPlacePanel({ onClose }: AddPlacePanelProps) {
  return (
    <Card padding="md" className="border-primary/15 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <MapPin className="size-5 text-primary" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Add a place</h2>
            <p className="mt-1 text-sm text-muted">Capture the idea now. Saving will be connected later.</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close add place panel">
          <X className="size-4" />
        </Button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Place name
          <input className={fieldClassName} type="text" placeholder="e.g. Senso-ji Temple" />
        </label>

        <label className="text-sm font-medium text-foreground">
          City
          <input className={fieldClassName} type="text" placeholder="Tokyo" />
        </label>

        <label className="text-sm font-medium text-foreground">
          Category
          <select className={fieldClassName} defaultValue="attraction">
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
          <select className={fieldClassName} defaultValue="recommended">
            <option value="must-see">Must see</option>
            <option value="recommended">Recommended</option>
            <option value="optional">Optional</option>
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          Estimated duration
          <select className={fieldClassName} defaultValue="120">
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
            <option value="180">3 hours</option>
          </select>
        </label>

        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Notes
          <textarea
            className="mt-2 min-h-28 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            placeholder="What makes this place worth adding?"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
        <Button variant="outline" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md">Add place</Button>
      </div>
    </Card>
  );
}
