import Link from "next/link";

const workflowSteps = ["Profile", "Rank", "Validate", "Memo", "Outreach"];

const aiLayers = [
  ["Structured intake", "turns buyer goals into scoring criteria"],
  ["Transparent ranking", "explains fit, confidence, risk, and next action"],
  ["OrbitAI handoff", "requests satellite-observable harvest-risk evidence"],
  ["Deal artifacts", "drafts memo, checklist, outreach, and alerts"]
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
        <div className="pitch-kicker">Problem / ICP</div>
        <div className="pitch-frame">
          <div>
            <h1 id="pitch-problem">Remote vineyard deals need evidence before outreach.</h1>
            <p>
              Chinese premium wine importers, wine-commerce startups, beverage groups, and strategic investors need
              supply control, private-label credibility, and acquisition options. The hard part is knowing which
              distant vineyards deserve time, capital, and outreach.
            </p>
          </div>
          <div className="pitch-signal-stack" aria-label="Diligence gaps">
            <span>Fragmented owner data</span>
            <span>Opaque harvest risk</span>
            <span>Slow broker outreach</span>
            <span>Weak evidence trail</span>
          </div>
        </div>
      </section>

      <section className="pitch-slide pitch-workflow" aria-labelledby="pitch-solution">
        <div className="pitch-kicker">Solution</div>
        <div className="pitch-frame">
          <div>
            <h2 id="pitch-solution">We turn an expansion brief into a ranked deal room in one day.</h2>
            <p>
              We start with strategy, budget, channels, regions, and deal type. VineScout AI returns ranked
              vineyards, harvest-risk signals, diligence evidence, memo drafts, and owner outreach.
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

      <section className="pitch-slide pitch-ai" aria-labelledby="pitch-ai">
        <div className="pitch-kicker">AI Integration</div>
        <div className="pitch-frame">
          <div>
            <h2 id="pitch-ai">AI is the diligence engine, not a chatbot beside the workflow.</h2>
            <p>
              We combine deterministic scoring with AI reasoning, provenance labels, and an OrbitAI Eye-of-God handoff
              for premium satellite validation. Harvest-risk prediction is evidence for diligence, not a claim about
              final wine quality or investment suitability.
            </p>
          </div>
          <div className="pitch-ai-grid">
            {aiLayers.map(([title, copy]) => (
              <div key={title}>
                <strong>{title}</strong>
                <span>{copy}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pitch-slide pitch-market" aria-labelledby="pitch-market">
        <div className="pitch-kicker">Market / Team</div>
        <div className="pitch-frame">
          <div>
            <h2 id="pitch-market">A narrow wedge into cross-border beverage expansion.</h2>
            <p>
              Beachhead users already spend on sourcing, consultants, brokers, travel, compliance, and portfolio
              diligence. VineScout AI compresses that work into a repeatable operating system for finding, verifying,
              and winning Western vineyard deals.
            </p>
          </div>
          <div className="pitch-team">
            <div>
              <span>Market entry</span>
              <strong>Chinese premium wine and beverage companies pursuing Western supply control.</strong>
            </div>
            <div>
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
