"use client";

import { useState } from "react";
import type { OutreachPack, VineyardOpportunity } from "@/lib/types";

export function OutreachComposer({ vineyard }: { vineyard: VineyardOpportunity }) {
  const [outreach, setOutreach] = useState<OutreachPack | null>(null);

  async function generate() {
    const response = await fetch("/api/outreach", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ opportunityId: vineyard.id })
    });
    const json = (await response.json()) as { outreach: OutreachPack };
    setOutreach(json.outreach);
  }

  return (
    <section className="workspace" id="outreach">
      <div className="page-head">
        <div>
          <p className="eyebrow">Owner outreach</p>
          <h2>Broker-ready messages</h2>
        </div>
        <button className="button" type="button" onClick={generate}>
          Generate outreach
        </button>
      </div>
      <pre>{outreach?.ownerEmail ?? "Generate owner email, follow-up, short message, meeting agenda, and NDA request list."}</pre>
      {outreach ? <p>{outreach.chineseSummary}</p> : null}
    </section>
  );
}
