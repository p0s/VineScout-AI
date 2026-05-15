import type { VineyardOpportunity } from "@/lib/types";

export function ScoreRadar({ vineyard }: { vineyard: VineyardOpportunity }) {
  const metrics = [
    ["China fit", vineyard.chinaPremiumFitScore],
    ["Export", vineyard.exportReadinessScore],
    ["Owner", vineyard.ownerOpennessScore],
    ["Risk control", 100 - vineyard.harvestRiskScore],
    ["Confidence", vineyard.confidence]
  ] as const;
  const center = 92;
  const radius = 72;
  const points = metrics
    .map(([, value], index) => {
      const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
      const scaled = radius * (value / 100);
      return `${center + Math.cos(angle) * scaled},${center + Math.sin(angle) * scaled}`;
    })
    .join(" ");

  return (
    <svg className="radar" viewBox="0 0 184 184" aria-label="Score radar">
      {[0.33, 0.66, 1].map((scale) => (
        <polygon
          className="radar-grid"
          key={scale}
          points={metrics
            .map((_, index) => {
              const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
              return `${center + Math.cos(angle) * radius * scale},${center + Math.sin(angle) * radius * scale}`;
            })
            .join(" ")}
        />
      ))}
      {metrics.map(([label], index) => {
        const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
        return (
          <text key={label} x={center + Math.cos(angle) * 84} y={center + Math.sin(angle) * 84} textAnchor="middle">
            {label}
          </text>
        );
      })}
      <polygon className="radar-fill" points={points} />
    </svg>
  );
}
