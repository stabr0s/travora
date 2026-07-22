import { Plus } from "lucide-react";

type AddPlaceCardProps = {
  onClick: () => void;
};

export function AddPlaceCard({ onClick }: AddPlaceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-elevated px-4 text-center transition-colors duration-150 hover:border-primary/30 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary-subtle transition-transform group-hover:scale-105">
        <Plus className="size-4 text-primary" />
      </span>
      <span className="mt-3 text-sm font-semibold tracking-tight text-foreground">Add a place</span>
      <span className="mt-1 max-w-48 text-xs leading-relaxed text-muted">
        Save another stop, meal, viewpoint, or idea for this trip.
      </span>
    </button>
  );
}
