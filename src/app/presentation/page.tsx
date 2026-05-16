import Link from "next/link";

const marketStats = [
  ["EUR 1.5B", "China wine imports in 2024, up 37.6% year over year"],
  ["+43.8%", "bottled wine import value growth in China in 2024"],
  ["A$1.03B", "Australian wine exports to mainland China in the year to March 2025"]
];

const problemGaps = [
  "Overseas vineyard sourcing is travel-heavy and broker-led",
  "Harvest risk is hard to verify before a site visit",
  "Owner openness, export readiness, and China fit are fragmented",
  "Deal teams need evidence before spending weeks on outreach"
];

const workflowSteps = ["Intake", "Rank", "Verify", "Memo", "Outreach"];

const aiLayers = [
  ["Buyer fit", "brief to transparent scoring criteria"],
  ["OrbitAI evidence", "handoff for canopy, drought, smoke, and harvest timing"],
  ["Deal outputs", "memo, checklist, outreach, and alerts from one evidence trail"]
];

export default function PresentationPage() {
  return (
    <main className="pitch-deck" aria-label="VineScout AI pitch deck">
      <nav className="pitch-nav" aria-label="Presentation">
        <Link href="/" aria-label="VineScout AI home">
          VineScout AI
        </Link>
        <div>
          <Link href="/app">Demo</Link>
          <Link href="/app/search">Product</Link>
        </div>
      </nav>

      <section className="pitch-slide pitch-hero" aria-labelledby="pitch-problem">
        <div className="pitch-kicker">Market / ICP</div>
        <div className="pitch-frame">
          <div>
            <h1 id="pitch-problem">China&apos;s wine import rebound needs better vineyard deal flow.</h1>
            <p>
              Chinese premium wine importers, wine-commerce startups, and beverage groups are moving from buying
              bottles to controlling Western supply, private-label credibility, and acquisition options.
            </p>
            <p className="pitch-source-note">
              Sources: OIV 2024 sector report, USDA FAS China Wine Market Update 2025, Wine Australia Export Report.
            </p>
          </div>
          <div className="pitch-stat-grid" aria-label="Market evidence">
            {marketStats.map(([value, label]) => (
              <div key={value}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pitch-slide pitch-workflow" aria-labelledby="pitch-solution">
        <div className="pitch-kicker">Problem</div>
        <div className="pitch-frame">
          <div>
            <h2 id="pitch-solution">The buyer cannot fly to every vineyard that looks promising.</h2>
            <p>
              A Shanghai buyer needs to know which estates deserve a call before spending weeks on travel,
              translators, brokers, and diligence. Today, the signal is scattered across owner claims, weather
              history, parcel condition, export readiness, and local relationships.
            </p>
          </div>
          <ul className="pitch-signal-stack" aria-label="Cross-border deal gaps">
            {problemGaps.map((gap) => (
              <li key={gap}>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pitch-slide pitch-ai" aria-labelledby="pitch-ai">
        <div className="pitch-kicker">Solution</div>
        <div className="pitch-frame">
          <div>
            <h2 id="pitch-ai">We turn an expansion brief into a ranked deal room in one day.</h2>
            <p>
              VineScout AI matches buyer goals to 100 fictional Western vineyard opportunities, ranks sourcing,
              minority investment, and acquisition fit, then opens a diligence room with transparent formulas,
              harvest-risk signals, OrbitAI Eye-of-God handoff, memo generation, outreach, and alerts.
            </p>
          </div>
          <ol className="pitch-flow" aria-label="VineScout workflow">
            {workflowSteps.map((step, index) => (
              <li key={step}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pitch-slide pitch-market" aria-labelledby="pitch-market">
        <div className="pitch-kicker">AI Integration / Team</div>
        <div className="pitch-frame">
          <div>
            <h2 id="pitch-market">AI turns remote signals into deal action.</h2>
            <p>
              We explain every score, request satellite-observable harvest-risk evidence, and draft the memo and
              outreach. Harvest-risk prediction supports diligence, not final wine quality or investment suitability.
            </p>
          </div>
          <div className="pitch-ai-grid">
            {aiLayers.map(([title, copy]) => (
              <div key={title}>
                <strong>{title}</strong>
                <span>{copy}</span>
              </div>
            ))}
            <div className="pitch-team-card">
              <span>Team</span>
              <strong>chris + philipp</strong>
              <strong>chris: CTO</strong>
              <strong>philipp: Business Development Sales and Marketing</strong>
            </div>
            <Link className="button" href="/app">
              Open live demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
