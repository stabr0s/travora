import type { PackingCategory } from "@/features/packing/types/packing";

export const packingCategories: PackingCategory[] = [
  "documents",
  "electronics",
  "clothes",
  "toiletries",
  "health",
  "travel",
  "other",
];

export const packingCategoryLabels: Record<PackingCategory, string> = {
  documents: "Documents",
  electronics: "Electronics",
  clothes: "Clothes",
  toiletries: "Toiletries",
  health: "Medicine & health",
  travel: "Travel essentials",
  other: "Other",
};

export type PackingStatusFilter = "all" | "missing" | "packed";

export function getPackingCategory(value: string | null): PackingCategory {
  return packingCategories.includes(value as PackingCategory)
    ? value as PackingCategory
    : "other";
}
