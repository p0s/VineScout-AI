import Link from "next/link";
import type { VineyardOpportunity } from "@/lib/types";
import { formatDealType, formatUsd } from "@/lib/utils";
import { EvidenceBadge } from "./EvidenceBadge";

export function VineyardCard({ vineyard }: { vineyard: VineyardOpportunity }) {
  const price = vineyard.indicativePriceUsd
    ? formatUsd(vineyard.indicativePriceUsd)
    : vineyard.investmentRangeUsd
      ? `${formatUsd(vineyard.investmentRangeUsd[0])}-${formatUsd(vineyard.investmentRangeUsd[1])}`
      : "Not disclosed";

  return (
    <Link className="opportunity-card" href={`/app/vineyards/${vineyard.id}`}>
      <div className="card-top">
        <div>
          <h3>{vineyard.name}</h3>
          <p>
            {vineyard.region}, {vineyard.country} · {vineyard.hectares} ha · {price}
          </p>
        </div>
        <span className="score">{vineyard.overallFitScore}</span>
      </div>
      <div className="badge-row">
        {vineyard.dealTypes.map((dealType) => (
          <span className="badge" key={dealType}>
            {formatDealType(dealType)}
          </span>
        ))}
        <EvidenceBadge source={vineyard.evidence[0]?.source ?? "unavailable"} />
      </div>
      <p>{vineyard.topReasons[0]}</p>
      <div className="grid three">
        <small>Harvest risk {vineyard.harvestRiskScore}/100</small>
        <small>Export {vineyard.exportReadinessScore}/100</small>
        <small>Confidence {vineyard.confidence}/100</small>
      </div>
    </Link>
  );
}
