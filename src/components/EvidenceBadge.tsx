import type { EvidenceSource } from "@/lib/types";

export function EvidenceBadge({ source }: { source: EvidenceSource }) {
  return <span className={`badge ${source}`}>{source}</span>;
}
