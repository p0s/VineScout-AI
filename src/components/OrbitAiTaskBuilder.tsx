"use client";

import { useState } from "react";
import type { VineyardOpportunity } from "@/lib/types";
import { seededEyeOfGodResult } from "@/lib/seed-data";
import { buildEyeOfGodPrompt } from "@/lib/generators";
import { EvidenceBadge } from "./EvidenceBadge";

type StagedEvidence = {
  source: "eye_of_god_handoff";
  title: string;
  summary: string;
  confidence: number;
  createdAt: string;
};

function seededPasteFor(vineyard?: VineyardOpportunity) {
  return vineyard ? seededEyeOfGodResult.split("Domaine Valclaire").join(vineyard.name) : seededEyeOfGodResult;
}

export function OrbitAiTaskBuilder({
  vineyards,
  initialOpportunityId
}: {
  vineyards: VineyardOpportunity[];
  initialOpportunityId?: string;
}) {
  const initialId = vineyards.some((vineyard) => vineyard.id === initialOpportunityId)
    ? initialOpportunityId
    : vineyards[0]?.id ?? "";
  const initialVineyard = vineyards.find((vineyard) => vineyard.id === initialId) ?? vineyards[0];
  const [selectedId, setSelectedId] = useState(initialId);
  const [prompt, setPrompt] = useState("");
  const [paste, setPaste] = useState(seededPasteFor(initialVineyard));
  const [localEvidence, setLocalEvidence] = useState<StagedEvidence | null>(null);
  const [status, setStatus] = useState("Generate a task prompt, run it in Eye of God, then paste the result.");
  const selected = vineyards.find((vineyard) => vineyard.id === selectedId) ?? vineyards[0];

  function stageLocalEvidence(reason: string) {
    const confidence = paste.toLowerCase().includes("confidence: high") ? 84 : 76;
    setLocalEvidence({
      source: "eye_of_god_handoff",
      title: "Eye-of-God manual handoff",
      summary: paste.slice(0, 240),
      confidence,
      createdAt: new Date().toISOString()
    });
    setStatus(`${reason} Evidence is staged locally for this browser session with provenance eye_of_god_handoff.`);
  }

  async function generate() {
    try {
      const response = await fetch("/api/orbitai/task-prompt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ opportunityId: selectedId })
      });
      const json = (await response.json()) as { prompt?: string };
      setPrompt(json.prompt ?? (selected ? buildEyeOfGodPrompt(selected) : ""));
    } catch {
      setPrompt(selected ? buildEyeOfGodPrompt(selected) : "");
      setStatus("Generated a local task prompt because the API was unavailable.");
    }
  }

  async function attachEvidence() {
    if (paste.trim().length < 10) {
      setStatus("Paste at least 10 characters before attaching evidence.");
      return;
    }
    try {
      const response = await fetch("/api/orbitai/evidence", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ opportunityId: selectedId, rawText: paste, title: "Eye-of-God manual handoff" })
      });
      const json = (await response.json()) as {
        evidence?: { source: "eye_of_god_handoff"; title: string; summary: string; confidence: number; createdAt: string };
        error?: string;
      };
      if (!response.ok || !json.evidence) {
        stageLocalEvidence(json.error ?? "Hosted evidence write was unavailable.");
        return;
      }
      setLocalEvidence(json.evidence);
      setStatus(`Evidence attached with provenance ${json.evidence.source}.`);
    } catch {
      stageLocalEvidence("Network unavailable.");
    }
  }

  return (
    <div className="grid two">
      <section className="workspace">
        <label>
          Vineyard
          <select
            value={selectedId}
            onChange={(event) => {
              const nextId = event.target.value;
              const nextVineyard = vineyards.find((vineyard) => vineyard.id === nextId);
              setSelectedId(nextId);
              setPrompt(nextVineyard ? buildEyeOfGodPrompt(nextVineyard) : "");
              setPaste(seededPasteFor(nextVineyard));
              setLocalEvidence(null);
              setStatus("Generate a task prompt, run it in Eye of God, then paste the result.");
            }}
          >
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
        {localEvidence ? (
          <div className="evidence-preview">
            <div className="badge-row">
              <EvidenceBadge source={localEvidence.source} />
              <span className="badge">{localEvidence.confidence}% confidence</span>
              <span className="badge">+8 diligence confidence preview</span>
            </div>
            <p>{localEvidence.summary}</p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
