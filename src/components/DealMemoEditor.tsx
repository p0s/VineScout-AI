"use client";

import { useState } from "react";
import type { DealMemo, VineyardOpportunity } from "@/lib/types";

export function DealMemoEditor({ vineyards }: { vineyards: VineyardOpportunity[] }) {
  const [selectedId, setSelectedId] = useState(vineyards[0]?.id ?? "");
  const [memo, setMemo] = useState<DealMemo | null>(null);
  const [showChinese, setShowChinese] = useState(true);

  async function generate() {
    const response = await fetch("/api/memos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ opportunityId: selectedId })
    });
    const json = (await response.json()) as { memo: DealMemo };
    setMemo(json.memo);
  }

  function copyMarkdown() {
    if (memo) void navigator.clipboard?.writeText(memo.markdown);
  }

  function downloadMarkdown() {
    if (!memo) return;
    const blob = new Blob([memo.markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${memo.opportunityId}-deal-memo.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid two">
      <section className="workspace">
        <label>
          Opportunity
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
            Generate memo
          </button>
          <button className="button secondary" type="button" onClick={copyMarkdown} disabled={!memo}>
            Copy markdown
          </button>
          <button className="button secondary" type="button" onClick={downloadMarkdown} disabled={!memo}>
            Export .md
          </button>
          <button className="button secondary" type="button" onClick={() => window.print()} disabled={!memo}>
            Print view
          </button>
        </div>
        {memo ? (
          <>
            <div className="badge-row">
              <button className="button secondary" type="button" onClick={() => setShowChinese((value) => !value)}>
                {showChinese ? "Hide Chinese summary" : "Show Chinese summary"}
              </button>
            </div>
            {showChinese ? (
              <>
                <h3>Bilingual summary</h3>
                <p>{memo.chineseSummary}</p>
              </>
            ) : null}
          </>
        ) : null}
      </section>
      <article className="memo-output print-memo" aria-label="Deal memo output">
        {memo?.markdown ?? "Generate a deal memo to produce the export-ready diligence narrative."}
      </article>
    </div>
  );
}
