import type { VineyardOpportunity } from "@/lib/types";
import { ScoreBar } from "./ScoreBar";
import { SignalTimeline } from "./SignalTimeline";

export function HarvestRiskPanel({ vineyard }: { vineyard: VineyardOpportunity }) {
  const latest = vineyard.signals.at(-1);
  return (
    <section className="workspace" id="signals">
      <div className="page-head">
        <div>
          <p className="eyebrow">Harvest-risk prediction</p>
          <h2>Signals, not final wine quality</h2>
        </div>
      </div>
      <SignalTimeline signals={vineyard.signals} />
      {latest ? (
        <div className="grid three">
          <ScoreBar value={latest.droughtStress} label="Drought stress" />
          <ScoreBar value={latest.heatRisk} label="Heat risk" />
          <ScoreBar value={latest.canopyUniformity} label="Canopy uniformity" />
        </div>
      ) : null}
      <p className="caveat">
        Satellite and weather signals estimate vineyard health and harvest risk. They do not prove final wine taste,
        lab chemistry, ownership value, or investment suitability.
      </p>
    </section>
  );
}
