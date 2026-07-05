import { Plus } from "lucide-react";

type AddPlaceCardProps = {
  onClick: () => void;
};

export function AddPlaceCard({ onClick }: AddPlaceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[24rem] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-elevated px-6 text-center shadow-xs transition-all duration-150 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-subtle transition-transform group-hover:scale-105">
        <Plus className="size-6 text-primary" />
      </span>
      <span className="mt-5 text-lg font-semibold tracking-tight text-foreground">Add a place</span>
      <span className="mt-2 max-w-56 text-sm leading-relaxed text-muted">
        Save another stop, meal, viewpoint, or idea for this trip.
      </span>
    </button>
  );
}
