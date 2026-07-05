import { Compass, MapPinned } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { MapItem } from "@/features/map/types/map";

type MapCanvasPlaceholderProps = {
  items: MapItem[];
};

type PinPosition = {
  item: MapItem;
  x: number;
  y: number;
};

function calculatePositions(items: MapItem[]): PinPosition[] {
  if (items.length === 0) return [];

  const latitudes = items.map((item) => item.latitude);
  const longitudes = items.map((item) => item.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);
  const latitudeRange = Math.max(maxLatitude - minLatitude, 0.001);
  const longitudeRange = Math.max(maxLongitude - minLongitude, 0.001);

  return items.map((item) => ({
    item,
    x: 12 + ((item.longitude - minLongitude) / longitudeRange) * 76,
    y: 14 + ((maxLatitude - item.latitude) / latitudeRange) * 68,
  }));
}

export function MapCanvasPlaceholder({ items }: MapCanvasPlaceholderProps) {
  const positions = calculatePositions(items);
  const routePoints = positions.map((position) => `${position.x},${position.y}`).join(" ");

  return (
    <Card
      padding="none"
      className="relative min-h-[34rem] overflow-hidden bg-gradient-to-br from-primary-subtle via-surface-elevated to-success-subtle hover:shadow-sm"
    >
      <div
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="absolute -left-24 -top-16 h-64 w-96 rotate-[-12deg] rounded-[48%] bg-white/55 shadow-sm" />
      <div className="absolute -bottom-28 left-1/4 h-72 w-96 rotate-6 rounded-[44%] bg-success-subtle/80" />
      <div className="absolute -right-28 top-20 h-96 w-72 rotate-12 rounded-[46%] border border-white/70 bg-accent/5" />
      <div className="absolute right-10 top-32 size-36 rounded-full border-[18px] border-white/30" />
      <div className="absolute bottom-16 left-12 size-52 rounded-full border-[24px] border-primary/5" />

      <div className="absolute left-[-8%] top-[38%] h-3 w-[76%] rotate-[-8deg] rounded-full bg-white/70 shadow-xs">
        <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-primary/15" />
      </div>
      <div className="absolute right-[-12%] top-[58%] h-2.5 w-[72%] rotate-[13deg] rounded-full bg-white/65 shadow-xs">
        <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-primary/15" />
      </div>
      <div className="absolute bottom-[18%] left-[14%] h-2 w-[48%] rotate-[-22deg] rounded-full bg-white/55" />

      <svg
        className="absolute inset-0 size-full text-muted-foreground/15"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M-8 24 C18 8, 34 42, 60 25 S92 12, 108 30" fill="none" stroke="currentColor" strokeWidth="0.7" strokeDasharray="1.5 2" />
        <path d="M-6 88 C20 70, 40 94, 62 74 S91 55, 106 65" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2.5" />
        <path d="M22 -8 C12 20, 42 35, 28 62 S36 92, 48 108" fill="none" stroke="currentColor" strokeWidth="0.6" />
      </svg>

      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-xl border border-white/70 bg-white/85 px-3 py-2 text-xs font-medium text-primary shadow-sm backdrop-blur-sm">
        <MapPinned className="size-4" />Trip map preview
      </div>
      <div className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-sm">
        <Compass className="size-5 text-primary" />
      </div>

      {positions.length > 1 ? (
        <svg className="absolute inset-0 size-full text-primary/70" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline
            points={routePoints}
            fill="none"
            stroke="white"
            strokeOpacity="0.9"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            points={routePoints}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : null}

      {positions.map((position, index) => (
        <div
          key={position.item.id}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
          title={position.item.name}
        >
          <span className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-semibold text-primary-foreground shadow-lg ring-4 ring-primary/10">
            {index + 1}
          </span>
          <span className="pointer-events-none absolute left-1/2 top-11 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md group-hover:block">
            {position.item.name}
          </span>
        </div>
      ))}

      <div className="absolute inset-x-4 bottom-4 flex justify-center">
        <Badge
          variant="outline"
          className="max-w-full whitespace-normal border-white/80 bg-white/90 px-3 py-2 text-center text-foreground shadow-sm backdrop-blur-sm"
        >
          Interactive map coming after MapLibre integration.
        </Badge>
      </div>
    </Card>
  );
}
