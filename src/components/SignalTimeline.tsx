import type { HarvestSignal } from "@/lib/types";

export function SignalTimeline({ signals }: { signals: HarvestSignal[] }) {
  const width = 560;
  const height = 180;
  const points = signals
    .map((signal, index) => {
      const x = signals.length === 1 ? 0 : (index / (signals.length - 1)) * width;
      const y = height - (signal.canopyUniformity / 100) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} aria-label="Canopy uniformity timeline">
      {[0, 45, 90, 135, 180].map((y) => (
        <line className="gridline" key={y} x1="0" x2={width} y1={y} y2={y} />
      ))}
      <polyline points={points} />
    </svg>
  );
}
