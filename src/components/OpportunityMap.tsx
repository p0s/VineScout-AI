import type { VineyardOpportunity } from "@/lib/types";

export function OpportunityMap({ vineyards }: { vineyards: VineyardOpportunity[] }) {
  return (
    <div className="map" role="img" aria-label="Map of seeded vineyard opportunities">
      {vineyards.map((vineyard) => {
        const left = ((vineyard.lng + 130) / 145) * 100;
        const top = ((58 - vineyard.lat) / 25) * 100;
        return (
          <a
            aria-label={`${vineyard.name}, ${vineyard.overallFitScore} fit score`}
            className="pin"
            data-score={vineyard.overallFitScore >= 80 ? "high" : "medium"}
            href={`/app/vineyards/${vineyard.id}`}
            key={vineyard.id}
            style={{ left: `${Math.max(5, Math.min(95, left))}%`, top: `${Math.max(8, Math.min(92, top))}%` }}
            title={`${vineyard.name} · ${vineyard.overallFitScore}`}
          />
        );
      })}
    </div>
  );
}
