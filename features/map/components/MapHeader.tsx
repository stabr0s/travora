import { Badge, SectionHeader } from "@/components/ui";

export function MapHeader() {
  return (
    <SectionHeader
      title="Map"
      description="See how the places in this trip connect before the interactive map arrives."
      className="mb-0"
      action={<Badge variant="default">Map preview</Badge>}
    />
  );
}
