import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";

export default function LandingPage() {
  return (
    <>
      <AppHeader />
      <main>
        <section className="hero">
          <div className="hero-inner">
            <p className="eyebrow">AI vineyard diligence for Chinese premium wine expansion</p>
            <h1>VineScout AI</h1>
            <p>
              China’s premium wine and beverage companies are moving from simple importing to supply control and brand
              localization. VineScout AI ranks Western vineyards, validates harvest risk with satellite intelligence, and
              moves teams from shortlist to deal outreach in one day.
            </p>
            <div className="badge-row">
              <Link className="button" href="/app">
                Demo with fictional vineyard portfolio
              </Link>
              <Link className="button secondary" href="/app/search">
                View ranked opportunities
              </Link>
            </div>
          </div>
        </section>
        <section className="section grid three">
          {[
            ["Profile", "Capture buyer strategy, budget, channels, target products, and risk appetite."],
            ["Rank vineyards", "Score sourcing, minority investment, and acquisition fit with transparent formulas."],
            ["Validate", "Generate OrbitAI Eye-of-God handoffs and attach manual evidence with provenance."]
          ].map(([title, copy]) => (
            <div key={title} className="workspace">
              <p className="eyebrow">{title}</p>
              <h3>{copy}</h3>
            </div>
          ))}
        </section>
        <section className="section grid two">
          <div>
            <p className="eyebrow">Why AI is core</p>
            <h2>From scattered diligence to a scored deal room</h2>
          </div>
          <p>
            AI parses buyer goals, explains fit, drafts memos, prepares owner outreach, and structures OrbitAI prompts.
            Deterministic seeded mode always works locally; OrbitAI and OpenAI stay server-only when configured.
          </p>
        </section>
      </main>
    </>
  );
}
