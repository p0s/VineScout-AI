"use client";

import { useState } from "react";
import type { VineyardOpportunity } from "@/lib/types";
import { seededEyeOfGodResult } from "@/lib/seed-data";

export function OrbitAiTaskBuilder({ vineyards }: { vineyards: VineyardOpportunity[] }) {
  const [selectedId, setSelectedId] = useState(vineyards[0]?.id ?? "");
  const [prompt, setPrompt] = useState("");
  const [paste, setPaste] = useState(seededEyeOfGodResult);
  const [status, setStatus] = useState("Generate a task prompt, run it in Eye of God, then paste the result.");

  async function generate() {
    const response = await fetch("/api/orbitai/task-prompt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ opportunityId: selectedId })
    });
    const json = (await response.json()) as { prompt: string };
    setPrompt(json.prompt);
  }

  async function attachEvidence() {
    const response = await fetch("/api/orbitai/evidence", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ opportunityId: selectedId, rawText: paste, title: "Eye-of-God manual handoff" })
    });
    const json = (await response.json()) as { evidence?: { source: string }; error?: string };
    setStatus(json.evidence ? `Evidence attached with provenance ${json.evidence.source}.` : (json.error ?? "Unable to attach evidence."));
  }

  return (
    <div className="grid two">
      <section className="workspace">
        <label>
          Vineyard
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            {vineyards.map((vineyard) => (
              <option value={vineyard.id} key={vineyard.id}>
                {vineyard.name}
              </option>
            ))}
          </select>
        </label>
        <div className="badge-row">
          <button className="button" type="button" onClick={generate}>
            Generate OrbitAI task
          </button>
          <button className="button secondary" type="button" onClick={() => navigator.clipboard?.writeText(prompt)}>
            Copy prompt
          </button>
        </div>
        <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Eye-of-God prompt appears here." />
      </section>
      <aside className="workspace">
        <h3>Manual result paste</h3>
        <p>OrbitAI direct satellite tasking is not assumed. Pasted results become `eye_of_god_handoff` evidence.</p>
        <textarea value={paste} onChange={(event) => setPaste(event.target.value)} />
        <button className="button" type="button" onClick={attachEvidence}>
          Attach evidence
        </button>
        <p>{status}</p>
      </aside>
    </div>
  );
}
