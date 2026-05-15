import Link from "next/link";
import { notFound } from "next/navigation";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { HarvestRiskPanel } from "@/components/HarvestRiskPanel";
import { OutreachComposer } from "@/components/OutreachComposer";
import { ScoreBar } from "@/components/ScoreBar";
import { buildDealMemo, buildEyeOfGodPrompt } from "@/lib/generators";
import { demoBuyerProfile } from "@/lib/seed-data";
import { getVineyard, scoreVineyard } from "@/lib/store";
import { formatDealType, standardCaveat } from "@/lib/utils";

export default async function VineyardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vineyard = getVineyard(id);
  if (!vineyard) notFound();
  const score = scoreVineyard(vineyard.id);
  const memo = buildDealMemo(vineyard, demoBuyerProfile);

  return (
    <div className="split">
      <nav className="side-nav" aria-label="Diligence tabs">
        {["overview", "signals", "orbitai", "commercial", "compliance", "memo", "outreach", "alerts"].map((item) => (
          <a href={`#${item}`} key={item}>
            {item}
          </a>
        ))}
      </nav>
      <div className="grid">
        <section className="workspace" id="overview">
          <p className="eyebrow">
            {vineyard.region}, {vineyard.country}
          </p>
          <div className="page-head">
            <div>
              <h2>{vineyard.name}</h2>
              <p>
                {vineyard.hectares} hectares · {vineyard.varietals.join(", ")} ·{" "}
                {vineyard.dealTypes.map(formatDealType).join(", ")}
              </p>
            </div>
            <Link className="button" href="/app/orbitai">
              Validate with OrbitAI
            </Link>
          </div>
          <div className="grid three">
            <ScoreBar value={score?.overallFit ?? vineyard.overallFitScore} label="Overall fit" />
            <ScoreBar value={vineyard.chinaPremiumFitScore} label="China premium fit" />
            <ScoreBar value={score?.confidence ?? vineyard.confidence} label="Confidence" />
          </div>
          <div className="badge-row">
            {vineyard.evidence.map((item) => (
              <EvidenceBadge source={item.source} key={item.id} />
            ))}
          </div>
        </section>
        <HarvestRiskPanel vineyard={vineyard} />
        <section className="workspace" id="orbitai">
          <p className="eyebrow">OrbitAI validation</p>
          <h2>Eye-of-God handoff</h2>
          <pre>{buildEyeOfGodPrompt(vineyard)}</pre>
        </section>
        <section className="grid two" id="commercial">
          <div className="workspace">
            <h3>Commercial fit</h3>
            <p>{vineyard.topReasons.join(" ")}</p>
            <ScoreBar value={vineyard.ownerOpennessScore} label="Owner openness" />
          </div>
          <div className="workspace" id="compliance">
            <h3>Compliance/export</h3>
            <ScoreBar value={vineyard.exportReadinessScore} label="Export readiness" />
            <p>{vineyard.dueDiligenceNotes[0]}</p>
          </div>
        </section>
        <section className="workspace" id="memo">
          <p className="eyebrow">Deal memo</p>
          <h2>Generated recommendation</h2>
          <pre>{memo.markdown}</pre>
          <p>{memo.chineseSummary}</p>
        </section>
        <OutreachComposer vineyard={vineyard} />
        <section className="workspace" id="alerts">
          <h3>Risk caveat</h3>
          <p className="caveat">{standardCaveat}</p>
        </section>
      </div>
    </div>
  );
}
