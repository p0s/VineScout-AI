export function clampScore(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function formatUsd(value?: number): string {
  if (!value) return "Not disclosed";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDealType(value: string): string {
  return value
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export function slugId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export const standardCaveat =
  "Satellite and weather signals estimate vineyard health and harvest risk. They do not prove final wine taste, lab chemistry, ownership value, or investment suitability. Use VineScout as a diligence accelerator, not as legal, financial, or oenological advice.";
