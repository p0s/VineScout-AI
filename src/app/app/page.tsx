import Link from "next/link";
import { OpportunityMap } from "@/components/OpportunityMap";
import { ScoreBar } from "@/components/ScoreBar";
import { VineyardCard } from "@/components/VineyardCard";
import { WatchlistPanel } from "@/components/WatchlistPanel";
import { demoBuyerProfile } from "@/lib/seed-data";
import { listAlerts, listVineyards } from "@/lib/store";
import { buildBuyerStrategy } from "@/lib/generators";

export default function DashboardPage() {
  const vineyards = listVineyards().slice(0, 6);
  const alerts = listAlerts();
  return (
    <>
      <section className="page-head">
        <div>
          <p className="eyebrow">DragonCellar Premium demo</p>
          <h2>Opportunity command room</h2>
          <p>{buildBuyerStrategy(demoBuyerProfile)}</p>
        </div>
        <Link className="button" href="/app/search">
          Find opportunities
        </Link>
      </section>
      <section className="grid three">
        <ScoreBar value={vineyards[0]?.overallFitScore ?? 0} label="Top fit score" />
        <ScoreBar value={vineyards.length} label="Shortlisted vineyards" />
        <ScoreBar value={alerts.length} label="Active watch alerts" />
      </section>
      <section className="grid two">
        <div className="workspace">
          <h3>Ranked map</h3>
          <OpportunityMap vineyards={vineyards} />
        </div>
        <WatchlistPanel alerts={alerts} />
      </section>
      <section className="opportunity-list">
        {vineyards.slice(0, 3).map((vineyard) => (
          <VineyardCard vineyard={vineyard} key={vineyard.id} />
        ))}
      </section>
    </>
  );
}
